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
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Stack,
    Typography,
    Box,
    InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BlockIcon from '@mui/icons-material/Block';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

// Constants
const VENDORS_ENDPOINT = '/admin/vendors';
const APPROVE_VENDOR_ENDPOINT = '/admin/vendor-kyc';
const REJECT_VENDOR_ENDPOINT = '/admin/vendor-kyc';
const ACTIVATE_VENDOR_ENDPOINT = '/admin/vendors';
const DEACTIVATE_VENDOR_ENDPOINT = '/super-admin/vendors';
const CREDITS_ADJUST_ENDPOINT = '/super-admin/vendors';

const SWEET_ALERT_OPTIONS = {
    customClass: { container: 'agent-swal-container' },
};

const vendorActions = {
    approve: {
        label: 'Approve',
        pastLabel: 'approved',
        color: 'success',
        endpoint: (id) => `${APPROVE_VENDOR_ENDPOINT}/${id}/approve`,
    },
    reject: {
        label: 'Reject',
        pastLabel: 'rejected',
        color: 'error',
        endpoint: (id) => `${REJECT_VENDOR_ENDPOINT}/${id}/reject`,
    },
    activate: {
        label: 'Activate',
        pastLabel: 'activated',
        color: 'success',
        endpoint: (id) => `${ACTIVATE_VENDOR_ENDPOINT}/${id}/activate`,
    },
    deactivate: {
        label: 'Deactivate',
        pastLabel: 'deactivated',
        color: 'error',
        endpoint: (id) => `${DEACTIVATE_VENDOR_ENDPOINT}/${id}/deactivate`,
    },
    recharge: {
        label: 'Recharge',
        pastLabel: 'recharged',
        color: 'primary',
        endpoint: (id) => `${CREDITS_ADJUST_ENDPOINT}/${id}/credits/adjust`,
    },
};

function normalizeStatus(vendor) {
    const status = String(vendor.status || vendor.accountStatus || '').toLowerCase();
    if (status) return ['active', 'activated', 'enabled'].includes(status) ? 'active' : 'inactive';
    return vendor.active === true || vendor.isActive === true || vendor.enabled === true ? 'active' : 'inactive';
}

function formatDate(value) {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN');
}

