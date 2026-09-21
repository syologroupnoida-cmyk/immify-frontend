'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Close as CloseIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const VENDOR_JOB_LISTINGS_ENDPOINT = '/vendor/job-listings';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    width: '100%',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
}));

const initialFormData = {
    country: '',
    cityRegion: '',
    title: '',
    industry: '',
    qualification: '',
    experience: '',
    indicativeSalary: '',
    employmentType: '',
    visaWorkPermit: '',
    description: '',
    vacancyCount: 1,
    applicationEmail: '',
    applicationUrl: '',
    applicationDeadline: '',
    expiresAt: '',
};

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function unwrapJob(payload) {
    const data = payload?.data ?? payload ?? {};
    return data?.data ?? data?.job ?? data?.item ?? data;
}

function toArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (!value) return [];
    return [String(value)];
}

function markdownUrlToPlainUrl(value) {
    const text = String(value || '').trim();
    const markdownMatch = text.match(/\((https?:\/\/[^)]+)\)/i);
    return markdownMatch?.[1] || text;
}

function toDateTimeInputValue(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIsoDateTime(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function SectionHeader({ title }) {
    return (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            {title}
        </Typography>
    );
}

function ArrayField({ label, placeholder, values, inputValue, setInputValue, onAdd, onRemove, error, disabled }) {
    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <TextField
                    fullWidth
                    size="small"
                    label={label}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            onAdd();
                        }
                    }}
                    error={!!error}
                    helperText={error || 'Press Enter or use Add to include multiple values.'}
                    disabled={disabled}
                />
                <Button
                    type="button"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    disabled={disabled}
                    sx={{ minWidth: 96, height: 40, alignSelf: 'flex-start', textTransform: 'none' }}
                >
                    Add
                </Button>
            </Stack>

            {values.length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
                    {values.map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            size="small"
                            onDelete={() => onRemove(item)}
                            deleteIcon={<CloseIcon />}
                            sx={{ bgcolor: '#f1f5f9', color: '#334155' }}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export function JobPostForm({
    mode = 'create',
    jobListingId = '',
    endpoint = VENDOR_JOB_LISTINGS_ENDPOINT,
    title,
    submitLabels,
    onSubmit,
    onCancel,
}) {
    const isEditMode = mode === 'edit';
    const [formData, setFormData] = useState(initialFormData);
    const [responsibilityInput, setResponsibilityInput] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [responsibilities, setResponsibilities] = useState([]);
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!isEditMode || !jobListingId) return undefined;
        let mounted = true;

        async function loadJobDetails() {
            setLoadingDetails(true);
            setApiError('');

            try {
                const response = await MainApi.get(`${endpoint}/${jobListingId}`);
                const job = unwrapJob(response?.data);

                if (!mounted) return;

                setFormData({
                    country: job.country || '',
                    cityRegion: job.cityRegion || '',
                    title: job.title || '',
                    industry: job.industry || '',
                    qualification: job.qualification || '',
                    experience: job.experience || '',
                    indicativeSalary: job.indicativeSalary || '',
                    employmentType: job.employmentType || '',
                    visaWorkPermit: job.visaWorkPermit || '',
                    description: job.description || '',
                    vacancyCount: job.vacancyCount || 1,
                    applicationEmail: job.applicationEmail || '',
                    applicationUrl: markdownUrlToPlainUrl(job.applicationUrl),
                    applicationDeadline: toDateTimeInputValue(job.applicationDeadline),
                    expiresAt: toDateTimeInputValue(job.expiresAt),
                });
                setResponsibilities(toArray(job.responsibilities));
                setRequiredSkills(toArray(job.requiredSkills));
            } catch (error) {
                if (mounted) setApiError(getApiErrorMessage(error, 'Unable to load job listing details.'));
            } finally {
                if (mounted) setLoadingDetails(false);
            }
        }

        loadJobDetails();
        return () => {
            mounted = false;
        };
    }, [endpoint, isEditMode, jobListingId]);

    const handleChange = (field) => (event) => {
        const value = field === 'vacancyCount' ? event.target.value.replace(/[^\d]/g, '') : event.target.value;

        setFormData((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: '' }));
    };

    const addListItem = (type) => {
        const value = (type === 'responsibilities' ? responsibilityInput : skillInput).trim();
        const list = type === 'responsibilities' ? responsibilities : requiredSkills;
        const setter = type === 'responsibilities' ? setResponsibilities : setRequiredSkills;
        const inputSetter = type === 'responsibilities' ? setResponsibilityInput : setSkillInput;

        if (!value) {
            setErrors((current) => ({ ...current, [type]: 'Value cannot be empty.' }));
            return;
        }

        if (list.some((item) => item.toLowerCase() === value.toLowerCase())) {
            setErrors((current) => ({ ...current, [type]: 'This value already exists.' }));
            return;
        }

        setter((current) => [...current, value]);
        inputSetter('');
        setErrors((current) => ({ ...current, [type]: '' }));
    };

    const removeListItem = (type, value) => {
        const setter = type === 'responsibilities' ? setResponsibilities : setRequiredSkills;
        setter((current) => current.filter((item) => item !== value));
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!formData.country.trim()) nextErrors.country = 'Country is required.';
        if (!formData.cityRegion.trim()) nextErrors.cityRegion = 'City/region is required.';
        if (!formData.title.trim()) nextErrors.title = 'Job title is required.';
        if (!formData.industry.trim()) nextErrors.industry = 'Industry is required.';
        if (!formData.qualification.trim()) nextErrors.qualification = 'Qualification is required.';
        if (!formData.experience.trim()) nextErrors.experience = 'Experience is required.';
        if (!formData.indicativeSalary.trim()) nextErrors.indicativeSalary = 'Indicative salary is required.';
        if (!formData.employmentType.trim()) nextErrors.employmentType = 'Employment type is required.';
        if (!formData.visaWorkPermit.trim()) nextErrors.visaWorkPermit = 'Visa/work permit is required.';
        if (!formData.description.trim()) nextErrors.description = 'Description is required.';
        if (!formData.vacancyCount || Number(formData.vacancyCount) < 1) nextErrors.vacancyCount = 'Vacancy count must be at least 1.';
        if (!formData.applicationEmail.trim() && !formData.applicationUrl.trim()) {
            nextErrors.applicationEmail = 'Add application email or URL.';
            nextErrors.applicationUrl = 'Add application URL or email.';
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const buildPayload = () => ({
        country: formData.country.trim(),
        cityRegion: formData.cityRegion.trim(),
        title: formData.title.trim(),
        industry: formData.industry.trim(),
        qualification: formData.qualification.trim(),
        experience: formData.experience.trim(),
        indicativeSalary: formData.indicativeSalary.trim(),
        employmentType: formData.employmentType.trim(),
        visaWorkPermit: formData.visaWorkPermit.trim(),
        description: formData.description.trim(),
        responsibilities,
        requiredSkills,
        vacancyCount: Number(formData.vacancyCount),
        applicationEmail: formData.applicationEmail.trim() || null,
        applicationUrl: markdownUrlToPlainUrl(formData.applicationUrl) || null,
        applicationDeadline: toIsoDateTime(formData.applicationDeadline),
        expiresAt: toIsoDateTime(formData.expiresAt),
    });

    const resetForm = () => {
        setFormData(initialFormData);
        setResponsibilities([]);
        setRequiredSkills([]);
        setResponsibilityInput('');
        setSkillInput('');
        setErrors({});
        setApiError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError('');

        if (!validateForm()) {
            await Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields correctly.',
                confirmButtonColor: '#f79f03',
            });
            return;
        }

        setSubmitting(true);
        try {
            const payload = buildPayload();
            const response = isEditMode
                ? await MainApi.patch(`${endpoint}/${jobListingId}`, payload)
                : await MainApi.post(endpoint, payload);

            await Swal.fire({
                icon: 'success',
                title: isEditMode ? (submitLabels?.updatedTitle || 'Job Listing Updated') : (submitLabels?.createdTitle || 'Job Listing Created'),
                text: getApiMessage(response?.data, isEditMode ? 'Job listing updated successfully.' : 'Job listing created successfully.'),
                confirmButtonColor: '#f79f03',
            });

            onSubmit?.(payload);
            if (!isEditMode) resetForm();
        } catch (error) {
            const message = getApiErrorMessage(error, isEditMode ? 'Failed to update job listing.' : 'Failed to create job listing.');
            setApiError(message);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const busy = submitting || loadingDetails;

    return (
        <Box sx={{ bgcolor: '#fff', width: '100%' }}>
            <Paper elevation={0} sx={{ width: '100%', p: 1.75, bgcolor: '#fff', borderRadius: '4px 4px 0 0', borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: 18 }}>
                    {title || (isEditMode ? 'Edit Job Post' : 'Add Job Post')}
                </Typography>
            </Paper>

            <StyledPaper elevation={0}>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
                        {apiError}
                    </Alert>
                )}

                {loadingDetails ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 260 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} sx={{ minHeight: 'calc(100dvh - 240px)', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 2 }}>
                            <SectionHeader title="Job Information" />
                            <Divider />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
                            <TextField fullWidth size="small" label="Country" value={formData.country} onChange={handleChange('country')} error={!!errors.country} helperText={errors.country} disabled={busy} />
                            <TextField fullWidth size="small" label="City / Region" value={formData.cityRegion} onChange={handleChange('cityRegion')} error={!!errors.cityRegion} helperText={errors.cityRegion} disabled={busy} />
                            <TextField fullWidth size="small" label="Job Title" value={formData.title} onChange={handleChange('title')} error={!!errors.title} helperText={errors.title} disabled={busy} />
                            <TextField fullWidth size="small" label="Industry" value={formData.industry} onChange={handleChange('industry')} error={!!errors.industry} helperText={errors.industry} disabled={busy} />
                            <TextField fullWidth size="small" label="Qualification" value={formData.qualification} onChange={handleChange('qualification')} error={!!errors.qualification} helperText={errors.qualification} disabled={busy} />
                            <TextField fullWidth size="small" label="Experience" value={formData.experience} onChange={handleChange('experience')} error={!!errors.experience} helperText={errors.experience} disabled={busy} />
                            <TextField fullWidth size="small" label="Indicative Salary" value={formData.indicativeSalary} onChange={handleChange('indicativeSalary')} error={!!errors.indicativeSalary} helperText={errors.indicativeSalary} disabled={busy} />
                            <TextField fullWidth size="small" label="Employment Type" value={formData.employmentType} onChange={handleChange('employmentType')} error={!!errors.employmentType} helperText={errors.employmentType} disabled={busy} />
                            <TextField fullWidth size="small" label="Visa / Work Permit" value={formData.visaWorkPermit} onChange={handleChange('visaWorkPermit')} error={!!errors.visaWorkPermit} helperText={errors.visaWorkPermit} disabled={busy} />
                            <TextField fullWidth size="small" label="Vacancy Count" value={formData.vacancyCount} onChange={handleChange('vacancyCount')} error={!!errors.vacancyCount} helperText={errors.vacancyCount} disabled={busy} />
                            <TextField fullWidth size="small" type="datetime-local" label="Application Deadline" value={formData.applicationDeadline} onChange={handleChange('applicationDeadline')} disabled={busy} InputLabelProps={{ shrink: true }} />
                            <TextField fullWidth size="small" type="datetime-local" label="Expires At" value={formData.expiresAt} onChange={handleChange('expiresAt')} disabled={busy} InputLabelProps={{ shrink: true }} />
                        </Box>

                        <Box sx={{ mt: 3, mb: 2 }}>
                            <SectionHeader title="Application Details" />
                            <Divider />
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                            <TextField fullWidth size="small" label="Application Email" value={formData.applicationEmail} onChange={handleChange('applicationEmail')} error={!!errors.applicationEmail} helperText={errors.applicationEmail} disabled={busy} />
                            <TextField fullWidth size="small" label="Application URL" value={formData.applicationUrl} onChange={handleChange('applicationUrl')} error={!!errors.applicationUrl} helperText={errors.applicationUrl} disabled={busy} />
                        </Box>

                        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                            <ArrayField
                                label="Responsibilities"
                                placeholder="Develop application features"
                                values={responsibilities}
                                inputValue={responsibilityInput}
                                setInputValue={setResponsibilityInput}
                                onAdd={() => addListItem('responsibilities')}
                                onRemove={(value) => removeListItem('responsibilities', value)}
                                error={errors.responsibilities}
                                disabled={busy}
                            />
                            <ArrayField
                                label="Required Skills"
                                placeholder="JavaScript"
                                values={requiredSkills}
                                inputValue={skillInput}
                                setInputValue={setSkillInput}
                                onAdd={() => addListItem('requiredSkills')}
                                onRemove={(value) => removeListItem('requiredSkills', value)}
                                error={errors.requiredSkills}
                                disabled={busy}
                            />
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <TextField fullWidth multiline minRows={3} size="small" label="Description" value={formData.description} onChange={handleChange('description')} error={!!errors.description} helperText={errors.description} disabled={busy} />
                        </Box>

                        <Stack direction="row" spacing={1.5} justifyContent="flex-end" alignItems="center" flexWrap="wrap" sx={{ mt: 'auto', pt: 3 }}>
                            <Button type="button" variant="outlined" startIcon={<CancelIcon />} onClick={onCancel || resetForm} disabled={busy} sx={{ textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" startIcon={submitting ? <CircularProgress color="inherit" size={16} /> : <SaveIcon />} disabled={busy} sx={{ bgcolor: '#2563eb', textTransform: 'none', '&:hover': { bgcolor: '#1d4ed8' } }}>
                                {isEditMode ? 'Update Job' : 'Create Job'}
                            </Button>
                        </Stack>
                    </Box>
                )}
            </StyledPaper>
        </Box>
    );
}

export default function AddJobPost() {
    const router = useRouter();

    return (
        <JobPostForm
            mode="create"
            onCancel={() => router.push('/agent/job-list')}
            onSubmit={() => router.push('/agent/job-list')}
        />
    );
}
