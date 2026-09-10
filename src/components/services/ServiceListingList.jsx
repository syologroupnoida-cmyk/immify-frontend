'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {
    Cancel as CancelIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const ADMIN_SERVICE_LISTINGS_ENDPOINT = '/admin/service-listings';
const SERVICE_LISTINGS_ENDPOINT = ADMIN_SERVICE_LISTINGS_ENDPOINT;
export const VENDOR_SERVICE_LISTINGS_ENDPOINT = '/vendor/service-listings';

const tabs = [
    { value: 'ALL', label: 'All', status: '', color: 'primary' },
    { value: 'DRAFT', label: 'Draft', status: 'DRAFT', color: 'default' },
    { value: 'PENDING_REVIEW', label: 'Pending', status: 'PENDING_REVIEW', color: 'warning' },
    { value: 'APPROVED', label: 'Approved', status: 'APPROVED', color: 'success' },
];

const StyledTableRow = styled(TableRow)(() => ({
    '&:hover': {
        backgroundColor: '#f8fafc',
    },
    '&:last-child td, &:last-child th': {
        borderBottom: 'none',
    },
}));

const StatusChip = styled(Chip)(({ status }) => {
    const colors = {
        pending_review: { bg: '#fef3c7', color: '#92400e' },
        pending: { bg: '#fef3c7', color: '#92400e' },
        draft: { bg: '#f1f5f9', color: '#475569' },
        approved: { bg: '#dcfce7', color: '#166534' },
        rejected: { bg: '#fee2e2', color: '#991b1b' },
        active: { bg: '#dbeafe', color: '#1e40af' },
        published: { bg: '#dbeafe', color: '#1e40af' },
        default: { bg: '#f1f5f9', color: '#475569' },
    };
    const key = String(status || '').toLowerCase();
    const statusColor = colors[key] || colors.default;

    return {
        backgroundColor: statusColor.bg,
        color: statusColor.color,
        fontWeight: 600,
        fontSize: '12px',
        height: '24px',
        '& .MuiChip-label': {
            padding: '0 10px',
        },
    };
});

function unwrapResponseData(responseData) {
    return responseData?.data ?? responseData ?? {};
}

function getFirstArray(...values) {
    return values.find((value) => Array.isArray(value)) || [];
}

function findFirstNestedArray(value) {
    if (!value || typeof value !== 'object') return [];
    if (Array.isArray(value)) return value;

    const preferredKeys = [
        'items',
        'content',
        'results',
        'rows',
        'list',
        'listings',
        'serviceListings',
        'service_listings',
        'data',
    ];

    for (const key of preferredKeys) {
        const nestedValue = value[key];
        if (Array.isArray(nestedValue)) return nestedValue;
        const nestedArray = findFirstNestedArray(nestedValue);
        if (nestedArray.length > 0) return nestedArray;
    }

    return [];
}

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function getListingId(listing) {
    return String(listing?.serviceListingId || listing?.listingId || listing?.id || listing?._id || listing?.uuid || '');
}

function getNestedName(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.name || value.title || value.serviceName || value.categoryName || value.companyName || value.fullName || '';
}

function getCategoryLabel(listing) {
    return (
        getNestedName(listing?.category)
        || getNestedName(listing?.serviceCategory)
        || listing?.categoryName
        || listing?.serviceCategoryName
        || listing?.categoryId
        || '-'
    );
}

function getServiceLabel(listing) {
    return (
        getNestedName(listing?.service)
        || listing?.serviceName
        || listing?.serviceTitle
        || listing?.serviceId
        || '-'
    );
}

function getVendorLabel(listing) {
    const vendorUser = listing?.vendor?.user || {};
    const vendorUserName = [vendorUser.firstName, vendorUser.lastName].filter(Boolean).join(' ').trim();

    return (
        vendorUserName
        || vendorUser.email
        || vendorUser.id
        || getNestedName(listing?.vendor)
        || getNestedName(listing?.partner)
        || listing?.vendorName
        || listing?.partnerName
        || listing?.createdByName
        || '-'
    );
}

