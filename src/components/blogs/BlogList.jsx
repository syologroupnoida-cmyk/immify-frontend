import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer,
    TableHead, TablePagination, TableRow, TextField, Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreIcon, Search as SearchIcon, Visibility as ViewIcon } from '@mui/icons-material';
import MainApi from '@/util/MainApi';
import { BLOGS_ENDPOINT, fetchBlog, getBlogError, getBlogId, unwrapBlogs } from './blogApi';

export default function BlogList() {
    const router = useRouter();
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [statusTab, setStatusTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const loadBlogs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await MainApi.get(BLOGS_ENDPOINT, { params: { take: rowsPerPage, skip: page * rowsPerPage } });
            const result = unwrapBlogs(response.data);
            setRows(result.rows);
            setTotal(result.total);
        } catch (requestError) {
            setError(getBlogError(requestError));
            setRows([]);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

    useEffect(() => { queueMicrotask(loadBlogs); }, [loadBlogs]);

    const visibleRows = useMemo(() => rows.filter((blog) => {
        const matchesStatus = statusTab === 'all' || Boolean(blog.isActive) === (statusTab === 'active');
        const query = searchTerm.trim().toLowerCase();
        return matchesStatus && (!query || [blog.title, blog.slug, blog.category, blog.excerpt]
            .some((value) => String(value || '').toLowerCase().includes(query)));
    }), [rows, statusTab, searchTerm]);

    const openMenu = (event, blog) => {
        setMenuAnchor(event.currentTarget);
        setSelected(blog);
    };
    const closeMenu = () => setMenuAnchor(null);

    const viewBlog = async () => {
        const id = getBlogId(selected);
        closeMenu();
        if (!id) return;
        setDetail(selected);
        setDetailLoading(true);
        try {
            setDetail(await fetchBlog(id));
        } catch (requestError) {
            setError(getBlogError(requestError));
        } finally {
            setDetailLoading(false);
        }
    };

    const editBlog = () => {
        const id = getBlogId(selected);
        closeMenu();
        if (id) router.push(`/admin/edit-blog?id=${encodeURIComponent(id)}`);
    };

    const confirmDelete = () => {
        setDeleteTarget(selected);
        closeMenu();
    };

    const deleteBlog = async () => {
        const id = getBlogId(deleteTarget);
        if (!id) return;
        setDeleting(true);
        setError('');
        try {
            await MainApi.delete(`${BLOGS_ENDPOINT}/${encodeURIComponent(id)}`);
            setDeleteTarget(null);
            if (rows.length === 1 && page > 0) setPage(page - 1);
            else await loadBlogs();
        } catch (requestError) {
            setError(getBlogError(requestError));
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Box sx={{ width: '100%', height: 'calc(100dvh - 104px)', minHeight: 0, overflow: 'hidden' }}>
            <Paper elevation={0} sx={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 1, md: 1.5 }, borderRadius: 2, border: '1px solid #e6eaf0', boxShadow: '0 2px 8px rgba(31, 45, 61, 0.06)' }}>
                <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 18 }, fontWeight: 600, pb: 1, mb: 1, borderBottom: '1px solid #e2e7ed' }}>Blog List</Typography>
                {error && <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>{error}</Alert>}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}>
                        {[
                            { label: 'All', value: 'all', color: 'primary' },
                            { label: 'Active', value: 'active', color: 'success' },
                            { label: 'Inactive', value: 'inactive', color: 'error' },
                        ].map((filter) => (
                            <Chip key={filter.value} label={filter.label} color={filter.color}
                                variant={statusTab === filter.value ? 'filled' : 'outlined'}
                                onClick={() => setStatusTab(filter.value)}
                                sx={{ minWidth: 68, height: 28, borderRadius: '14px', fontSize: 12, fontWeight: 700, '& .MuiChip-label': { px: 1.5 } }} />
                        ))}
                    </Box>
                    <TextField placeholder="Search blogs by title, slug or category" size="small"
                        value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
                        sx={{ width: { xs: '100%', sm: 330 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
                </Box>
                <TableContainer sx={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto', border: '1px solid #e6eaf0', borderRadius: '4px' }}>
                    <Table stickyHeader size="small" sx={{ minWidth: 760, tableLayout: 'fixed', '& .MuiTableCell-root': { px: 1.25, py: 1, fontSize: 13 }, '& .MuiTableHead-root .MuiTableCell-root': { py: 1.15 }, '& .MuiTableBody-root .MuiTableRow-root': { height: 48 } }}>
                        <TableHead sx={{ bgcolor: '#f5f8fb' }}>
                            <TableRow>
                                <TableCell sx={{ width: '31%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Blog</TableCell>
                                <TableCell sx={{ width: '22%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Slug</TableCell>
                                <TableCell sx={{ width: '17%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Category</TableCell>
                                <TableCell sx={{ width: '12%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Read Time</TableCell>
                                <TableCell sx={{ width: '10%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Status</TableCell>
                                <TableCell align="right" sx={{ width: '8%', fontWeight: 700, bgcolor: '#f5f8fb', color: '#344054' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow> :
                                visibleRows.length ? visibleRows.map((blog) => (
                                    <TableRow key={getBlogId(blog) || blog.slug} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600} noWrap>{blog.title || 'Untitled'}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.slug || '-'}</TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.category || '-'}</TableCell>
                                        <TableCell>{blog.readTime || '-'}</TableCell>
                                        <TableCell><Chip size="small" label={blog.isActive ? 'Active' : 'Inactive'} color={blog.isActive ? 'success' : 'default'} /></TableCell>
                                        <TableCell align="right"><IconButton size="small" sx={{ width: 28, height: 28 }} aria-label={`Actions for ${blog.title || 'blog'}`} disabled={!getBlogId(blog)} onClick={(event) => openMenu(event, blog)}><MoreIcon /></IconButton></TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}>No blogs found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination component="div" count={total} page={page} rowsPerPage={rowsPerPage} rowsPerPageOptions={[10, 20, 50, 100]}
                    onPageChange={(_, nextPage) => setPage(nextPage)}
                    onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }}
                    sx={{ flexShrink: 0, borderTop: '1px solid #eef1f4', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { my: 0 } }} />
            </Paper>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <MenuItem onClick={viewBlog}><ListItemIcon><ViewIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText>View Details</ListItemText></MenuItem>
                <MenuItem onClick={editBlog}><ListItemIcon><EditIcon fontSize="small" color="primary" /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>
                <MenuItem onClick={confirmDelete} sx={{ color: 'error.main' }}><ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon><ListItemText>Delete</ListItemText></MenuItem>
            </Menu>

            <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
                <DialogTitle>{detail?.title || 'Blog Details'}</DialogTitle>
                <DialogContent dividers>
                    {detailLoading ? <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box> : detail && <Stack spacing={2}>
                        {detail.image && <Box component="img" src={detail.image} alt="" sx={{ width: '100%', maxHeight: 230, objectFit: 'cover', borderRadius: 1 }} />}
                        <Typography variant="body2" color="text.secondary">{detail.category} | {detail.readTime} | {detail.isActive ? 'Active' : 'Inactive'}</Typography>
                        <Typography variant="body2" fontWeight={600}>/{detail.slug}</Typography>
                        <Typography variant="body1">{detail.excerpt}</Typography>
                        {(Array.isArray(detail.content) ? detail.content : []).map((paragraph, index) => <Typography key={index} variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{paragraph}</Typography>)}
                    </Stack>}
                </DialogContent>
                <DialogActions><Button onClick={() => setDetail(null)}>Close</Button></DialogActions>
            </Dialog>

            <Dialog open={Boolean(deleteTarget)} onClose={() => !deleting && setDeleteTarget(null)}>
                <DialogTitle>Delete blog?</DialogTitle>
                <DialogContent><Typography variant="body2">This will permanently delete {deleteTarget?.title || 'this blog'}.</Typography></DialogContent>
                <DialogActions>
                    <Button disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancel</Button>
                    <Button color="error" variant="contained" disabled={deleting} onClick={deleteBlog}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
