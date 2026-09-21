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
    DialogContentText,
    DialogActions,
    CircularProgress,
    Alert,
    Typography,
    Box,
    InputAdornment,
    Avatar,
    Grid,
    Stack,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Tooltip,
} from '@mui/material';
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Block as BlockIcon,
    AttachMoney as AttachMoneyIcon,
    Close as CloseIcon,
    Verified as VerifiedIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    Business as BusinessIcon,
    CalendarToday as CalendarTodayIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 600,
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    borderBottom: '2px solid #e2e8f0',
}));

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
        pending: { bg: '#fef3c7', color: '#92400e' },
        verified: { bg: '#dcfce7', color: '#166534' },
        activated: { bg: '#dbeafe', color: '#1e40af' },
        rejected: { bg: '#fee2e2', color: '#991b1b' },
        default: { bg: '#f1f5f9', color: '#475569' },
    };
    const statusColor = colors[status?.toLowerCase()] || colors.default;
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

// Constants
const LEADS_ENDPOINT = '/admin/leads';

const getLeadId = (lead) => lead?.id || lead?._id || lead?.leadId;

const getLeadName = (lead) => {
    const fullName = [lead?.firstName, lead?.lastName].filter(Boolean).join(' ').trim();
    return fullName || lead?.name || lead?.leadName || '-';
};

const getCategoryLabel = (lead) => (
    lead?.category?.name
    || lead?.serviceCategory?.name
    || lead?.categoryName
    || lead?.serviceCategoryName
    || lead?.categoryId
    || '-'
);

const getServiceLabel = (lead) => (
    lead?.service?.name
    || lead?.serviceName
    || lead?.service?.title
    || lead?.serviceId
    || '-'
);

const getLeadSource = (lead) => (
    lead?.metadata?.source
    || lead?.source
    || lead?.leadSource
    || '-'
);

const getLeadLocation = (lead) => [lead?.city, lead?.state, lead?.country].filter(Boolean).join(', ') || '-';

function formatDetailValue(value) {
    if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value === 0) return '0';
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
}

function getDocumentUrl(value) {
    const rawValue = Array.isArray(value) ? value[0] : value;
    const text = String(rawValue || '').trim();
    const markdownMatch = text.match(/\((https?:\/\/[^)]+)\)/i);
    return markdownMatch?.[1] || text;
}

