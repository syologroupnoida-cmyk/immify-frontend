import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert, Box, Button, Chip, CircularProgress, InputAdornment, Paper, Table,
    TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MainApi from '@/util/MainApi';

const ADMIN_ENDPOINT = '/super-admin/credit-packs';
const VENDOR_ENDPOINT = '/vendor/credits/packs';

export function extractPacks(payload) {
    const data = payload?.data ?? payload;
    const packs = Array.isArray(data) ? data : data?.creditPacks ?? data?.credit_packs ?? data?.packs ?? data?.items ?? data?.content ?? data?.results ?? data?.data;
    return Array.isArray(packs) ? packs : [];
}

export function priceLabel(pack) {
    const amount = Number(pack.priceInPaise ?? pack.price_in_paise);
    if (!Number.isFinite(amount)) return '—';
    const currency = pack.currency || 'INR';
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount / 100);
    } catch {
        return `${currency} ${(amount / 100).toFixed(2)}`;
    }
}

export default function CreditPacks({ admin = false }) {
    const [packs, setPacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const loadPacks = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await MainApi.get(admin ? ADMIN_ENDPOINT : VENDOR_ENDPOINT);
            setPacks(extractPacks(response.data));
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Unable to load credit packs.');
        } finally {
            setLoading(false);
        }
    }, [admin]);

    useEffect(() => { queueMicrotask(loadPacks); }, [loadPacks]);

    const filtered = packs.filter((pack) => `${pack.name || ''} ${pack.description || ''}`.toLowerCase().includes(search.toLowerCase()));
    const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper elevation={0} sx={{ height: 'calc(100dvh - 104px)', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 2, md: 3 }, border: '1px solid #e6eaf0', borderRadius: 2 }}>
            <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 18 }, fontWeight: 600, pb: 1, mb: 1, borderBottom: '1px solid #e2e7ed' }}>Credits Pack List</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={loadPacks}>Retry</Button>}>{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <TextField placeholder="Search packs..." size="small" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0); }} sx={{ width: { xs: '100%', sm: 280 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }, htmlInput: { 'aria-label': 'Search packs' } }} />
            </Box>
            <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto', border: '1px solid #e6eaf0', borderRadius: 1 }}>
                <Table stickyHeader sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}><TableRow><TableCell>Name</TableCell><TableCell>Description</TableCell><TableCell>Credits</TableCell><TableCell>Price</TableCell><TableCell>Order</TableCell>{admin && <TableCell>Status</TableCell>}</TableRow></TableHead>
                    <TableBody>
                        {loading ? <TableRow><TableCell colSpan={admin ? 6 : 5} align="center"><CircularProgress size={24} /></TableCell></TableRow> : visible.length ? visible.map((pack, index) => <TableRow hover key={pack.id || pack._id || `${pack.name}-${index}`}><TableCell>{pack.name || '—'}</TableCell><TableCell>{pack.description || '—'}</TableCell><TableCell>{pack.credits ?? '—'}</TableCell><TableCell>{priceLabel(pack)}</TableCell><TableCell>{pack.displayOrder ?? pack.display_order ?? '—'}</TableCell>{admin && <TableCell>{(pack.isActive ?? pack.is_active) == null ? '—' : <Chip size="small" label={(pack.isActive ?? pack.is_active) ? 'Active' : 'Inactive'} color={(pack.isActive ?? pack.is_active) ? 'success' : 'default'} />}</TableCell>}</TableRow>) : <TableRow><TableCell colSpan={admin ? 6 : 5} align="center">{error ? 'Unable to load credit packs.' : 'No credit packs found.'}</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination component="div" count={filtered.length} page={page} onPageChange={(_, next) => setPage(next)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(event) => { setRowsPerPage(Number(event.target.value)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} sx={{ flexShrink: 0, '& .MuiTablePagination-toolbar': { minHeight: 40 }, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { my: 0 } }} />
        </Paper>
    );
}
