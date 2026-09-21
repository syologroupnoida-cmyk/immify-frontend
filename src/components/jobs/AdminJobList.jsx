'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
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
    Delete as DeleteIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const ADMIN_JOB_LISTINGS_ENDPOINT = '/admin/job-listings';

const tabs = [
    { value: 'ALL', label: 'All', status: '', color: 'primary' },
    { value: 'DRAFT', label: 'Draft', status: 'DRAFT', color: 'default' },
    { value: 'PENDING_REVIEW', label: 'Pending', status: 'PENDING_REVIEW', color: 'warning' },
    { value: 'APPROVED', label: 'Approved', status: 'APPROVED', color: 'success' },
    { value: 'REJECTED', label: 'Rejected', status: 'REJECTED', color: 'error' },
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

    const preferredKeys = ['items', 'content', 'results', 'rows', 'list', 'jobs', 'jobListings', 'job_listings', 'data'];

    for (const key of preferredKeys) {
        const nestedValue = value[key];
        if (Array.isArray(nestedValue)) return nestedValue;
        const nestedArray = findFirstNestedArray(nestedValue);
        if (nestedArray.length > 0) return nestedArray;
    }

    return [];
}

function normalizeJobs(responseData) {
    const data = unwrapResponseData(responseData);
    const nestedData = unwrapResponseData(data);
    const directJobs = getFirstArray(
        Array.isArray(data) ? data : [],
        data?.content,
        data?.items,
        data?.results,
        data?.rows,
        data?.list,
        data?.jobs,
        data?.jobListings,
        data?.job_listings,
        Array.isArray(nestedData) ? nestedData : [],
        nestedData?.content,
        nestedData?.items,
        nestedData?.results,
        nestedData?.rows,
        nestedData?.list,
        nestedData?.jobs,
        nestedData?.jobListings,
        nestedData?.job_listings
    );

    return directJobs.length > 0 ? directJobs : findFirstNestedArray(responseData);
}

function getResponseTotal(responseData, fallbackCount) {
    const data = unwrapResponseData(responseData);
    const nestedData = unwrapResponseData(data);
    const total = (
        data?.total
        ?? data?.totalElements
        ?? data?.totalCount
        ?? data?.count
        ?? data?.meta?.total
        ?? data?.meta?.totalCount
        ?? data?.pagination?.total
        ?? data?.pagination?.totalCount
        ?? nestedData?.total
        ?? nestedData?.totalElements
        ?? nestedData?.totalCount
        ?? nestedData?.count
        ?? nestedData?.meta?.total
        ?? nestedData?.meta?.totalCount
        ?? nestedData?.pagination?.total
        ?? nestedData?.pagination?.totalCount
    );
    const numericTotal = Number(total);

    return Number.isFinite(numericTotal) ? numericTotal : fallbackCount;
}

function unwrapJob(payload) {
    const data = payload?.data ?? payload ?? {};
    return data?.data ?? data?.job ?? data?.item ?? data;
}

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function getJobId(job) {
    return String(job?.jobListingId || job?.listingId || job?.id || job?._id || job?.uuid || '');
}

function getNestedName(value) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.companyName || value.businessName || value.name || value.title || value.fullName || '';
}

function getVendorLabel(job) {
    const vendorUser = job?.vendor?.user || {};
    const vendorUserName = [vendorUser.firstName, vendorUser.lastName].filter(Boolean).join(' ').trim();

    return (
        vendorUserName
        || vendorUser.email
        || getNestedName(job?.vendor)
        || getNestedName(job?.partner)
        || job?.companyName
        || job?.vendorName
        || job?.partnerName
        || '-'
    );
}

function getJobStatus(job) {
    return job?.reviewStatus || job?.review_status || job?.status || (job?.isPublished ? 'APPROVED' : 'DRAFT');
}