function getPlainUrl(value) {
    const text = String(value || '').trim();
    const markdownMatch = text.match(/\((https?:\/\/[^)]+)\)/i);
    return markdownMatch?.[1] || text;
}

function getImageUrl(listing) {
    return getPlainUrl(listing?.imageUrl || listing?.image_url || listing?.image?.url || listing?.media?.url || '');
}

function getListingStatus(listing) {
    return listing?.reviewStatus || listing?.review_status || listing?.status || (listing?.isPublished ? 'PUBLISHED' : 'DRAFT');
}

function normalizeListings(responseData) {
    const data = unwrapResponseData(responseData);
    const nestedData = unwrapResponseData(data);
    const directListings = getFirstArray(
        Array.isArray(data) ? data : [],
        data?.content,
        data?.items,
        data?.results,
        data?.rows,
        data?.list,
        data?.listings,
        data?.serviceListings,
        data?.service_listings,
        Array.isArray(nestedData) ? nestedData : [],
        nestedData?.content,
        nestedData?.items,
        nestedData?.results,
        nestedData?.rows,
        nestedData?.list,
        nestedData?.listings,
        nestedData?.serviceListings,
        nestedData?.service_listings
    );
    const listings = directListings.length > 0 ? directListings : findFirstNestedArray(responseData);
    const total = (
        data?.total
        ?? data?.totalElements
        ?? data?.totalCount
        ?? data?.count
        ?? nestedData?.total
        ?? nestedData?.totalElements
        ?? nestedData?.totalCount
        ?? nestedData?.count
        ?? listings.length
    );

    return {
        listings,
        total: Number(total) || listings.length,
    };
}

function formatStatus(status) {
    const value = String(status || 'UNKNOWN').replaceAll('_', ' ').toLowerCase();
    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value) {
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value === 0) return '0';
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatPrice(listing) {
    const amount = listing?.priceInPaise ?? listing?.price ?? listing?.amount;
    const currency = listing?.currency || 'INR';

    if (amount === null || amount === undefined || amount === '') return '-';

    const numericAmount = Number(amount);
    if (Number.isNaN(numericAmount)) return String(amount);

    const displayAmount = listing?.priceInPaise !== undefined ? numericAmount / 100 : numericAmount;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(displayAmount);
}

