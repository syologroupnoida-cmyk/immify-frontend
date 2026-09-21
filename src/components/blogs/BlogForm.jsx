import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Alert, Avatar, Box, Button, CircularProgress, Divider, FormControlLabel, Paper, Switch, TextField, Typography,
} from '@mui/material';
import { Cancel as CancelIcon, CloudUpload as UploadIcon, Save as SaveIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';
import { BLOGS_ENDPOINT, fetchBlog, getBlogError } from './blogApi';

const emptyBlog = {
    slug: '', title: '', excerpt: '', category: '', readTime: '', image: '', content: '', isActive: true,
};

function fromBlog(blog) {
    return {
        slug: blog.slug || '',
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        readTime: blog.readTime || '',
        image: blog.image || '',
        content: Array.isArray(blog.content) ? blog.content.map(String).join('\n\n') : String(blog.content || ''),
        isActive: blog.isActive ?? true,
    };
}

function normalizeImage(value) {
    const markdownLink = value.trim().match(/^\[[^\]]+\]\((https?:\/\/[^)]+)\)$/i);
    return markdownLink?.[1] || value.trim();
}

export default function BlogForm({ mode = 'add' }) {
    const router = useRouter();
    const isEdit = mode === 'edit';
    const blogId = typeof router.query.id === 'string' ? router.query.id : '';
    const [form, setForm] = useState(emptyBlog);
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const previewUrl = normalizeImage(form.image);

    useEffect(() => {
        if (!isEdit || !router.isReady) return;
        if (!blogId) {
            queueMicrotask(() => { setError('A blog ID is required.'); setLoading(false); });
            return;
        }
        let active = true;
        fetchBlog(blogId)
            .then((blog) => { if (active) setForm(fromBlog(blog)); })
            .catch((requestError) => { if (active) setError(getBlogError(requestError)); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [isEdit, router.isReady, blogId]);

    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const uploadImage = async (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Choose an image file to upload.');
            return;
        }
        setError('');
        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            uploadData.append('purpose', 'blog-image');
            const response = await MainApi.post('/uploads/image', uploadData);
            const result = response?.data;
            const imageUrl = result?.data?.url || result?.data?.imageUrl || result?.url || result?.imageUrl || result?.data?.secure_url || result?.secure_url;
            if (!imageUrl) throw new Error('Upload succeeded but no image URL was returned.');
            update('image', imageUrl);
        } catch (requestError) {
            setError(getBlogError(requestError));
        } finally {
            setUploading(false);
        }
    };

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        const content = form.content.trim();
        const image = normalizeImage(form.image);
        if (!form.slug.trim() || !form.title.trim() || !form.excerpt.trim() || !form.category.trim() || !form.readTime.trim() || !image || !content) {
            setError('Complete every field and add the content paragraph.');
            return;
        }
        try {
            const url = new URL(image);
            if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Invalid image URL');
        } catch {
            setError('Enter a valid image URL.');
            return;
        }
        const payload = {
            slug: form.slug.trim(), title: form.title.trim(), excerpt: form.excerpt.trim(),
            category: form.category.trim(), readTime: form.readTime.trim(), image,
            content: [content], isActive: Boolean(form.isActive),
        };
        setSaving(true);
        try {
            const response = isEdit
                ? await MainApi.patch(`${BLOGS_ENDPOINT}/${encodeURIComponent(blogId)}`, payload)
                : await MainApi.post(BLOGS_ENDPOINT, payload);
            const apiMessage = response?.data?.message || response?.data?.msg || response?.data?.data?.message;
            if (response?.data?.success === false) throw new Error(apiMessage || 'Unable to save blog.');
            const result = await Swal.fire({
                icon: 'success',
                title: isEdit ? 'Blog Updated' : 'Blog Created',
                text: apiMessage || (isEdit ? 'Blog updated successfully.' : 'Blog created successfully.'),
                confirmButtonText: 'OK',
                confirmButtonColor: '#2563eb',
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            if (result.isConfirmed) await router.push('/admin/blog-list');
        } catch (requestError) {
            const message = getBlogError(requestError);
            setError(message);
            await Swal.fire({ icon: 'error', title: 'Unable to save blog', text: message, confirmButtonText: 'OK', confirmButtonColor: '#2563eb' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ bgcolor: '#fff', width: '100%' }}>
            <Paper elevation={0} sx={{ width: '100%', p: 1.75, bgcolor: '#fff', borderRadius: '4px 4px 0 0', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: 18 }}>
                    {isEdit ? 'Edit Blog' : 'Add Blog'}
                </Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 3, width: '100%', borderRadius: '4px', boxShadow: 'none', bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                {loading ? <Box sx={{ py: 8, textAlign: 'center' }}><CircularProgress /></Box> : (
                    <Box component="form" onSubmit={submit} sx={{ minHeight: 'calc(100dvh - 240px)', display: 'flex', flexDirection: 'column' }}>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>Blog Information</Typography>
                            <Divider />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
                            <TextField fullWidth size="small" label="Title" required value={form.title} onChange={(event) => {
                                const title = event.target.value;
                                setForm((current) => ({ ...current, title, slug: slugEdited ? current.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }));
                            }} />
                            <TextField fullWidth size="small" label="Slug" required value={form.slug} onChange={(event) => { setSlugEdited(true); update('slug', event.target.value); }} helperText="Used in the blog URL" />
                            <TextField fullWidth size="small" label="Category" required value={form.category} onChange={(event) => update('category', event.target.value)} />
                            <TextField fullWidth size="small" label="Read Time" required placeholder="5 min read" value={form.readTime} onChange={(event) => update('readTime', event.target.value)} />
                            <Box sx={{ gridColumn: { md: 'span 2' }, display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr) 48px', sm: 'minmax(0, 1fr) minmax(0, 1fr) 48px' }, gap: 2, alignItems: 'start' }}>
                                <TextField fullWidth size="small" label="Image Link" required value={form.image} onChange={(event) => update('image', event.target.value)} placeholder="https://example.com/blog-image.jpg" />
                                <Button component="label" variant="outlined" startIcon={uploading ? <CircularProgress size={16} /> : <UploadIcon />}
                                    disabled={uploading || saving} sx={{ height: 40, width: '100%', minWidth: 0, textTransform: 'none', gridRow: { xs: 2, sm: 1 } }}>
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input hidden type="file" accept="image/*" onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        event.target.value = '';
                                        uploadImage(file);
                                    }} />
                                </Button>
                                {/^https?:\/\//i.test(previewUrl) && <Avatar variant="rounded" src={previewUrl} alt="Blog image preview" sx={{ width: 48, height: 40, border: '1px solid #e2e8f0', bgcolor: '#f8fafc', borderRadius: 1, gridColumn: { xs: 2, sm: 3 }, gridRow: 1 }} />}
                            </Box>
                        </Box>
                        <Box sx={{ mt: 3, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>Blog Content</Typography>
                            <Divider />
                        </Box>
                        <TextField fullWidth size="small" label="Excerpt" required multiline minRows={2} value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} sx={{ mb: 2.5 }} />
                        <TextField fullWidth size="small" multiline minRows={5} label="Paragraph" required value={form.content} onChange={(event) => update('content', event.target.value)} />
                        <Box sx={{ mt: 3 }}>
                            <FormControlLabel control={<Switch checked={form.isActive} onChange={(event) => update('isActive', event.target.checked)} />} label="Active" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 'auto', pt: 3, width: '100%' }}>
                            <Button type="button" variant="outlined" startIcon={<CancelIcon />} onClick={() => router.push('/admin/blog-list')} disabled={saving || uploading} sx={{ textTransform: 'none' }}>Cancel</Button>
                            <Button type="submit" variant="contained" startIcon={saving ? <CircularProgress color="inherit" size={16} /> : <SaveIcon />} disabled={saving || uploading || (isEdit && !blogId)} sx={{ bgcolor: '#2563eb', textTransform: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}>
                                {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
