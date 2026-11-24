import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Divider, FormControlLabel, Paper, Switch, TextField, Typography } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const emptyForm = { name: '', description: '', credits: '', priceRupees: '', currency: 'INR', isActive: true, displayOrder: '1' };

function toPaise(value) {
    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return '';
    const [rupees, fraction = ''] = value.split('.');
    const amount = Number(rupees) * 100 + Number(fraction.padEnd(2, '0'));
    return Number.isSafeInteger(amount) ? amount : '';
}

export default function AddCreditPack() {
    const router = useRouter();
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

    const handleCreate = async (event) => {
        event.preventDefault();
        const credits = Number(form.credits);
        const priceInPaise = toPaise(form.priceRupees);
        const displayOrder = Number(form.displayOrder);
        if (!form.name.trim() || form.credits === '' || priceInPaise === '' || form.displayOrder === '' || !Number.isSafeInteger(credits) || credits <= 0 || !Number.isSafeInteger(displayOrder) || displayOrder < 0) {
            setError('Enter a name, positive whole-number credits, a valid rupee price with up to two decimal places, and a non-negative whole-number display order.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            await MainApi.post('/super-admin/credit-packs', { name: form.name.trim(), description: form.description.trim(), credits, priceInPaise, currency: form.currency.trim().toUpperCase(), isActive: form.isActive, displayOrder });
            setForm(emptyForm);
            await Swal.fire({ icon: 'success', title: 'Credit Pack Created', text: 'Credit pack created successfully.', confirmButtonText: 'OK', confirmButtonColor: '#2563eb' });
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Unable to create credit pack.');
        } finally {
            setSaving(false);
        }
    };

    return <Box sx={{ bgcolor: '#fff', width: '100%' }}>
        <Paper elevation={0} sx={{ width: '100%', p: 1.75, bgcolor: '#fff', borderRadius: '4px 4px 0 0', borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: 18 }}>Add Credit Pack</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 3, width: '100%', borderRadius: '4px', boxShadow: 'none', bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
            <Box component="form" onSubmit={handleCreate} sx={{ minHeight: 'calc(100dvh - 240px)', display: 'flex', flexDirection: 'column' }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box sx={{ mb: 2 }}><Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>Credit Pack Information</Typography><Divider /></Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
                    <TextField size="small" label="Name" value={form.name} onChange={update('name')} required fullWidth />
                    <TextField size="small" label="Credits" type="number" value={form.credits} onChange={update('credits')} slotProps={{ htmlInput: { min: 1, step: 1 } }} required fullWidth />
                    <TextField size="small" label="Price in rupees" type="number" value={form.priceRupees} onChange={update('priceRupees')} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} required fullWidth />
                    <TextField size="small" label="Price in paise" value={toPaise(form.priceRupees)} helperText="Calculated from the rupee price." slotProps={{ input: { readOnly: true } }} fullWidth />
                    <TextField size="small" label="Currency" value={form.currency} slotProps={{ input: { readOnly: true } }} fullWidth />
                    <TextField size="small" label="Display order" type="number" value={form.displayOrder} onChange={update('displayOrder')} slotProps={{ htmlInput: { min: 0, step: 1 } }} required fullWidth />
                    <FormControlLabel control={<Switch checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />} label="Active" />
                </Box>
                <TextField sx={{ mt: 2.5 }} size="small" label="Description" value={form.description} onChange={update('description')} multiline minRows={3} fullWidth />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mt: 'auto', pt: 3, width: '100%' }}>
                    <Button type="button" variant="outlined" startIcon={<CancelIcon />} onClick={() => router.push('/admin/credit-packs')} disabled={saving} sx={{ textTransform: 'none' }}>Cancel</Button>
                    <Button type="submit" variant="contained" startIcon={saving ? <CircularProgress color="inherit" size={16} /> : <SaveIcon />} disabled={saving} sx={{ bgcolor: '#2563eb', textTransform: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}>{saving ? 'Creating...' : 'Create Pack'}</Button>
                </Box>
            </Box>
        </Paper>
    </Box>;
}