function DetailItem({ label, value }) {
    return (
        <Box sx={{ minWidth: 0, minHeight: 58, pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
            <Typography sx={{ color: '#667085', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>
                {label}
            </Typography>
            <Typography sx={{ mt: 0.55, color: '#12213d', fontSize: 15, fontWeight: 600, lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formatValue(value)}
            </Typography>
        </Box>
    );
}

function DetailSection({ title, items }) {
    const rows = [];

    for (let index = 0; index < items.length; index += 2) {
        rows.push(items.slice(index, index + 2));
    }

    return (
        <Box sx={{ pb: 1 }}>
            <Typography sx={{ color: '#1f2a77', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'grid', gap: 1.5, mt: 1.5 }}>
                {rows.map((row) => (
                    <Box
                        key={`${title}-${row.map((item) => item.label).join('-')}`}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                            columnGap: 5,
                            rowGap: 1.5,
                            alignItems: 'start',
                            width: '100%',
                        }}
                    >
                        <DetailItem label={row[0].label} value={row[0].value} />
                        {row[1] ? <DetailItem label={row[1].label} value={row[1].value} /> : <Box sx={{ display: { xs: 'none', sm: 'block' } }} />}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function ServiceListingDetailsModal({ open, listing, actionLoading, canReview, onClose, onApprove, onReject }) {
    const [reason, setReason] = useState('');
    const listingId = getListingId(listing);
    const imageUrl = getImageUrl(listing);
    const listingStatus = getListingStatus(listing);
    const dynamicData = listing?.dynamicData || listing?.dynamic_data || {};
    const detailSections = listing ? [
        {
            title: 'Listing Information',
            items: [
                { label: 'Title', value: listing.title },
                { label: 'Vendor User ID', value: listing.vendorUserId || listing.vendor_user_id },
                { label: 'Category', value: getCategoryLabel(listing) },
                { label: 'Service', value: getServiceLabel(listing) },
                { label: 'Country', value: dynamicData.country },
                { label: 'Price', value: formatPrice(listing) },
            ],
        },
        {
            title: 'Review Status',
            items: [
                { label: 'Review Status', value: listingStatus },
                { label: 'Published', value: listing.isPublished },
                { label: 'Visible', value: listing.isVisible },
                { label: 'Submitted At', value: formatDate(listing.submittedAt) },
                { label: 'Reviewed At', value: formatDate(listing.reviewedAt) },
                { label: 'Reviewed By Admin ID', value: listing.reviewedByAdminId },
                { label: 'Rejection Reason', value: listing.rejectionReason },
                { label: 'Updated', value: formatDate(listing.updatedAt) },
            ],
        },
        {
            title: 'Service Details',
            items: [
                { label: 'Description', value: listing.description },
                { label: 'Overview', value: listing.overview },
                { label: 'Process', value: listing.process },
                { label: 'Pricing Details', value: listing.pricingDetails },
                { label: 'Terms And Conditions', value: listing.termsAndConditions },
                { label: 'Charges Include GST', value: listing.chargesIncludeGst },
                { label: 'Created', value: formatDate(listing.createdAt) },
                { label: 'Currency', value: listing.currency },
            ],
        },
    ] : [];

    useEffect(() => {
        if (open) queueMicrotask(() => setReason(''));
    }, [open, listingId]);

    const handleReject = () => {
        onReject(reason);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            disableScrollLock
            PaperProps={{ sx: { maxWidth: 1120, borderRadius: 1, overflow: 'hidden' } }}
        >
            <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', p: 0 }}>
                <Box sx={{ bgcolor: '#fff', color: '#172b4d', px: 2, py: 1.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" fontWeight={800} sx={{ overflowWrap: 'anywhere' }}>
                            {listing?.title || 'Service Listing Details'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.25, color: '#64748b' }}>
                            {listingId ? `ID: ${listingId}` : 'Listing details'}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#172b4d', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 0, pt: 0, pb: 0, bgcolor: '#fff', maxHeight: '64vh', overflowY: 'auto' }}>
                {!listing ? (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="info">No listing selected.</Alert>
                    </Box>
                ) : (
                    <Box sx={{ px: 3, py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                            <StatusChip label={formatStatus(listingStatus)} status={listingStatus} size="small" />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Created: {formatDate(listing.createdAt)}
                            </Typography>
                        </Box>

                        {imageUrl && (
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={listing.title || 'Service listing'}
                                sx={{
                                    width: { xs: '100%', sm: 260 },
                                    height: 150,
                                    minHeight: 150,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: '1px solid #e2e8f0',
                                    mb: 2,
                                    display: 'block',
                                }}
                            />
                        )}

                        <Box sx={{ display: 'grid', gap: 2 }}>
                            {detailSections.map((section) => (
                                <DetailSection key={section.title} title={section.title} items={section.items} />
                            ))}
                        </Box>

                        {Array.isArray(listing.includes) && listing.includes.length > 0 && (
                            <Box sx={{ mt: 1, borderBottom: '1px solid #e5e7eb', pb: 1.5 }}>
                                <Typography sx={{ color: '#1f2a77', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                    Includes
                                </Typography>
                                <Stack direction="row" columnGap={1.5} rowGap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                                    {listing.includes.map((item) => (
                                        <Chip key={String(item)} label={String(item)} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155' }} />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {canReview && (
                            <Box sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    size="small"
                                    label="Reject Reason"
                                    placeholder="Enter reason before rejecting the listing"
                                    value={reason}
                                    onChange={(event) => setReason(event.target.value)}
                                    disabled={actionLoading}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', gap: 1, flexWrap: 'wrap' }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }} disabled={actionLoading}>
                    Close
                </Button>
                {canReview && (
                    <>
                        <Button
                            variant="contained"
                            startIcon={actionLoading ? <CircularProgress color="inherit" size={16} /> : <CheckCircleIcon />}
                            onClick={onApprove}
                            disabled={!listingId || actionLoading}
                            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
                        >
                            Approve Listing
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CancelIcon />}
                            onClick={handleReject}
                            disabled={!listingId || actionLoading}
                            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                        >
                            Reject Listing
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default function ServiceListingList({
    endpoint = SERVICE_LISTINGS_ENDPOINT,
    title = 'Service Listings',
    canReview = true,
}) {
    const tableScrollRef = useRef(null);
    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuListing, setMenuListing] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        setFetchError('');

        try {
            const response = await MainApi.get(endpoint);
            const normalized = normalizeListings(response?.data);

            setListings(normalized.listings);
        } catch (error) {
            setListings([]);
            setFetchError(getApiErrorMessage(error, 'Unable to load service listings.'));
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        queueMicrotask(fetchListings);
    }, [fetchListings]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event, listing) => {
        setMenuAnchor(event.currentTarget);
        setMenuListing(listing);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuListing(null);
    };

    const handleViewDetails = (listing) => {
        handleMenuClose();
        setSelectedListing(listing);
        setDetailsOpen(true);
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

    const handleListingAction = async (action, reason = '') => {
        const listingId = getListingId(selectedListing);
        if (!listingId) return;

        if (action === 'reject' && !reason.trim()) {
            await Swal.fire({
                icon: 'error',
                title: 'Reason Required',
                text: 'Please enter a reason before rejecting this listing.',
                confirmButtonColor: '#f79f03',
            });
            return;
        }

        const endpoint = `${ADMIN_SERVICE_LISTINGS_ENDPOINT}/${listingId}/${action}`;
        const payload = action === 'reject' ? { reason: reason.trim() } : {};

        setActionLoading(true);
        try {
            const response = await MainApi.post(endpoint, payload);
            await Swal.fire({
                icon: 'success',
                title: action === 'approve' ? 'Listing Approved' : 'Listing Rejected',
                text: getApiMessage(response?.data, action === 'approve' ? 'Service listing approved successfully.' : 'Service listing rejected successfully.'),
                confirmButtonColor: '#f79f03',
            });

            setDetailsOpen(false);
            setSelectedListing(null);
            fetchListings();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: getApiErrorMessage(error, `Failed to ${action} service listing.`),
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        { id: 'title', label: 'Title', width: '22%' },
        { id: 'category', label: 'Category', width: '18%' },
        { id: 'service', label: 'Service', width: '18%' },
        { id: 'vendor', label: 'Vendor', width: '14%' },
        { id: 'price', label: 'Price', width: '10%' },
        { id: 'status', label: 'Status', width: '10%' },
        { id: 'createdAt', label: 'Created On', width: '12%' },
    ];
    const visibleListings = listings.filter((listing) => {
        const tabStatus = tabs.find((tab) => tab.value === activeTab)?.status;
        const listingStatus = String(getListingStatus(listing) || '').toUpperCase();
        const matchesTab = !tabStatus || listingStatus === tabStatus;
        const query = searchTerm.trim().toLowerCase();
        const matchesSearch = query.length < 2 || [
            listing.title,
            getVendorLabel(listing),
            getCategoryLabel(listing),
            getServiceLabel(listing),
            listing.description,
            listing.dynamicData?.country,
        ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));

        return matchesTab && matchesSearch;
    });
    const maxPage = Math.max(0, Math.ceil(visibleListings.length / rowsPerPage) - 1);
    const activePage = Math.min(page, maxPage);
    const pagedListings = visibleListings.slice(activePage * rowsPerPage, activePage * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: '100%', height: 'calc(100dvh - 104px)', minHeight: 0, m: 0, overflow: 'hidden' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    p: 0,
                    borderRadius: 2,
                    border: '1px solid #e6eaf0',
                    boxShadow: '0 2px 8px rgba(31, 45, 61, 0.06)',
                }}
            >
                <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 18 }, fontWeight: 600, px: 1.5, py: 1.25, borderBottom: '1px solid #e2e7ed' }}>
                    {title}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, px: 1.5, py: 1 }}>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        {tabs.map((tab) => (
                            <Chip
                                key={tab.value}
                                label={tab.label}
                                color={tab.color}
                                variant={activeTab === tab.value ? 'filled' : 'outlined'}
                                onClick={() => handleTabChange(tab.value)}
                                sx={{
                                    minWidth: 68,
                                    height: 28,
                                    borderRadius: '14px',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    '& .MuiChip-label': { px: 1.5 },
                                }}
                            />
                        ))}
                    </Stack>

                    <TextField
                        placeholder="Search listings by title or vendor"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ width: { xs: '100%', sm: 330 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 2 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <TableContainer
                    ref={tableScrollRef}
                    tabIndex={0}
                    role="region"
                    aria-label="Scrollable service listings table"
                    onKeyDown={handleTableKeyDown}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        border: '1px solid #e6eaf0',
                        borderLeft: 0,
                        borderRight: 0,
                        borderRadius: 0,
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
                            width: '100%',
                            tableLayout: 'fixed',
                            '& .MuiTableCell-root': { px: 1.25, py: 1, fontSize: 13, minWidth: 0 },
                            '& .MuiTableHead-root .MuiTableCell-root': { py: 1.15 },
                            '& .MuiTableBody-root .MuiTableRow-root': { height: 48 },
                        }}
                    >
                        <TableHead sx={{ bgcolor: '#f5f8fb' }}>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell key={col.id} sx={{ width: col.width, color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec', whiteSpace: 'nowrap' }}>
                                        {col.label}
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ width: 90, color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={30} />
                                        <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>Loading service listings...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : fetchError ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ color: 'error.main', py: 4 }}>
                                        <Alert severity="error">{fetchError}</Alert>
                                    </TableCell>
                                </TableRow>
                            ) : visibleListings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">No service listings found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedListings.map((listing) => (
                                    <StyledTableRow key={getListingId(listing)} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#172b4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {listing.title || '-'}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getCategoryLabel(listing)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getServiceLabel(listing)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getVendorLabel(listing)}
                                        </TableCell>
                                        <TableCell>{formatPrice(listing)}</TableCell>
                                        <TableCell>
                                            <StatusChip label={formatStatus(getListingStatus(listing))} status={getListingStatus(listing)} size="small" />
                                        </TableCell>
                                        <TableCell>{formatDate(listing.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(event) => handleMenuOpen(event, listing)}
                                                sx={{ width: 28, height: 28 }}
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

                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={visibleListings.length}
                    rowsPerPage={rowsPerPage}
                    page={activePage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    slotProps={{
                        select: {
                            variant: 'outlined',
                            size: 'small',
                            inputProps: { 'aria-label': 'Rows per page' },
                            sx: { minWidth: 68, height: 32, borderRadius: 1 },
                        },
                        toolbar: { sx: { minHeight: 44, px: 1 } },
                    }}
                    sx={{ flexShrink: 0, borderTop: '1px solid #eef1f4', overflow: 'visible', '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { my: 0 } }}
                />

                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    disableScrollLock
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => handleViewDetails(menuListing)}>
                        <ListItemIcon>
                            <VisibilityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                    </MenuItem>
                </Menu>

                <ServiceListingDetailsModal
                    open={detailsOpen}
                    listing={selectedListing}
                    actionLoading={actionLoading}
                    canReview={canReview}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedListing(null);
                    }}
                    onApprove={() => handleListingAction('approve')}
                    onReject={(reason) => handleListingAction('reject', reason)}
                />
            </Paper>
        </Box>
    );
}