function getLeadDocuments(metadata = {}) {
    const documentFields = [
        { label: 'Resume', value: metadata.resumeUrl },
        { label: 'Passport', value: metadata.passportDocumentUrl },
        { label: 'Language Test', value: metadata.ieltsDocumentUrl },
        { label: 'Bank Statement', value: metadata.bankStatementUrl },
        ...(metadata.educationalCertificateUrls || []).map((url, index) => ({ label: `Educational Certificate ${index + 1}`, value: url })),
        ...(metadata.experienceLetterUrls || []).map((url, index) => ({ label: `Experience Letter ${index + 1}`, value: url })),
    ];

    return documentFields
        .map((document) => ({ ...document, url: getDocumentUrl(document.value) }))
        .filter((document) => /^https?:\/\//i.test(document.url));
}

function LeadDetailItem({ item }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, minWidth: 0, minHeight: 58, pb: 1.5, borderBottom: '1px solid #e5e7eb' }}>
            {item.icon && <Box sx={{ mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>}
            <Box sx={{ minWidth: 0, width: '100%' }}>
                <Typography sx={{ color: '#667085', fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{item.label}</Typography>
                <Typography sx={{ mt: 0.55, color: '#12213d', fontSize: 15, fontWeight: 600, lineHeight: 1.45, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatDetailValue(item.value)}
                </Typography>
            </Box>
        </Box>
    );
}

function LeadDetailSection({ section }) {
    const rows = [];

    for (let index = 0; index < section.items.length; index += 2) {
        rows.push(section.items.slice(index, index + 2));
    }

    return (
        <Grid item xs={12} key={section.title}>
            <Box sx={{ pb: 1 }}>
                <Typography sx={{ color: '#1f2a77', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    {section.title}
                </Typography>
                <Box sx={{ display: 'grid', gap: 1.5, mt: 1.5 }}>
                    {rows.map((row) => (
                        <Box
                            key={`${section.title}-${row.map((item) => item.label).join('-')}`}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                                columnGap: 5,
                                rowGap: 1.5,
                                alignItems: 'start',
                                width: '100%',
                            }}
                        >
                            <LeadDetailItem item={row[0]} />
                            {row[1] ? <LeadDetailItem item={row[1]} /> : <Box sx={{ display: { xs: 'none', sm: 'block' } }} />}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Grid>
    );
}

// Lead Detail Modal Component
const LeadDetailModal = ({ open, leadId, onClose, onAction }) => {
    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState(null);
    const [error, setError] = useState(null);
    const [creditCost, setCreditCost] = useState('');
    const [reason, setReason] = useState('');
    const [showPriceInput, setShowPriceInput] = useState(false);
    const [showReasonInput, setShowReasonInput] = useState(false);
    const [actionType, setActionType] = useState('');

    const fetchLeadDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await MainApi.get(`${LEADS_ENDPOINT}/${leadId}`);
            const data = response?.data?.data ?? response?.data ?? {};
            setLeadData(data);
            setCreditCost('');
            setReason('');
            setShowPriceInput(false);
            setShowReasonInput(false);
            setActionType('');
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Unable to load lead details.');
        } finally {
            setLoading(false);
        }
    }, [leadId]);

    useEffect(() => {
        if (open && leadId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchLeadDetails();
        }
    }, [fetchLeadDetails, leadId, open]);

    const handleAction = async (action) => {
        if (!leadId) return;

        if (action === 'reject' && !reason.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Reason Required',
                text: 'Please provide a reason for rejection.',
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'leads-swal-container',
                },
            });
            return;
        }

        if (action === 'activate' && !creditCost) {
            Swal.fire({
                icon: 'error',
                title: 'Price Required',
                text: 'Please enter the credit cost.',
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'leads-swal-container',
                },
            });
            return;
        }

        try {
            let response;
            let successMessage = '';
            let endpoint = '';

            // Using PATCH method for all actions
            if (action === 'verify') {
                endpoint = `${LEADS_ENDPOINT}/${leadId}/verify`;
                response = await MainApi.patch(endpoint, {});
                successMessage = 'Lead verified successfully!';
            } else if (action === 'activate') {
                endpoint = `${LEADS_ENDPOINT}/${leadId}/activate`;
                response = await MainApi.patch(endpoint, { creditCost: parseInt(creditCost) });
                successMessage = 'Lead activated successfully!';
            } else if (action === 'reject') {
                endpoint = `${LEADS_ENDPOINT}/${leadId}/reject`;
                response = await MainApi.patch(endpoint, { reason: reason.trim() });
                successMessage = 'Lead rejected successfully!';
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: successMessage,
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'leads-swal-container',
                },
            });

            onAction?.();
            onClose();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || error?.message || 'Action failed. Please try again.',
                confirmButtonColor: '#f79f03',
                customClass: {
                    container: 'leads-swal-container',
                },
            });
        }
    };

    const renderStatusChip = (status) => {
        const statusMap = {
            pending: { label: 'Pending', color: 'warning' },
            verified: { label: 'Verified', color: 'success' },
            activated: { label: 'Activated', color: 'info' },
            rejected: { label: 'Rejected', color: 'error' },
        };
        const statusInfo = statusMap[status?.toLowerCase()] || statusMap.pending;
        return <Chip label={statusInfo.label} color={statusInfo.color} size="small" />;
    };

    const formatDate = (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const metadata = leadData?.metadata || {};
    const documents = getLeadDocuments(metadata);
    const detailSections = leadData ? [
        {
            title: 'Lead Status',
            items: [
                { label: 'Lead ID', value: leadData.id },
                { label: 'Type', value: leadData.type },
                { label: 'Status', value: leadData.status },
                { label: 'Credit Cost', value: leadData.creditCost },
                { label: 'Max Unlocks', value: leadData.maxUnlocks },
                { label: 'Unlock Count', value: leadData.unlockCount },
                { label: 'Created', value: formatDate(leadData.createdAt), icon: <CalendarTodayIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Expires', value: formatDate(leadData.expiresAt) },
            ],
            fullWidth: true,
        },
        {
            title: 'Contact Information',
            items: [
                { label: 'Lead Name', value: getLeadName(leadData), icon: <PersonIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Email', value: leadData.email, icon: <EmailIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Phone', value: leadData.phone, icon: <PhoneIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'WhatsApp Number', value: metadata.whatsappNumber, icon: <PhoneIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Location', value: getLeadLocation(leadData), icon: <LocationOnIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
            ],
        },
        {
            title: 'Lead Requirement',
            items: [
                { label: 'Category', value: getCategoryLabel(leadData), icon: <BusinessIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Service', value: getServiceLabel(leadData), icon: <VerifiedIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Source', value: getLeadSource(leadData), icon: <PersonIcon sx={{ color: '#1f2a77', fontSize: 18 }} /> },
                { label: 'Services Required', value: metadata.servicesRequired },
                { label: 'Destination Countries', value: metadata.destinationCountries },
                { label: 'Investment Budget', value: metadata.investmentBudget },
                { label: 'Application Timeline', value: metadata.applicationTimeline },
            ],
        },
        {
            title: 'Personal Profile',
            items: [
                { label: 'Gender', value: metadata.gender },
                { label: 'Date Of Birth', value: metadata.dateOfBirth },
                { label: 'Marital Status', value: metadata.maritalStatus },
                { label: 'Nationality', value: metadata.nationality },
                { label: 'Consent To Calls', value: metadata.consentToCalls },
                { label: 'Terms Accepted', value: metadata.termsAccepted },
            ],
        },
        {
            title: 'Education & Language',
            items: [
                { label: 'Highest Qualification', value: metadata.highestQualification },
                { label: 'Passing Year', value: metadata.passingYear },
                { label: 'University', value: metadata.university },
                { label: 'Percentage / CGPA', value: metadata.percentageOrCgpa },
                { label: 'Language Test Taken', value: metadata.languageTestTaken },
                { label: 'Overall Score', value: metadata.overallScore },
                { label: 'Listening Score', value: metadata.listeningScore },
                { label: 'Reading Score', value: metadata.readingScore },
                { label: 'Writing Score', value: metadata.writingScore },
                { label: 'Speaking Score', value: metadata.speakingScore },
            ],
        },
        {
            title: 'Work Experience',
            items: [
                { label: 'Current Company', value: metadata.currentCompany },
                { label: 'Current Designation', value: metadata.currentDesignation },
                { label: 'Industry', value: metadata.industry },
                { label: 'Years Of Experience', value: metadata.yearsOfExperience },
                { label: 'Current Salary', value: metadata.currentSalary },
                { label: 'Relevant Experience', value: metadata.relevantExperience },
            ],
        },
        {
            title: 'Passport & Family',
            items: [
                { label: 'Passport Available', value: metadata.passportAvailable },
                { label: 'Passport Expiry', value: metadata.passportExpiry },
                { label: 'Family Marital Status', value: metadata.familyMaritalStatus },
                { label: 'Spouse Qualification', value: metadata.spouseQualification },
                { label: 'Children', value: metadata.children },
                { label: 'Dependents', value: metadata.dependents },
            ],
        },
        {
            title: 'Review Information',
            items: [
                { label: 'Activated At', value: formatDate(leadData.activatedAt) },
                { label: 'Reviewed At', value: formatDate(leadData.reviewedAt) },
                { label: 'Reviewed By Admin ID', value: leadData.reviewedByAdminId },
                { label: 'Rejected At', value: formatDate(leadData.rejectedAt) },
                { label: 'Rejection Reason', value: leadData.rejectionReason },
                { label: 'Direct Vendor User ID', value: leadData.directVendorUserId },
                { label: 'Client User ID', value: leadData.clientUserId },
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
                            Lead Details
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.25, color: '#64748b' }}>
                            {getLeadName(leadData)} {leadData?.id ? `• ID: ${leadData.id}` : ''}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: '#172b4d', bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 0, pt: 0, pb: 0, bgcolor: '#fff', maxHeight: '64vh', overflowY: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, px: 2 }}>
                        <CircularProgress size={34} />
                        <Typography sx={{ ml: 2 }}>Loading lead details...</Typography>
                    </Box>
                ) : error ? (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                ) : leadData ? (
                    <Box sx={{ px: 3, py: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                            {renderStatusChip(leadData.status)}
                        </Box>

                        <Grid container spacing={2}>
                            {detailSections.map((section) => (
                                <LeadDetailSection key={section.title} section={section} />
                            ))}
                            {leadData.message && (
                                <Grid item xs={12}>
                                    <Box sx={{ borderBottom: '1px solid #e5e7eb', pb: 1.5 }}>
                                        <Typography sx={{ color: '#1f2a77', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                                            Message
                                        </Typography>
                                        <Typography sx={{ mt: 0.8, color: '#12213d', fontSize: 15, fontWeight: 600, lineHeight: 1.55 }}>
                                            {leadData.message}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                            {metadata.additionalInformation && metadata.additionalInformation !== leadData.message && (
                                <Grid item xs={12}>
                                    <Box sx={{ borderBottom: '1px solid #e5e7eb', pb: 1.5 }}>
                                        <Typography sx={{ color: '#1f2a77', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                                            Additional Information
                                        </Typography>
                                        <Typography sx={{ mt: 0.8, color: '#12213d', fontSize: 15, fontWeight: 600, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                                            {metadata.additionalInformation}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                            {documents.length > 0 && (
                                <Grid item xs={12}>
                                    <Box sx={{ borderBottom: '1px solid #e5e7eb', pb: 1.5 }}>
                                        <Typography sx={{ color: '#1f2a77', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.7 }}>
                                            Uploaded Documents
                                        </Typography>
                                        <Stack direction="row" columnGap={1.75} rowGap={1.25} flexWrap="wrap" sx={{ mt: 1.5 }}>
                                            {documents.map((document) => (
                                                <Button
                                                    key={`${document.label}-${document.url}`}
                                                    href={document.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<DownloadIcon fontSize="small" />}
                                                    sx={{
                                                        borderRadius: '999px',
                                                        minHeight: 32,
                                                        px: 1.6,
                                                        py: 0.35,
                                                        bgcolor: '#f8fafc',
                                                        borderColor: '#cbd5e1',
                                                        color: '#1f2a77',
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        width: 'max-content',
                                                        maxWidth: '100%',
                                                        whiteSpace: 'nowrap',
                                                        flexShrink: 0,
                                                        '& .MuiButton-startIcon': { mr: 0.85 },
                                                        '& .MuiButton-label': { whiteSpace: 'nowrap' },
                                                        '&:hover': {
                                                            bgcolor: '#eef2ff',
                                                            borderColor: '#1f2a77',
                                                        },
                                                    }}
                                                >
                                                    {document.label}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>

                        {/* Action Inputs */}
                        {showPriceInput && (
                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Credit Cost"
                                    type="number"
                                    value={creditCost}
                                    onChange={(e) => setCreditCost(e.target.value)}
                                    placeholder="Enter credit cost for activation"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AttachMoneyIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        )}

                        {showReasonInput && (
                            <Box sx={{ mt: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Reason for Rejection"
                                    multiline
                                    rows={3}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Please provide a reason for rejecting this lead..."
                                    size="small"
                                />
                            </Box>
                        )}
                    </Box>
                ) : null}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 1.75, borderTop: '1px solid #e2e8f0', columnGap: 2, rowGap: 1.25, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
                    Close
                </Button>
                {leadData && (
                    <>
                        {leadData.status?.toLowerCase() === 'pending' && (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setShowPriceInput(false);
                                        setShowReasonInput(false);
                                        handleAction('verify');
                                    }}
                                    sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' }, textTransform: 'none' }}
                                    startIcon={<VerifiedIcon />}
                                >
                                    Verify Lead
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setShowReasonInput(true);
                                        setShowPriceInput(false);
                                        setActionType('reject');
                                    }}
                                    sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, textTransform: 'none' }}
                                    startIcon={<CancelIcon />}
                                >
                                    Reject Lead
                                </Button>
                            </>
                        )}
                        {leadData.status?.toLowerCase() === 'verified' && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setShowPriceInput(true);
                                    setShowReasonInput(false);
                                    setActionType('activate');
                                }}
                                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none' }}
                                startIcon={<AttachMoneyIcon />}
                            >
                                Activate & Add Price
                            </Button>
                        )}
                        {showPriceInput && actionType === 'activate' && (
                            <Button
                                variant="contained"
                                onClick={() => handleAction('activate')}
                                sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, textTransform: 'none' }}
                            >
                                Activate Lead
                            </Button>
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

// Main Component
const LeadList = () => {
    const tableScrollRef = useRef(null);

    // State
    const [leads, setLeads] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState('');

    // Detail modal state
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);

    // Menu state
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuLead, setMenuLead] = useState(null);

    const trimmedSearch = searchTerm.trim();
    const searchQuery = trimmedSearch.length >= 2 ? trimmedSearch : '';

    // Fetch leads
    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setFetchError('');
        try {
            const params = {
                status: statusFilter,
                take: rowsPerPage,
                skip: page * rowsPerPage,
            };

            if (searchQuery) params.search = searchQuery;

            const response = await MainApi.get(LEADS_ENDPOINT, { params });
            const responseData = response?.data?.data ?? response?.data ?? {};
            const leadData = Array.isArray(responseData)
                ? responseData
                : responseData.content || responseData.leads || responseData.items || responseData.results || [];
            const total = responseData.total ?? responseData.totalElements ?? responseData.totalCount ?? leadData.length;

            setLeads(leadData);
            setTotalCount(Number(total) || 0);
        } catch (error) {
            setLeads([]);
            setTotalCount(0);
            setFetchError(error?.response?.data?.message || error?.message || 'Unable to load leads.');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchQuery, statusFilter]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLeads();
    }, [fetchLeads]);

    // Handlers
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(0);
    };

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleMenuOpen = (event, lead) => {
        setMenuAnchor(event.currentTarget);
        setMenuLead(lead);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
        setMenuLead(null);
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

    const handleViewDetails = (lead) => {
        handleMenuClose();
        setSelectedLeadId(getLeadId(lead));
        setDetailsOpen(true);
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

    // Columns
    const columns = [
        { id: 'name', label: 'Lead Name', width: '20%' },
        { id: 'email', label: 'Email', width: '25%' },
        { id: 'phone', label: 'Phone', width: '15%' },
        { id: 'category', label: 'Category', width: '18%' },
        { id: 'status', label: 'Status', width: '10%' },
        { id: 'createdAt', label: 'Created On', width: '12%' },
    ];

    const statusOptions = [
        { value: 'PENDING', label: 'Pending' },
        { value: 'VERIFIED', label: 'Verified' },
        { value: 'ACTIVATED', label: 'Activated' },
        { value: 'REJECTED', label: 'Rejected' },
    ];

    return (
        <Box sx={{ width: '100%', height: 'calc(100dvh - 104px)', minHeight: 0, m: 0, overflow: 'hidden' }}>
            <style jsx global>{`
                .leads-swal-container {
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
                    Lead List
                </Typography>

                {/* Filters */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                label="Status"
                                MenuProps={{
                                    disableScrollLock: true,
                                    keepMounted: true,
                                }}
                            >
                                {statusOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <TextField
                        placeholder="Search leads..."
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
                    aria-label="Scrollable leads table"
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
                            width: '100%',
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
                                        {col.label}
                                    </TableCell>
                                ))}
                                <TableCell align="right" sx={{ width: 70, color: '#344054', bgcolor: '#f5f8fb', fontWeight: 700, borderBottom: '1px solid #dfe5ec' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <CircularProgress size={30} />
                                        <Typography variant="body2" sx={{ mt: 1, color: '#64748b' }}>Loading leads...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : fetchError ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ color: 'error.main', py: 4 }}>
                                        <Alert severity="error">{fetchError}</Alert>
                                    </TableCell>
                                </TableRow>
                            ) : leads.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="textSecondary">No leads found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                leads.map((lead) => (
                                    <StyledTableRow key={getLeadId(lead)} hover>
                                        <TableCell sx={{ fontWeight: 600, color: '#172b4d' }}>
                                            {getLeadName(lead)}
                                        </TableCell>
                                        <TableCell sx={{ color: '#5f6f81', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {lead.email || '-'}
                                        </TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.phone || '-'}</TableCell>
                                        <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {getCategoryLabel(lead)}
                                        </TableCell>
                                        <TableCell>{renderStatusChip(lead.status)}</TableCell>
                                        <TableCell>{formatDate(lead.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, lead)}
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

                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50, 100]}
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
                    disableScrollLock
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem onClick={() => handleViewDetails(menuLead)}>
                        <ListItemIcon>
                            <VisibilityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>View Details</ListItemText>
                    </MenuItem>
                </Menu>

                {/* Lead Detail Modal */}
                <LeadDetailModal
                    open={detailsOpen}
                    leadId={selectedLeadId}
                    onClose={() => {
                        setDetailsOpen(false);
                        setSelectedLeadId(null);
                    }}
                    onAction={fetchLeads}
                />
            </Paper>
        </Box>
    );
};

export default LeadList;