function formatStatus(status) {
    const value = String(status || 'UNKNOWN').replaceAll('_', ' ').toLowerCase();
    return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
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

function formatValue(value) {
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value === 0) return '0';
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
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

function JobDetailsModal({ open, job, actionLoading, canReview, onClose, onApprove, onReject }) {
    const jobId = getJobId(job);
    const dynamicData = job?.dynamicData || job?.dynamic_data || {};
    const detailSections = job ? [
        {
            title: 'Job Information',
            items: [
                { label: 'Title', value: job.title },
                { label: 'Vendor', value: getVendorLabel(job) },
                { label: 'Country', value: job.country },
                { label: 'City / Region', value: job.cityRegion },
                { label: 'Industry', value: job.industry || dynamicData.industry },
                { label: 'Qualification', value: job.qualification },
            ],
        },
        {
            title: 'Application Details',
            items: [
                { label: 'Employment Type', value: job.employmentType },
                { label: 'Experience', value: job.experience },
                { label: 'Indicative Salary', value: job.indicativeSalary },
                { label: 'Vacancy Count', value: job.vacancyCount },
                { label: 'Application Email', value: job.applicationEmail },
                { label: 'Application URL', value: job.applicationUrl },
                { label: 'Application Deadline', value: formatDate(job.applicationDeadline) },
                { label: 'Expires At', value: formatDate(job.expiresAt) },
            ],
        },
        {
            title: 'Review Status',
            items: [
                { label: 'Review Status', value: getJobStatus(job) },
                { label: 'Published', value: job.isPublished },
                { label: 'Visible', value: job.isVisible },
                { label: 'Submitted At', value: formatDate(job.submittedAt) },
                { label: 'Reviewed At', value: formatDate(job.reviewedAt) },
                { label: 'Reviewed By Admin ID', value: job.reviewedByAdminId },
                { label: 'Rejection Reason', value: job.rejectionReason },
                { label: 'Updated', value: formatDate(job.updatedAt) },
            ],
        },
    ] : [];

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
                            {job?.title || 'Job Listing Details'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.25, color: '#64748b' }}>
                            {jobId ? `ID: ${jobId}` : 'Job listing details'}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#172b4d', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 0, pt: 0, pb: 0, bgcolor: '#fff', maxHeight: '64vh', overflowY: 'auto' }}>
                {!job ? (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="info">No job selected.</Alert>
                    </Box>
                ) : (
                    <Box sx={{ px: 3, py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                            <StatusChip label={formatStatus(getJobStatus(job))} status={getJobStatus(job)} size="small" />
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Created: {formatDate(job.createdAt)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gap: 2 }}>
                            {detailSections.map((section) => (
                                <DetailSection key={section.title} title={section.title} items={section.items} />
                            ))}
                        </Box>

                        <Box sx={{ mt: 1, borderBottom: '1px solid #e5e7eb', pb: 1.5 }}>
                            <Typography sx={{ color: '#1f2a77', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                Description
                            </Typography>
                            <Typography sx={{ mt: 1.5, color: '#334155', fontSize: 14, lineHeight: 1.7 }}>
                                {job.description || '-'}
                            </Typography>
                        </Box>

                        {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                <Typography sx={{ color: '#1f2a77', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                    Responsibilities
                                </Typography>
                                <Stack direction="row" columnGap={1.5} rowGap={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                                    {job.responsibilities.map((item) => (
                                        <Chip key={String(item)} label={String(item)} size="small" sx={{ bgcolor: '#f1f5f9', color: '#334155' }} />
                                    ))}
                                </Stack>
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
                            disabled={!jobId || actionLoading}
                            sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
                        >
                            Approve Job
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CancelIcon />}
                            onClick={onReject}
                            disabled={!jobId || actionLoading}
                            sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                        >
                            Reject Job
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export function JobListingsTable({
    endpoint = ADMIN_JOB_LISTINGS_ENDPOINT,
    title = 'Job Listings',
    editPath = '/admin/edit-job',
    canReview = true,
    showVendor = true,
}) {
    const router = useRouter();
    const tableScrollRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuJob, setMenuJob] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const tabStatus = tabs.find((tab) => tab.value === activeTab)?.status;
    const trimmedSearch = searchTerm.trim();
    const searchQuery = trimmedSearch.length >= 2 ? trimmedSearch : '';

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setFetchError('');

        try {
            const params = {
                take: rowsPerPage,
                skip: page * rowsPerPage,
            };

            if (tabStatus) params.status = tabStatus;
            if (searchQuery) params.search = searchQuery;

            const response = await MainApi.get(endpoint, { params });
            const normalizedJobs = normalizeJobs(response?.data);

            const fallbackTotal = normalizedJobs.length === rowsPerPage
                ? page * rowsPerPage + normalizedJobs.length + 1
                : page * rowsPerPage + normalizedJobs.length;

            setJobs(normalizedJobs);
            setTotalCount(getResponseTotal(response?.data, fallbackTotal));
        } catch (error) {
            setJobs([]);
            setTotalCount(0);
            setFetchError(getApiErrorMessage(error, 'Unable to load job listings.'));
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, rowsPerPage, searchQuery, tabStatus]);

    useEffect(() => {
        queueMicrotask(fetchJobs);
    }, [fetchJobs]);

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

    const handleMenuOpen = (event, job) => {
        setMenuAnchor(event.currentTarget);
        setMenuJob(job);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuJob(null);
    };

    const loadJobDetails = async (job) => {
        const jobId = getJobId(job);
        setSelectedJob(job);

        try {
            const response = await MainApi.get(`${endpoint}/${jobId}`);
            setSelectedJob(unwrapJob(response?.data));
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Unable to Load Job',
                text: getApiErrorMessage(error, 'Unable to load job listing details.'),
                confirmButtonColor: '#f79f03',
            });
        }
    };

    const handleViewDetails = async (job) => {
        handleMenuClose();
        setDetailsOpen(true);
        await loadJobDetails(job);
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

    const handleJobAction = async (action, job = selectedJob || menuJob) => {
        const jobId = getJobId(job);
        if (!jobId) return;

        handleMenuClose();

        if (action === 'edit') {
            router.push(`${editPath}?jobListingId=${jobId}`);
            return;
        }

        const actionText = action.charAt(0).toUpperCase() + action.slice(1);
        const result = await Swal.fire({
            icon: action === 'delete' ? 'warning' : 'question',
            title: `${actionText} job listing?`,
            text: job?.title || 'This job listing will be updated.',
            showCancelButton: true,
            confirmButtonText: actionText,
            confirmButtonColor: action === 'approve' ? '#16a34a' : '#dc2626',
        });

        if (!result.isConfirmed) return;

        const actionEndpoint = action === 'delete'
            ? `${endpoint}/${jobId}`
            : `${endpoint}/${jobId}/${action}`;

        setActionLoading(true);
        try {
            const response = action === 'delete'
                ? await MainApi.delete(actionEndpoint)
                : await MainApi.post(actionEndpoint, {});
            const pastAction = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'deleted';

            await Swal.fire({
                icon: 'success',
                title: action === 'approve' ? 'Job Approved' : action === 'reject' ? 'Job Rejected' : 'Job Deleted',
                text: getApiMessage(response?.data, `Job listing ${pastAction} successfully.`),
                confirmButtonColor: '#f79f03',
            });

            setDetailsOpen(false);
            setSelectedJob(null);
            fetchJobs();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: getApiErrorMessage(error, `Failed to ${action} job listing.`),
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const columns = [
        { id: 'title', label: 'Title', width: showVendor ? '24%' : '28%' },
        ...(showVendor ? [{ id: 'vendor', label: 'Vendor', width: '14%' }] : []),
        { id: 'location', label: 'Location', width: '16%' },
        { id: 'type', label: 'Type', width: '12%' },
        { id: 'experience', label: 'Experience', width: '12%' },
        { id: 'status', label: 'Status', width: '10%' },
        { id: 'createdAt', label: 'Created On', width: '12%' },
    ];

    const visibleJobs = useMemo(() => {
        const query = searchQuery.toLowerCase();

        return jobs.filter((job) => {
            const jobStatus = String(getJobStatus(job) || '').toUpperCase();
            const matchesTab = !tabStatus || jobStatus === tabStatus || (tabStatus === 'PENDING_REVIEW' && jobStatus === 'PENDING');
            const matchesSearch = !query || [
                job.title,
                getVendorLabel(job),
                job.country,
                job.cityRegion,
                job.industry,
                job.employmentType,
                job.description,
            ].filter(Boolean).some((value) => String(value).toLowerCase().includes(query));

            return matchesTab && matchesSearch;
        });
    }, [jobs, searchQuery, tabStatus]);

    const paginationCount = totalCount || visibleJobs.length;
    const maxPage = Math.max(0, Math.ceil(paginationCount / rowsPerPage) - 1);
    const activePage = Math.min(page, maxPage);
    const pagedJobs = visibleJobs;

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
                        placeholder="Search jobs by title or vendor"
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
                    aria-label="Scrollable job listings table"
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
                                        <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>Loading job listings...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : fetchError ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ color: 'error.main', py: 4 }}>
                                        <Alert severity="error">{fetchError}</Alert>
                                    </TableCell>
                                </TableRow>
                            ) : visibleJobs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">No job listings found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pagedJobs.map((job) => (
                                    <StyledTableRow key={getJobId(job)} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#172b4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.title || '-'}
                                        </TableCell>
                                        {showVendor && (
                                            <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {getVendorLabel(job)}
                                            </TableCell>
                                        )}
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {[job.cityRegion, job.country].filter(Boolean).join(', ') || '-'}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.employmentType || '-'}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {job.experience || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <StatusChip label={formatStatus(getJobStatus(job))} status={getJobStatus(job)} size="small" />
                                        </TableCell>
                                        <TableCell>{formatDate(job.createdAt || job.submittedAt)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(event) => handleMenuOpen(event, job)}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    border: '1px solid #cbd5e1',
                                                    color: '#475569',
                                                    '& .MuiSvgIcon-root': { fontSize: 16 },
                                                    '&:hover': {
                                                        borderColor: '#2563eb',
                                                        color: '#2563eb',
                                                        bgcolor: '#eff6ff',
                                                    },
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

                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    component="div"
                    count={paginationCount}
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
                    MenuListProps={{ dense: true, sx: { py: 0.5 } }}
                    PaperProps={{ sx: { minWidth: 132 } }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => handleViewDetails(menuJob)} sx={{ minHeight: 32, px: 1.25, gap: 0 }}>
                        <ListItemIcon sx={{ minWidth: 0, mr: 0 }}>
                            <VisibilityIcon color="primary" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="View Details" primaryTypographyProps={{ fontSize: 12 }} sx={{ m: 0 }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleJobAction('edit', menuJob)} sx={{ minHeight: 32, px: 1.25, gap: 0 }}>
                        <ListItemIcon sx={{ minWidth: 0, mr: 0 }}>
                            <EditIcon color="primary" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Edit" primaryTypographyProps={{ fontSize: 12 }} sx={{ m: 0 }} />
                    </MenuItem>
                    <MenuItem onClick={() => handleJobAction('delete', menuJob)} sx={{ minHeight: 32, px: 1.25, gap: 0 }}>
                        <ListItemIcon sx={{ minWidth: 0, mr: 0 }}>
                            <DeleteIcon color="error" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText primary="Delete" primaryTypographyProps={{ fontSize: 12 }} sx={{ m: 0 }} />
                    </MenuItem>
                </Menu>

                <JobDetailsModal
                    open={detailsOpen}
                    job={selectedJob}
                    actionLoading={actionLoading}
                    canReview={canReview}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedJob(null);
                    }}
                    onApprove={() => handleJobAction('approve', selectedJob)}
                    onReject={() => handleJobAction('reject', selectedJob)}
                />
            </Paper>
        </Box>
    );
}

export default function AdminJobList() {
    return <JobListingsTable />;
}