function formatRoleName(value) {
    if (!value) return '-';
    const rawValue = String(value).trim();
    if (!rawValue) return '-';
    return rawValue
        .replace(/[_-]+/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function normalizeVendor(vendor) {
    const firstName = vendor.firstName || vendor.first_name || '';
    const lastName = vendor.lastName || vendor.last_name || '';
    const roleName = vendor.roleName || vendor.role_name || vendor.role?.name || vendor.userRole || vendor.role?.roleName || vendor.roleType || '-';

    return {
        id: vendor.userId ?? vendor.vendorId ?? vendor.id,
        vendorUserId: vendor.userId ?? vendor.vendorId ?? vendor.id,
        name: `${firstName} ${lastName}`.trim() || vendor.name || vendor.username || '-',
        roleName: formatRoleName(roleName),
        vendorType: formatRoleName(vendor.vendorType || vendor.vendor_type || vendor.vendorProfile?.vendorType),
        email: vendor.email || vendor.emailAddress || '-',
        phone: vendor.phone || vendor.phoneNumber || '-',
        location: [vendor.city, vendor.country].filter(Boolean).join(', ') || '-',
        kycStatus: String(vendor.kycStatus || 'NOT_SUBMITTED').replaceAll('_', ' '),
        status: normalizeStatus(vendor),
        created: formatDate(vendor.createdAt || vendor.createdDate || vendor.created_at),
    };
}

function getNestedVendorDetail(rawData) {
    const data = rawData?.data || rawData || {};
    const user = data.user || data.vendor || data.profile || data;
    const kyc = data.kyc || user.kyc || {};
    const documents = Array.isArray(data.documents) ? data.documents : [];
    const approval = data.approval || {};
    const firstName = user.firstName || user.first_name || '';
    const lastName = user.lastName || user.last_name || '';

    return {
        user,
        kyc,
        documents,
        approval,
        id: user.id || user.userId || user.vendorId || data.id || data.vendorUserId,
        name: `${firstName} ${lastName}`.trim() || user.name || user.vendorName || '-',
        email: user.email || user.emailAddress || '-',
        phone: user.phone || user.phoneNumber || '-',
        role: formatRoleName(user.role || user.roleName || user.userRole),
        vendorType: formatRoleName(data.vendorType || user.vendorType || kyc.vendorType),
        isActive: user.isActive,
        kycStatus: data.kycStatus || kyc.status || user.kycStatus || 'NOT_SUBMITTED',
        approvalStatus: approval.status || '-',
        canLogin: approval.canLogin,
        approvalMessage: approval.message || '-',
    };
}

function formatBoolean(value) {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '-';
}

function DetailItem({ label, value }) {
    return (
        <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="textSecondary">{label}</Typography>
            <Typography variant="body2" sx={{ color: '#172b4d', overflowWrap: 'anywhere' }}>
                {value || '-'}
            </Typography>
        </Box>
    );
}

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function isResponseSuccess(response) {
    const status = response?.status || 0;
    return status >= 200 && status < 300 && response?.data?.success !== false;
}

// Vendor Detail Modal Component
const VendorDetailModal = ({ open, vendorUserId, onClose, onAction, vendorData: propVendorData }) => {
    const [loading, setLoading] = useState(false);
    const [vendorData, setVendorData] = useState(null);
    const [error, setError] = useState(null);
    const [reason, setReason] = useState('');
    const [showReasonInput, setShowReasonInput] = useState(false);
    const [actionType, setActionType] = useState('');

    const fetchVendorDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await MainApi.get(`${VENDORS_ENDPOINT}/${vendorUserId}`);
            const responseData = response?.data?.data ?? response?.data ?? {};
            setVendorData(responseData);
            setReason('');
            setShowReasonInput(false);
            setActionType('');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Unable to load vendor details.'));
        } finally {
            setLoading(false);
        }
    }, [vendorUserId]);

    useEffect(() => {
        if (!open) return;

        queueMicrotask(() => {
            setReason('');
            setShowReasonInput(false);
            setActionType('');
        });

        if (propVendorData) {
            queueMicrotask(() => setError(null));
            return;
        }

        if (vendorUserId) {
            queueMicrotask(fetchVendorDetails);
        }
    }, [open, vendorUserId, propVendorData, fetchVendorDetails]);

    const handleAction = async (action) => {
        if (!vendorUserId) return;

        if (action === 'reject' || action === 'deactivate') {
            if (!reason.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Reason Required',
                    text: 'Please provide a reason for this action.',
                    confirmButtonColor: '#f79f03',
                });
                return;
            }
        }

        try {
            let response;
            let successMessage = '';
            const actionConfig = vendorActions[action];

            if (action === 'approve' || action === 'reject' || action === 'activate' || action === 'deactivate') {
                const payload = action === 'reject' || action === 'deactivate' ? { reason: reason.trim() } : {};
                response = await MainApi.post(actionConfig.endpoint(vendorUserId), payload);
                successMessage = `Vendor ${actionConfig.pastLabel} successfully!`;
            }

            const success = isResponseSuccess(response);

            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: success ? 'success' : 'warning',
                title: success ? `Vendor ${actionConfig.pastLabel}` : `${actionConfig.label} not completed`,
                text: getApiMessage(response?.data || {}, successMessage),
                confirmButtonColor: '#f79f03',
            });

            if (!success) return;

            onAction?.();
            onClose();
        } catch (error) {
            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: 'error',
                title: 'Error',
                text: getApiErrorMessage(error, `Failed to ${action} KYC`),
                confirmButtonColor: '#f79f03',
            });
        }
    };

    const renderKycStatus = (status) => {
        const normalizedStatus = String(status || '').toLowerCase().replaceAll('_', ' ');
        const statusMap = {
            approved: { label: 'Approved', color: 'success' },
            rejected: { label: 'Rejected', color: 'error' },
            pending: { label: 'Pending', color: 'warning' },
            submitted: { label: 'Submitted', color: 'info' },
            'not submitted': { label: 'Not Submitted', color: 'default' },
            'pending admin review': { label: 'Pending Admin Review', color: 'warning' },
        };
        const statusInfo = statusMap[normalizedStatus] || statusMap.pending;
        return <Chip label={statusInfo.label} color={statusInfo.color} size="small" />;
    };

    const displayVendorData = propVendorData || vendorData;
    const details = displayVendorData ? getNestedVendorDetail(displayVendorData) : null;
    const canReviewKyc = ['pending', 'submitted', 'pending_admin_review', 'pending admin review'].includes(
        String(details?.kycStatus || details?.approvalStatus || '').toLowerCase().replaceAll('_', ' ')
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                    Vendor Details
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress size={34} />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : details ? (
                    <Box>
                        <Box sx={{ mb: 2.5 }}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#172b4d' }}>
                                {details.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                ID: {details.id || '-'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                            {[
                                { label: 'Email', value: details.email },
                                { label: 'Phone', value: details.phone },
                                { label: 'Role', value: details.role },
                                { label: 'Vendor Type', value: details.vendorType },
                                { label: 'Account Status', value: <Chip label={details.isActive ? 'Active' : 'Inactive'} color={details.isActive ? 'success' : 'error'} size="small" variant="outlined" /> },
                                { label: 'KYC Status', value: renderKycStatus(details.kycStatus) },
                                { label: 'Approval Status', value: formatRoleName(details.approvalStatus) },
                                { label: 'Can Login', value: formatBoolean(details.canLogin) },
                                { label: 'Admin Message', value: details.approvalMessage },
                            ].map((item, index) => (
                                <DetailItem key={index} label={item.label} value={item.value} />
                            ))}
                        </Box>

                        {details.kyc && Object.keys(details.kyc).length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#172b4d', mb: 1 }}>
                                    KYC Details
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                                    <DetailItem label="Company Name" value={details.kyc.companyName} />
                                    <DetailItem label="Business Name" value={details.kyc.businessName} />
                                    <DetailItem label="Company Type" value={formatRoleName(details.kyc.companyType)} />
                                    <DetailItem label="Company Since" value={details.kyc.companySinceYears || details.kyc.companySince} />
                                    <DetailItem label="Team Size" value={details.kyc.teamSize} />
                                    <DetailItem label="Daily Leads" value={details.kyc.dailyLeadRequirement} />
                                    <DetailItem label="Address" value={[details.kyc.officeAddress, details.kyc.officeCity, details.kyc.officeState, details.kyc.country].filter(Boolean).join(', ')} />
                                    <DetailItem label="Destinations" value={(details.kyc.destinations || []).join(', ')} />
                                    <DetailItem label="Referral Source" value={formatRoleName(details.kyc.referralSource)} />
                                    <DetailItem label="Marketplace Worked" value={formatBoolean(details.kyc.marketplaceWorked)} />
                                    <DetailItem label="Submitted At" value={formatDate(details.kyc.submittedAt)} />
                                </Box>
                                {(details.kyc.websiteUrl || details.kyc.companyLogoUrl) && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" color="textSecondary">Company Logo</Typography>
                                        <Box
                                            component="img"
                                            src={details.kyc.companyLogoUrl || details.kyc.websiteUrl}
                                            alt={`${details.kyc.companyName || details.name} logo`}
                                            sx={{
                                                display: 'block',
                                                width: 120,
                                                height: 72,
                                                mt: 0.5,
                                                borderRadius: 1,
                                                border: '1px solid #e2e8f0',
                                                objectFit: 'contain',
                                                bgcolor: '#f8fafc',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        )}

                        {details.documents.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#172b4d', mb: 1 }}>
                                    Documents
                                </Typography>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                                    {details.documents.map((document) => (
                                        <Box key={document.id || `${document.type}-${document.documentNumber}`} sx={{ p: 1.25, border: '1px solid #e2e8f0', borderRadius: 1 }}>
                                            <Typography variant="body2" fontWeight={700}>{formatRoleName(document.type)}</Typography>
                                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                                                {document.documentNumber || '-'}
                                            </Typography>
                                            <Stack direction="row" spacing={1} sx={{ mt: 0.75, flexWrap: 'wrap', rowGap: 0.75 }}>
                                                <Chip size="small" label={document.isVerified ? 'Admin verified' : 'Admin pending'} color={document.isVerified ? 'success' : 'default'} variant="outlined" />
                                            </Stack>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}

                        {showReasonInput && (
                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Reason"
                                    multiline
                                    rows={3}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Please provide a reason for this action..."
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>
                ) : null}
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', gap: 1, flexWrap: 'wrap' }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
                    Close
                </Button>
                {details && (
                    <>
                        {canReviewKyc && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setShowReasonInput(false);
                                        handleAction('approve');
                                    }}
                                    sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
                                    startIcon={<CheckCircleIcon />}
                                >
                                    Approve KYC
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setShowReasonInput(true);
                                        setActionType('reject');
                                    }}
                                    sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                                    startIcon={<CancelIcon />}
                                >
                                    Reject KYC
                                </Button>
                            </>
                        )}
                        {showReasonInput && actionType === 'reject' && (
                            <Button
                                variant="contained"
                                onClick={() => handleAction('reject')}
                                sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                            >
                                Submit Rejection
                            </Button>
                        )}
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

// Action Modal for Deactivate/Recharge
const ActionModal = ({ open, onClose, title, fields, onSubmit, submitText, vendorName }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            const initialData = {};
            fields.forEach(field => {
                initialData[field.name] = '';
            });
            queueMicrotask(() => {
                setFormData(initialData);
                setErrors({});
            });
        }
    }, [open, fields]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
        fields.forEach(field => {
            if (field.required && !formData[field.name]?.trim()) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                    {title}
                </Typography>
                {vendorName && (
                    <Typography variant="body2" color="textSecondary">
                        {vendorName}
                    </Typography>
                )}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={2}>
                    {fields.map((field) => (
                        <TextField
                            key={field.name}
                            label={field.label}
                            type={field.type || 'text'}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                            error={!!errors[field.name]}
                            helperText={errors[field.name]}
                            required={field.required}
                            multiline={field.multiline}
                            rows={field.multiline ? 3 : 1}
                            placeholder={field.placeholder}
                            fullWidth
                            size="small"
                        />
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0', gap: 1 }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ bgcolor: '#f79f03', '&:hover': { bgcolor: '#e08a02' }, textTransform: 'none' }}
                >
                    {submitText || 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Main Component
const VendorList = () => {
    const tableScrollRef = useRef(null);

    // State
    const [vendors, setVendors] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusTab, setStatusTab] = useState('all');
    const [sortBy, setSortBy] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');

    // Modal / Popup state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [reason, setReason] = useState('');
    const [actionType, setActionType] = useState('');
    const [modalLoading, setModalLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    // Detail modal state
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [vendorDetails, setVendorDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [selectedVendorUserId, setSelectedVendorUserId] = useState(null);

    // Action modal state
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionModalType, setActionModalType] = useState('');
    const [actionModalVendor, setActionModalVendor] = useState(null);

    // Menu state
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuVendor, setMenuVendor] = useState(null);

    const trimmedSearch = searchTerm.trim();
    const searchQuery = trimmedSearch.length >= 3 ? trimmedSearch : '';

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const params = {
                page: page * rowsPerPage,
                size: rowsPerPage,
            };

            if (searchQuery) params.search = searchQuery;
            if (statusTab !== 'all') params.isActive = statusTab === 'active';
            if (sortBy && sortOrder) {
                params.sortBy = sortBy;
                params.sortOrder = sortOrder.toUpperCase();
            }

            const response = await MainApi.get(VENDORS_ENDPOINT, { params });
            const responseData = response?.data?.data ?? response?.data ?? {};
            const vendorData = Array.isArray(responseData)
                ? responseData
                : responseData.content || responseData.vendors || responseData.items || responseData.results || [];
            const total = responseData.total ?? responseData.totalElements ?? responseData.totalCount ?? vendorData.length;

            setVendors(vendorData.map(normalizeVendor));
            setTotalCount(Number(total) || 0);
        } catch (error) {
            setVendors([]);
            setTotalCount(0);
            setFetchError(getApiErrorMessage(error, 'Unable to load vendors.'));
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchQuery, statusTab, sortBy, sortOrder]);

    useEffect(() => {
        queueMicrotask(fetchData);
    }, [fetchData]);

    // Handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleTabChange = (newValue) => {
        setStatusTab(newValue);
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

    const handleMenuOpen = (event, vendor) => {
        setMenuAnchor(event.currentTarget);
        setMenuVendor(vendor);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuVendor(null);
    };

    const handleTableKeyDown = (event) => {
        const target = event.currentTarget;
        const scrollAmount = event.shiftKey ? 120 : 48;
        const pageAmount = target.clientHeight - 48;
        let handled = true;

        if (event.key === 'ArrowDown') target.scrollTop += scrollAmount;
        else if (event.key === 'ArrowUp') target.scrollTop -= scrollAmount;
        else if (event.key === 'PageDown') target.scrollTop += pageAmount;
        else if (event.key === 'PageUp') target.scrollTop -= pageAmount;
        else handled = false;

        if (handled) event.preventDefault();
    };

    const openActionModal = (vendor, type) => {
        if (!vendor || !vendorActions[type]) return;
        setSelectedVendor(vendor);
        setActionType(type);
        setReason('');
        setActionError('');
        setModalOpen(true);
        handleMenuClose();
    };

    const openActionModalNew = (vendor, type) => {
        handleMenuClose();
        setActionModalVendor(vendor);
        setActionModalType(type);
        setActionModalOpen(true);
    };

    const openDetailsModal = async (vendor) => {
        handleMenuClose();
        setSelectedVendor(vendor);
        setSelectedVendorUserId(vendor.id || vendor.vendorUserId);
        setDetailsOpen(true);
        setDetailsLoading(true);
        setDetailsError('');
        setVendorDetails(null);

        try {
            const response = await MainApi.get(`${VENDORS_ENDPOINT}/${vendor.vendorUserId || vendor.id}`);
            const responseData = response?.data?.data ?? response?.data ?? {};
            setVendorDetails(responseData);
        } catch (error) {
            setDetailsError(getApiErrorMessage(error, 'Unable to load vendor details.'));
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleConfirmAction = async () => {
        const action = vendorActions[actionType];
        if (!selectedVendor || !action) return;
        setModalLoading(true);
        setActionError('');
        try {
            const payload = actionType === 'reject' || actionType === 'deactivate' ? { reason: reason.trim() } : {};
            const response = await MainApi.post(action.endpoint(selectedVendor.id), payload);
            const success = isResponseSuccess(response);

            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: success ? 'success' : 'warning',
                title: success ? `Vendor ${action.pastLabel}` : `${action.label} not completed`,
                text: getApiMessage(response?.data || {}, `Vendor ${action.pastLabel} successfully.`),
                confirmButtonColor: '#f79f03',
            });

            if (!success) return;

            await fetchData();
            setModalOpen(false);
            setDetailsOpen(false);
            setSelectedVendor(null);
            setActionType('');
            setReason('');
        } catch (error) {
            const message = getApiErrorMessage(error, `Unable to ${action.label.toLowerCase()} vendor.`);
            setActionError(message);
            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: 'error',
                title: `${action.label} failed`,
                text: message,
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleActionModalSubmit = async (formData) => {
        try {
            let response;
            let successMessage = '';
            let action = vendorActions[actionModalType];

            if (actionModalType === 'deactivate') {
                response = await MainApi.post(action.endpoint(actionModalVendor.id), { reason: formData.reason });
                successMessage = 'Vendor deactivated successfully!';
            } else if (actionModalType === 'recharge') {
                response = await MainApi.post(action.endpoint(actionModalVendor.id), {
                    amount: parseInt(formData.amount),
                    reason: formData.reason,
                });
                successMessage = 'Wallet recharged successfully!';
            }

            const success = isResponseSuccess(response);

            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: success ? 'success' : 'warning',
                title: success ? 'Success' : 'Failed',
                text: getApiMessage(response?.data || {}, successMessage),
                confirmButtonColor: '#f79f03',
            });

            if (!success) return;

            setActionModalOpen(false);
            await fetchData();
        } catch (error) {
            await Swal.fire({
                ...SWEET_ALERT_OPTIONS,
                icon: 'error',
                title: 'Error',
                text: getApiErrorMessage(error, 'Operation failed'),
                confirmButtonColor: '#f79f03',
            });
        }
    };

    // Helper: render status chip
    const renderStatusChip = (status) => {
        const label = status.charAt(0).toUpperCase() + status.slice(1);
        const color = status === 'active' ? 'success' : 'error';
        return <Chip size="small" label={label} color={color} variant="outlined" />;
    };

    const renderKycChip = (status) => {
        const normalizedStatus = String(status || '').toLowerCase().replaceAll('_', ' ');
        const colorMap = {
            approved: 'success',
            rejected: 'error',
            submitted: 'warning',
            pending: 'warning',
            'not submitted': 'default',
            'pending admin review': 'warning',
        };
        const color = colorMap[normalizedStatus] || 'default';
        return <Chip size="small" label={formatRoleName(normalizedStatus) || 'Not Submitted'} color={color} variant="outlined" sx={{ fontSize: 11, maxWidth: '100%' }} />;
    };

    // Get action modal fields
    const getActionModalFields = () => {
        if (actionModalType === 'deactivate') {
            return [
                {
                    name: 'reason',
                    label: 'Reason for Deactivation',
                    required: true,
                    multiline: true,
                    placeholder: 'Please provide a reason for deactivation...',
                },
            ];
        } else if (actionModalType === 'recharge') {
            return [
                {
                    name: 'amount',
                    label: 'Amount',
                    type: 'number',
                    required: true,
                    placeholder: 'Enter amount to recharge',
                },
                {
                    name: 'reason',
                    label: 'Reason',
                    required: true,
                    multiline: true,
                    placeholder: 'Reason for wallet recharge...',
                },
            ];
        }
        return [];
    };

    // Columns
    const columns = [
        { id: 'name', label: 'Vendor', width: '20%', sortField: 'firstName' },
        { id: 'email', label: 'Email', width: '25%', sortField: 'email' },
        { id: 'phone', label: 'Phone', width: '12%' },
        { id: 'vendorType', label: 'Vendor Type', width: '14%' },
        { id: 'kycStatus', label: 'KYC', width: '12%', sortField: 'kycStatus' },
        { id: 'status', label: 'Status', width: '9%' },
    ];

    const statusFilters = [
        { label: 'All', value: 'all', color: 'primary' },
        { label: 'Active', value: 'active', color: 'success' },
        { label: 'Inactive', value: 'inactive', color: 'error' },
    ];

    const currentAction = vendorActions[actionType];

    return (
        <Box sx={{ width: '100%', height: 'calc(100dvh - 104px)', minHeight: 0, m: 0, overflow: 'hidden' }}>
            <style jsx global>{`
                .agent-swal-container {
                    z-index: 2500 !important;
                }
            `}</style>
            <Paper elevation={0} sx={{ width: '100%', height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: { xs: 1, md: 1.5 }, borderRadius: 2, border: '1px solid #e6eaf0', boxShadow: '0 2px 8px rgba(31, 45, 61, 0.06)' }}>
                <Typography sx={{ color: '#172b4d', fontSize: { xs: 16, md: 18 }, fontWeight: 600, pb: 1, mb: 1, borderBottom: '1px solid #e2e7ed' }}>
                    Vendor List
                </Typography>

                {/* Status filters + search */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}>
                        {statusFilters.map((filter) => (
                            <Chip
                                key={filter.value}
                                label={filter.label}
                                color={filter.color}
                                variant={statusTab === filter.value ? 'filled' : 'outlined'}
                                onClick={() => handleTabChange(filter.value)}
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
                    </Box>

                    <TextField
                        placeholder="Search vendors by name or email"
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

                {/* Table */}
                <TableContainer
                    ref={tableScrollRef}
                    tabIndex={0}
                    role="region"
                    aria-label="Vendor table"
                    onKeyDown={handleTableKeyDown}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
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
                                <TableCell align="right" sx={{ width: '9%', color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        <CircularProgress size={30} />
                                        <Typography variant="body2" sx={{ mt: 1 }}>Loading vendors...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : fetchError ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ color: 'error.main' }}>{fetchError}</TableCell>
                                </TableRow>
                            ) : vendors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">No vendors found</TableCell>
                                </TableRow>
                            ) : (
                                vendors.map((vendor) => (
                                    <TableRow key={vendor.id} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#172b4d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.name}</TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.email}</TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.phone}</TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.vendorType}</TableCell>
                                        <TableCell>{renderKycChip(vendor.kycStatus)}</TableCell>
                                        <TableCell>{renderStatusChip(vendor.status)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, vendor)}
                                                sx={{ width: 28, height: 28 }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[10, 50, 100, 200]}
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
                    <MenuItem onClick={() => openDetailsModal(menuVendor)}>
                        <ListItemIcon><VisibilityOutlinedIcon color="primary" /></ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                    </MenuItem>
                    {menuVendor?.status === 'inactive' ? (
                        <MenuItem onClick={() => openActionModal(menuVendor, 'activate')}>
                            <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                            <ListItemText>Activate Vendor</ListItemText>
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={() => openActionModalNew(menuVendor, 'deactivate')}>
                            <ListItemIcon><BlockIcon color="error" /></ListItemIcon>
                            <ListItemText>Deactivate Vendor</ListItemText>
                        </MenuItem>
                    )}
                    <MenuItem onClick={() => openActionModalNew(menuVendor, 'recharge')}>
                        <ListItemIcon><AccountBalanceWalletIcon color="primary" /></ListItemIcon>
                        <ListItemText>Wallet Recharge</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Reason Modal for KYC Actions */}
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        {currentAction ? `${currentAction.label} Vendor` : 'Vendor Action'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {selectedVendor?.name} ({selectedVendor?.email})
                        </Typography>
                        {actionError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {actionError}
                            </Alert>
                        )}
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Reason"
                            fullWidth
                            multiline
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for this action"
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirmAction}
                            variant="contained"
                            color={currentAction?.color || 'primary'}
                            disabled={modalLoading || !reason.trim()}
                        >
                            {modalLoading ? 'Processing...' : currentAction?.label || 'Confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Vendor Detail Modal */}
                <VendorDetailModal
                    open={detailsOpen}
                    vendorUserId={selectedVendorUserId}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedVendorUserId(null);
                        setVendorDetails(null);
                    }}
                    onAction={fetchData}
                    vendorData={vendorDetails}
                />

                {/* Action Modal for Deactivate/Recharge */}
                <ActionModal
                    open={actionModalOpen}
                    onClose={() => {
                        setActionModalOpen(false);
                        setActionModalVendor(null);
                        setActionModalType('');
                    }}
                    title={actionModalType === 'deactivate' ? 'Deactivate Vendor' : 'Wallet Recharge'}
                    fields={getActionModalFields()}
                    onSubmit={handleActionModalSubmit}
                    submitText={actionModalType === 'deactivate' ? 'Deactivate' : 'Recharge'}
                    vendorName={actionModalVendor?.name}
                />
            </Paper>
        </Box>
    );
};

export default VendorList;
