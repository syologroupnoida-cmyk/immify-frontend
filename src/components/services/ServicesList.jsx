'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    TextField,
    Button,
    Chip,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Alert,
    Typography,
    Box,
    InputAdornment,
} from '@mui/material';
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Category as CategoryIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import MainApi from '@/util/MainApi';

// Styled components
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: '#f1f5f9',
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 'none',
    },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const colors = {
        active: { bg: '#dcfce7', color: '#166534' },
        inactive: { bg: '#fee2e2', color: '#991b1b' },
        pending: { bg: '#fef3c7', color: '#92400e' },
        default: { bg: '#f1f5f9', color: '#475569' },
    };
    const statusColor = colors[status?.toLowerCase()] || colors.default;
    return {
        backgroundColor: statusColor.bg,
        color: statusColor.color,
        fontWeight: 500,
        fontSize: '12px',
        height: '24px',
        '& .MuiChip-label': {
            padding: '0 8px',
        },
    };
});

// Constants
const SERVICE_CATEGORIES_ENDPOINT = '/super-admin/service-categories';
const DELETE_SERVICE_ENDPOINT = '/super-admin/services';
const DELETE_CATEGORY_ENDPOINT = '/super-admin/service-categories';

function getCategoryServices(category) {
    return Array.isArray(category?.services) ? category.services : [];
}

function getServiceId(service, index) {
    return service?.id || service?._id || service?.serviceId || service?.uuid || '';
}

function getServiceName(service) {
    if (typeof service === 'string') return service;
    return service?.name || service?.title || service?.serviceName || 'Unnamed Service';
}

// Main Component
const ServicesList = () => {
    const router = useRouter();
    const tableScrollRef = useRef(null);

    // State
    const [services, setServices] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');

    // Menu state
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuService, setMenuService] = useState(null);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteType, setDeleteType] = useState(''); // 'service' or 'category'
    const [deleteItem, setDeleteItem] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [detailsCategory, setDetailsCategory] = useState(null);

    const trimmedSearch = searchTerm.trim();
    const searchQuery = trimmedSearch.length >= 2 ? trimmedSearch : '';

    // Fetch data
    const fetchServices = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const params = {
                page: page,
                size: rowsPerPage,
            };

            if (searchQuery) params.search = searchQuery;
            if (sortBy && sortOrder) {
                params.sortBy = sortBy;
                params.sortOrder = sortOrder.toUpperCase();
            }

            const response = await MainApi.get(SERVICE_CATEGORIES_ENDPOINT, { params });
            const responseData = response?.data?.data ?? response?.data ?? {};
            const serviceData = Array.isArray(responseData)
                ? responseData
                : responseData.content || responseData.categories || responseData.items || responseData.results || [];
            const total = responseData.total ?? responseData.totalElements ?? responseData.totalCount ?? serviceData.length;

            setServices(serviceData);
            setTotalCount(Number(total) || 0);
        } catch (error) {
            setServices([]);
            setTotalCount(0);
            setFetchError(error?.response?.data?.message || error?.message || 'Unable to load services.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchQuery, sortBy, sortOrder]);

    useEffect(() => {
        queueMicrotask(fetchServices);
    }, [fetchServices]);

    // Handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleSort = (column) => {
        const nextOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortBy(column);
        setSortOrder(nextOrder);
        setPage(0);
    };

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleServiceSelection = (serviceId, checked) => {
        setSelectedServiceIds((current) => (
            checked ? [...current, serviceId] : current.filter((id) => id !== serviceId)
        ));
    };

    const handleMenuOpen = (event, service) => {
        setMenuAnchor(event.currentTarget);
        setMenuService(service);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuService(null);
    };

    const handleTableKeyDown = (event) => {
        const target = event.currentTarget;
        const scrollAmount = event.shiftKey ? 120 : 48;
        const pageAmount = target.clientHeight - 48;
        let handled = true;

        if (event.key === 'ArrowDown') target.scrollTop += scrollAmount;
        else if (event.key === 'ArrowUp') target.scrollTop -= scrollAmount;
        else if (event.key === 'ArrowRight') target.scrollLeft += scrollAmount;
        else if (event.key === 'ArrowLeft') target.scrollLeft -= scrollAmount;
        else if (event.key === 'PageDown') target.scrollTop += pageAmount;
        else if (event.key === 'PageUp') target.scrollTop -= pageAmount;
        else if (event.key === 'Home') target.scrollLeft = 0;
        else if (event.key === 'End') target.scrollLeft = target.scrollWidth;
        else handled = false;

        if (handled) event.preventDefault();
    };

    // Handle Edit Service
    const handleEditService = (service) => {
        handleMenuClose();
        router.push(`/service/edit-service?id=${service.id}`);
    };

    const handleViewDetails = (category) => {
        handleMenuClose();
        setDetailsCategory(category);
        setDetailsDialogOpen(true);
    };

    // Handle Delete Service
    const handleDeleteService = (category) => {
        handleMenuClose();
        setDeleteType('service');
        setDeleteItem(category);
        setSelectedServiceIds([]);
        setDeleteDialogOpen(true);
    };

    // Handle Delete Category
    const handleDeleteCategory = (category) => {
        handleMenuClose();
        setDeleteType('category');
        setDeleteItem(category);
        setSelectedServiceIds([]);
        setDeleteDialogOpen(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        if (!deleteItem) return;
        
        setDeleteLoading(true);
        try {
            let response;
            let successMessage = '';

            if (deleteType === 'service') {
                if (selectedServiceIds.length === 0) {
                    throw new Error('Please select at least one service to delete.');
                }
                await Promise.all(selectedServiceIds.map((serviceId) => MainApi.delete(`${DELETE_SERVICE_ENDPOINT}/${serviceId}`)));
                successMessage = selectedServiceIds.length === 1 ? 'Service deleted successfully!' : 'Services deleted successfully!';
            } else if (deleteType === 'category') {
                response = await MainApi.delete(`${DELETE_CATEGORY_ENDPOINT}/${deleteItem.id}`);
                successMessage = 'Category deleted successfully!';
            }

            await Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: successMessage,
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'services-swal-container',
                },
            });

            setDeleteDialogOpen(false);
            setDeleteItem(null);
            setDeleteType('');
            setSelectedServiceIds([]);
            fetchServices();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || error?.message || 'Failed to delete. Please try again.',
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'services-swal-container',
                },
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Helper: render status chip
    const renderStatusChip = (status) => {
        const label = status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
        return <StatusChip label={label} status={status} size="small" />;
    };

    // Helper: format date
    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    // Helper: get service count
    const getServiceCount = (category) => {
        return getCategoryServices(category).length || category.serviceCount || category.count || 0;
    };

    // Columns
    const columns = [
        { id: 'name', label: 'Category Name', width: 200, sortField: 'name' },
        { id: 'description', label: 'Description', width: 250 },
        { id: 'services', label: 'Services', width: 150 },
        { id: 'status', label: 'Status', width: 120, sortField: 'status' },
        { id: 'createdAt', label: 'Created On', width: 140, sortField: 'createdAt' },
    ];

    return (
        <Box sx={{ width: '100%', height: 'calc(100dvh - 104px)', minHeight: 0, m: 0, overflow: 'hidden' }}>
            <style jsx global>{`
                .services-swal-container {
                    z-index: 2500 !important;
                }
            `}</style>
            <Paper elevation={0} sx={{ 
                width: '100%', 
                height: '100%', 
                minHeight: 0, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden', 
                p: { xs: 1, md: 1.5 }, 
                borderRadius: 2, 
                border: '1px solid #e6eaf0', 
                boxShadow: '0 2px 8px rgba(31, 45, 61, 0.06)' 
            }}>
                <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 18 }, fontWeight: 600, pb: 1, mb: 1, borderBottom: '1px solid #e2e7ed' }}>
                    Service Categories
                </Typography>

                {/* Search */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <TextField
                        placeholder="Search categories by name..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ width: { xs: '100%', sm: 280 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* Table */}
                <TableContainer
                    ref={tableScrollRef}
                    tabIndex={0}
                    role="region"
                    aria-label="Scrollable service categories table"
                    onKeyDown={handleTableKeyDown}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'auto',
                        border: '1px solid #e6eaf0',
                        borderRadius: '4px',
                        outline: 'none',
                        '&:focus-visible': {
                            boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.28)',
                        },
                    }}
                >
                    <Table
                        stickyHeader
                        size="small"
                        sx={{
                            minWidth: 900,
                            tableLayout: 'fixed',
                            '& .MuiTableCell-root': { px: 1.5, py: 1.1, fontSize: 13 },
                            '& .MuiTableHead-root .MuiTableCell-root': { py: 1.15 },
                            '& .MuiTableBody-root .MuiTableRow-root': { height: 48 },
                        }}
                    >
                        <TableHead sx={{ bgcolor: '#f5f8fb' }}>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.id} sx={{ width: col.width, color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec', whiteSpace: 'nowrap' }}>
                                        {!col.sortField ? (
                                            col.label
                                        ) : (
                                            <TableSortLabel
                                                active={sortBy === col.sortField}
                                                direction={sortBy === col.sortField ? sortOrder : 'asc'}
                                                onClick={() => handleSort(col.sortField)}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ width: 100, color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={30} />
                                        <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>Loading categories...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : fetchError ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ color: 'error.main', py: 4 }}>
                                        <Alert severity="error">{fetchError}</Alert>
                                    </TableCell>
                                </TableRow>
                            ) : services.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">No service categories found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                services.map((category) => (
                                    <StyledTableRow key={category.id}>
                                        <TableCell sx={{ fontWeight: 600, color: '#172b4d' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CategoryIcon sx={{ color: '#f79f03', fontSize: 18 }} />
                                                {category.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b' }}>
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={`${getServiceCount(category)} services`}
                                                size="small"
                                                sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500 }}
                                            />
                                        </TableCell>
                                        <TableCell>{renderStatusChip(category.status || 'active')}</TableCell>
                                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, category)}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    p: 0,
                                                    borderRadius: 1,
                                                    '&:hover': { bgcolor: 'transparent' },
                                                    '& .MuiSvgIcon-root': { fontSize: 18 },
                                                }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    slotProps={{
                        select: {
                            variant: 'outlined',
                            size: 'small',
                            inputProps: { 'aria-label': 'Rows per page' },
                            MenuProps: {
                                disableScrollLock: true,
                                keepMounted: true,
                                slotProps: {
                                    paper: {
                                        sx: { mt: 0.5, maxHeight: 240, borderRadius: 1.5 },
                                    },
                                },
                            },
                            sx: { minWidth: 68, height: 32, borderRadius: 1 },
                        },
                        toolbar: { sx: { minHeight: 44, px: 1 } },
                    }}
                    sx={{ flexShrink: 0, borderTop: '1px solid #eef1f4', overflow: 'visible', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { my: 0 } }}
                />

                {/* Action Menu */}
                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => handleViewDetails(menuService)}>
                        <ListItemIcon>
                            <VisibilityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleEditService(menuService)}>
                        <ListItemIcon>
                            <EditIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>Edit Category</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteCategory(menuService)}>
                        <ListItemIcon>
                            <DeleteIcon color="error" />
                        </ListItemIcon>
                        <ListItemText>Delete Category</ListItemText>
                    </MenuItem>
                    {getCategoryServices(menuService).length > 0 && (
                        <MenuItem onClick={() => handleDeleteService(menuService)}>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            <ListItemText>Delete Service</ListItemText>
                        </MenuItem>
                    )}
                </Menu>

                {/* Details Dialog */}
                <Dialog
                    open={detailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                Category Details
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {detailsCategory?.name || '-'}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setDetailsDialogOpen(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 2.5 }}>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="caption" color="textSecondary">Category</Typography>
                                <Typography variant="body2" fontWeight={600}>{detailsCategory?.name || '-'}</Typography>
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="caption" color="textSecondary">Status</Typography>
                                <Box sx={{ mt: 0.25 }}>{renderStatusChip(detailsCategory?.status || 'active')}</Box>
                            </Box>
                            <Box sx={{ minWidth: 0, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                <Typography variant="caption" color="textSecondary">Description</Typography>
                                <Typography variant="body2" sx={{ color: '#475569' }}>{detailsCategory?.description || '-'}</Typography>
                            </Box>
                        </Box>

                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, color: '#172b4d' }}>
                            Services ({getCategoryServices(detailsCategory).length})
                        </Typography>
                        {getCategoryServices(detailsCategory).length > 0 ? (
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1 }}>
                                {getCategoryServices(detailsCategory).map((service, index) => (
                                    <Box
                                        key={getServiceId(service, index) || `${getServiceName(service)}-${index}`}
                                        sx={{ px: 1.25, py: 1, border: '1px solid #e2e8f0', borderRadius: 1, bgcolor: '#f8fafc' }}
                                    >
                                        <Typography variant="body2" fontWeight={600}>{getServiceName(service)}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="textSecondary">No services added in this category.</Typography>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
                        <Button onClick={() => setDetailsDialogOpen(false)} variant="outlined" sx={{ textTransform: 'none' }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0' }}>
                        <Typography variant="h6" fontWeight={600}>
                            {deleteType === 'service' ? 'Delete Service' : 'Delete Category'}
                        </Typography>
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        {deleteType === 'service' ? (
                            <Box>
                                <Typography variant="body2" sx={{ color: '#475569', mb: 1.5 }}>
                                    Select services to delete from <Box component="span" fontWeight={600}>{deleteItem?.name || '-'}</Box>.
                                </Typography>
                                {getCategoryServices(deleteItem).length > 0 ? (
                                    <FormGroup
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: 'repeat(3, minmax(0, 1fr))',
                                            },
                                            gap: 1,
                                        }}
                                    >
                                        {getCategoryServices(deleteItem).map((service, index) => {
                                            const serviceId = getServiceId(service, index);
                                            const disabled = !serviceId;

                                            return (
                                                <FormControlLabel
                                                    key={serviceId || `${getServiceName(service)}-${index}`}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedServiceIds.includes(serviceId)}
                                                            disabled={disabled}
                                                            onChange={(event) => handleServiceSelection(serviceId, event.target.checked)}
                                                            sx={{ color: '#f79f03', '&.Mui-checked': { color: '#f79f03' } }}
                                                        />
                                                    }
                                                    label={disabled ? `${getServiceName(service)} (missing service id)` : getServiceName(service)}
                                                    sx={{
                                                        m: 0,
                                                        minWidth: 0,
                                                        '& .MuiFormControlLabel-label': {
                                                            fontSize: 14,
                                                            color: disabled ? '#94a3b8' : '#1e293b',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                        },
                                                    }}
                                                />
                                            );
                                        })}
                                    </FormGroup>
                                ) : (
                                    <Alert severity="info">No services found in this category.</Alert>
                                )}
                            </Box>
                        ) : (
                            <DialogContentText>
                                Are you sure you want to delete this category?
                                {deleteItem && (
                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 500, color: '#1e293b' }}>
                                        {deleteItem.name}
                                        {getCategoryServices(deleteItem).length > 0 && (
                                            <Typography variant="caption" color="warning" sx={{ display: 'block', mt: 0.5 }}>
                                                Warning: This category contains {getCategoryServices(deleteItem).length} service(s).
                                            </Typography>
                                        )}
                                    </Typography>
                                )}
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', gap: 1 }}>
                        <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" sx={{ textTransform: 'none' }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant="contained"
                            disabled={deleteLoading || (deleteType === 'service' && selectedServiceIds.length === 0)}
                            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                            startIcon={deleteLoading ? <CircularProgress size={16} color="inherit" /> : null}
                        >
                            {deleteLoading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Box>
    );
};

export default ServicesList;
