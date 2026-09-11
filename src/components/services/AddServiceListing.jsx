'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Divider,
    FormControlLabel,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Cancel as CancelIcon,
    Clear as ClearIcon,
    Close as CloseIcon,
    CloudUpload as CloudUploadIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const SERVICE_CATEGORIES_ENDPOINT = '/service-categories';
const SERVICE_LISTINGS_ENDPOINT = '/vendor/service-listings';
const IMAGE_UPLOAD_ENDPOINT = '/uploads/image';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    width: '100%',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
}));

const UploadBox = styled(Paper)(({ theme }) => ({
    minHeight: 120,
    border: `1px dashed ${theme.palette.divider}`,
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
}));

const initialFormData = {
    categoryId: '',
    serviceId: '',
    title: '',
    description: '',
    priceInPaise: '',
    currency: 'INR',
    chargesIncludeGst: true,
    imageUrl: '',
    overview: '',
    process: '',
    pricingDetails: '',
    termsAndConditions: '',
    country: '',
};

const getFirstArray = (...values) => values.find((value) => Array.isArray(value) && value.length > 0) || [];

function getApiErrorMessage(error, fallback) {
    return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

function getApiMessage(payload, fallback) {
    return payload?.message || payload?.msg || payload?.data?.message || fallback;
}

function getCategoryId(category) {
    return String(category?.serviceCategoryId || category?.categoryId || category?.id || category?._id || category?.uuid || '');
}

function getCategoryName(category) {
    return category?.name || category?.categoryName || category?.serviceCategoryName || category?.title || 'Unnamed Category';
}

function getServiceId(service) {
    if (typeof service === 'string') return '';
    return String(service?.serviceId || service?.id || service?._id || service?.uuid || '');
}

function getServiceName(service) {
    if (typeof service === 'string') return service;
    return service?.name || service?.serviceName || service?.title || 'Unnamed Service';
}

function dedupeByIdOrName(items) {
    const seen = new Set();

    return items.filter((item) => {
        const key = item.id ? `id:${item.id}` : `name:${item.name.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

function normalizeServices(payload = {}) {
    const data = payload?.data ?? payload ?? {};
    const nestedData = data?.data ?? data ?? {};
    const services = getFirstArray(
        data?.services,
        data?.service,
        data?.serviceList,
        data?.serviceItems,
        data?.service_items,
        data?.children,
        data?.data?.services,
        data?.data?.service,
        data?.data?.serviceList,
        data?.data?.serviceItems,
        nestedData?.services,
        nestedData?.service,
        nestedData?.serviceList,
        nestedData?.serviceItems,
        Array.isArray(data) ? data : [],
        Array.isArray(nestedData) ? nestedData : []
    );

    return dedupeByIdOrName(services.map((service) => ({
        id: getServiceId(service),
        name: getServiceName(service),
        raw: service,
    })).filter((service) => service.id && service.name));
}

function normalizeCategories(payload = {}) {
    const data = payload?.data ?? payload ?? {};
    const categories = getFirstArray(
        data,
        data?.content,
        data?.items,
        data?.results,
        data?.categories,
        data?.serviceCategories,
        data?.rows,
        data?.list,
        data?.data,
        data?.data?.content,
        data?.data?.items,
        data?.data?.results,
        data?.data?.categories,
        data?.data?.serviceCategories
    );

    return dedupeByIdOrName(categories.map((category) => ({
        id: getCategoryId(category),
        name: getCategoryName(category),
        services: normalizeServices(category),
        raw: category,
    })).filter((category) => category.id && category.name));
}

function getUploadedImageUrl(responseData) {
    const data = responseData?.data ?? responseData ?? {};
    return (
        data?.url ||
        data?.imageUrl ||
        data?.image_url ||
        data?.secure_url ||
        data?.fileUrl ||
        data?.file_url ||
        data?.file?.url ||
        data?.image?.url ||
        data?.result?.url ||
        data?.location ||
        data?.path ||
        data?.data?.url ||
        data?.data?.imageUrl ||
        data?.data?.image_url ||
        data?.data?.secure_url ||
        data?.data?.fileUrl ||
        data?.data?.file_url ||
        data?.data?.file?.url ||
        data?.data?.image?.url ||
        data?.data?.result?.url ||
        data?.data?.location ||
        data?.data?.path ||
        ''
    );
}

async function uploadServiceListingImage(file) {
    if (!file) return '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'service-listing');

    const response = await MainApi.post(IMAGE_UPLOAD_ENDPOINT, formData);
    const imageUrl = getUploadedImageUrl(response?.data);

    if (!imageUrl) {
        throw new Error('Image upload succeeded but no image URL was returned.');
    }

    return imageUrl;
}

function SectionHeader({ title }) {
    return (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            {title}
        </Typography>
    );
}

export default function AddServiceListing({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState(initialFormData);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [includeInput, setIncludeInput] = useState('');
    const [includes, setIncludes] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [serviceLoading, setServiceLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitMode, setSubmitMode] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            setCategoryLoading(true);
            setApiError('');

            try {
                const response = await MainApi.get(SERVICE_CATEGORIES_ENDPOINT, {
                    skipAuth: true,
                    suppressAuthRedirect: true,
                });
                const normalizedCategories = normalizeCategories(response?.data);

                if (isMounted) setCategories(normalizedCategories);
            } catch (error) {
                if (isMounted) {
                    setCategories([]);
                    setApiError(getApiErrorMessage(error, 'Unable to load service categories.'));
                }
            } finally {
                if (isMounted) setCategoryLoading(false);
            }
        }

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchCategoryServices = async (categoryId) => {
        if (!categoryId) {
            setServices([]);
            return;
        }

        const category = categories.find((item) => item.id === categoryId);
        const fallbackServices = category?.services || [];

        setServiceLoading(true);
        try {
            const response = await MainApi.get(`${SERVICE_CATEGORIES_ENDPOINT}/${categoryId}`, {
                skipAuth: true,
                suppressAuthRedirect: true,
            });
            const normalizedCategories = normalizeCategories(response?.data);
            const detailCategory = normalizedCategories[0] || null;
            const responseServices = normalizeServices(response?.data);
            const resolvedServices = detailCategory?.services?.length > 0
                ? detailCategory.services
                : responseServices.length > 0
                    ? responseServices
                    : fallbackServices;

            setServices(resolvedServices);
        } catch (error) {
            setServices(fallbackServices);
            setApiError(getApiErrorMessage(error, 'Unable to load services for this category.'));
        } finally {
            setServiceLoading(false);
        }
    };

    const handleChange = (field) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        setFormData((current) => ({
            ...current,
            [field]: value,
            ...(field === 'categoryId' ? { serviceId: '' } : {}),
        }));
        setErrors((current) => ({ ...current, [field]: '' }));

        if (field === 'categoryId') {
            fetchCategoryServices(value);
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors((current) => ({ ...current, imageUrl: 'Please upload a valid image file.' }));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors((current) => ({ ...current, imageUrl: 'Image size should be less than 5MB.' }));
            return;
        }

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormData((current) => ({ ...current, imageUrl: '' }));
        setErrors((current) => ({ ...current, imageUrl: '' }));
        setImageUploading(true);

        try {
            const imageUrl = await uploadServiceListingImage(file);
            setFormData((current) => ({ ...current, imageUrl }));
        } catch (error) {
            const message = getApiErrorMessage(error, 'Unable to upload service listing image.');
            setFormData((current) => ({ ...current, imageUrl: '' }));
            setErrors((current) => ({ ...current, imageUrl: message }));
            await Swal.fire({
                icon: 'error',
                title: 'Image Upload Failed',
                text: message,
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setImageUploading(false);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData((current) => ({ ...current, imageUrl: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addInclude = () => {
        const value = includeInput.trim();
        if (!value) {
            setErrors((current) => ({ ...current, includes: 'Include item cannot be empty.' }));
            return;
        }

        if (includes.some((item) => item.toLowerCase() === value.toLowerCase())) {
            setErrors((current) => ({ ...current, includes: 'This include item already exists.' }));
            return;
        }

        setIncludes((current) => [...current, value]);
        setIncludeInput('');
        setErrors((current) => ({ ...current, includes: '' }));
    };

    const removeInclude = (value) => {
        setIncludes((current) => current.filter((item) => item !== value));
    };

    const validateForm = (isDraft = false) => {
        const nextErrors = {};

        if (!formData.categoryId) nextErrors.categoryId = 'Select service category.';
        if (!formData.serviceId) nextErrors.serviceId = 'Select service.';
        if (!formData.title.trim()) nextErrors.title = 'Title is required.';
        if (isDraft) {
            setErrors(nextErrors);
            return Object.keys(nextErrors).length === 0;
        }

        if (!formData.description.trim()) nextErrors.description = 'Description is required.';
        if (!includes.length) nextErrors.includes = 'Add at least one include item.';
        if (!formData.priceInPaise || Number(formData.priceInPaise) < 1) nextErrors.priceInPaise = 'Enter price in paise.';
        if (!formData.currency.trim()) nextErrors.currency = 'Currency is required.';
        if (!imageFile && !formData.imageUrl) nextErrors.imageUrl = 'Service listing image is required.';
        if (!formData.overview.trim()) nextErrors.overview = 'Overview is required.';
        if (!formData.process.trim()) nextErrors.process = 'Process is required.';
        if (!formData.pricingDetails.trim()) nextErrors.pricingDetails = 'Pricing details are required.';
        if (!formData.termsAndConditions.trim()) nextErrors.termsAndConditions = 'Terms and conditions are required.';
        if (!formData.country.trim()) nextErrors.country = 'Country is required.';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setServices([]);
        setIncludeInput('');
        setIncludes([]);
        setImageFile(null);
        setImagePreview('');
        setImageUploading(false);
        setErrors({});
        setApiError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const buildPayload = async (isDraft = false) => {
        const imageUrl = formData.imageUrl || (imageFile ? await uploadServiceListingImage(imageFile) : '');

        return {
            categoryId: formData.categoryId,
            serviceId: formData.serviceId,
            title: formData.title.trim(),
            description: formData.description.trim(),
            includes,
            priceInPaise: formData.priceInPaise ? Number(formData.priceInPaise) : 0,
            currency: formData.currency.trim().toUpperCase(),
            chargesIncludeGst: Boolean(formData.chargesIncludeGst),
            imageUrl,
            overview: formData.overview.trim(),
            process: formData.process.trim(),
            pricingDetails: formData.pricingDetails.trim(),
            termsAndConditions: formData.termsAndConditions.trim(),
            dynamicData: {
                country: formData.country.trim(),
            },
            isDraft,
        };
    };

    const submitServiceListing = async (isDraft = false) => {
        setApiError('');

        if (!validateForm(isDraft)) {
            await Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: isDraft ? 'Please select category, service, and title before saving as draft.' : 'Please fill in all required fields correctly.',
                confirmButtonColor: '#f79f03',
            });
            return;
        }

        setSubmitting(true);
        setSubmitMode(isDraft ? 'draft' : 'create');
        try {
            const payload = await buildPayload(isDraft);
            const response = await MainApi.post(SERVICE_LISTINGS_ENDPOINT, payload, {
                params: { draft: isDraft ? 'true' : 'false' },
            });

            await Swal.fire({
                icon: 'success',
                title: isDraft ? 'Draft Saved' : 'Service Listing Created',
                text: getApiMessage(response?.data, isDraft ? 'Service listing draft saved successfully.' : 'Service listing created successfully.'),
                confirmButtonColor: '#f79f03',
            });

            onSubmit?.(payload);
            resetForm();
        } catch (error) {
            const message = getApiErrorMessage(error, 'Failed to create service listing.');
            setApiError(message);
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setSubmitting(false);
            setSubmitMode('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await submitServiceListing(false);
    };

    const handleSaveDraft = async () => {
        await submitServiceListing(true);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
            return;
        }
        resetForm();
    };

    return (
        <Box sx={{ bgcolor: '#fff', width: '100%' }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    p: 1.75,
                    bgcolor: '#fff',
                    borderRadius: '4px 4px 0 0',
                    borderBottom: '1px solid #e2e8f0',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: 18 }}>
                    Add Service Listing
                </Typography>
            </Paper>

            <StyledPaper elevation={0}>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError('')}>
                        {apiError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                        <SectionHeader title="Service Listing Information" />
                        <Divider />
                    </Box>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                            gap: 2.5,
                        }}
                    >
                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Service Category"
                            value={formData.categoryId}
                            onChange={handleChange('categoryId')}
                            disabled={categoryLoading || submitting}
                            error={!!errors.categoryId}
                            helperText={errors.categoryId || (categoryLoading ? 'Loading categories...' : '')}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            size="small"
                            label="Service"
                            value={formData.serviceId}
                            onChange={handleChange('serviceId')}
                            disabled={!formData.categoryId || serviceLoading || submitting}
                            error={!!errors.serviceId}
                            helperText={errors.serviceId || (serviceLoading ? 'Loading services...' : '')}
                        >
                            {services.map((service) => (
                                <MenuItem key={service.id} value={service.id}>
                                    {service.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            size="small"
                            label="Title"
                            placeholder="Canada Express Entry"
                            value={formData.title}
                            onChange={handleChange('title')}
                            disabled={submitting}
                            error={!!errors.title}
                            helperText={errors.title}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Description"
                            placeholder="Complete immigration assistance"
                            value={formData.description}
                            onChange={handleChange('description')}
                            disabled={submitting}
                            error={!!errors.description}
                            helperText={errors.description}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Price In Paise"
                            placeholder="2500000"
                            value={formData.priceInPaise}
                            onChange={(event) => {
                                const value = event.target.value.replace(/\D/g, '');
                                setFormData((current) => ({ ...current, priceInPaise: value }));
                                setErrors((current) => ({ ...current, priceInPaise: '' }));
                            }}
                            disabled={submitting}
                            error={!!errors.priceInPaise}
                            helperText={errors.priceInPaise}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Currency"
                            value={formData.currency}
                            onChange={handleChange('currency')}
                            disabled={submitting}
                            error={!!errors.currency}
                            helperText={errors.currency}
                        />

                        <TextField
                            fullWidth
                            size="small"
                            label="Country"
                            placeholder="Canada"
                            value={formData.country}
                            onChange={handleChange('country')}
                            disabled={submitting}
                            error={!!errors.country}
                            helperText={errors.country}
                        />

                        <FormControlLabel
                            control={(
                                <Checkbox
                                    checked={formData.chargesIncludeGst}
                                    onChange={handleChange('chargesIncludeGst')}
                                    disabled={submitting}
                                />
                            )}
                            label="Charges Include GST"
                            sx={{ alignSelf: 'center' }}
                        />
                    </Box>

                    <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 0.9fr) minmax(0, 1.1fr)' }, gap: 2.5, alignItems: 'start' }}>
                        <Box>
                            <SectionHeader title="Service Image" />
                            <Divider sx={{ mb: 2 }} />

                            <UploadBox elevation={0}>
                                {imagePreview || formData.imageUrl ? (
                                    <Box sx={{ position: 'relative', width: '100%', height: 140 }}>
                                        <Box
                                            component="img"
                                            src={imagePreview || formData.imageUrl}
                                            alt="Service listing preview"
                                            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                        {imageUploading && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    bgcolor: 'rgba(15,23,42,0.52)',
                                                    color: '#fff',
                                                }}
                                            >
                                                <CircularProgress size={24} color="inherit" />
                                            </Box>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={removeImage}
                                            disabled={submitting || imageUploading}
                                            sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(15,23,42,0.72)', color: '#fff', '&:hover': { bgcolor: 'rgba(15,23,42,0.9)' } }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUploadIcon />}
                                        disabled={submitting || imageUploading}
                                        sx={{ textTransform: 'none', borderColor: '#cbd5e1', color: '#1f2a77', whiteSpace: 'nowrap' }}
                                    >
                                        Upload Service Listing Image
                                        <input
                                            hidden
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                )}
                            </UploadBox>
                            {errors.imageUrl && (
                                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.75 }}>
                                    {errors.imageUrl}
                                </Typography>
                            )}
                        </Box>

                        <Box>
                            <SectionHeader title="Includes" />
                            <Divider sx={{ mb: 2 }} />

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Include Item"
                                    placeholder="Profile assessment"
                                    value={includeInput}
                                    onChange={(event) => {
                                        setIncludeInput(event.target.value);
                                        setErrors((current) => ({ ...current, includes: '' }));
                                    }}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            addInclude();
                                        }
                                    }}
                                    disabled={submitting}
                                    error={!!errors.includes}
                                    helperText={errors.includes}
                                />
                                <Button
                                    type="button"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={addInclude}
                                    disabled={submitting}
                                    sx={{ minWidth: 142, whiteSpace: 'nowrap', bgcolor: '#f79f03', '&:hover': { bgcolor: '#e08a02' }, textTransform: 'none' }}
                                >
                                    Add Include
                                </Button>
                            </Stack>

                            {includes.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                                    {includes.map((item) => (
                                        <Chip
                                            key={item}
                                            label={item}
                                            onDelete={() => removeInclude(item)}
                                            deleteIcon={<CloseIcon />}
                                            size="small"
                                            sx={{ bgcolor: '#f1f5f9' }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                        <SectionHeader title="Details" />
                        <Divider sx={{ mb: 2, width: '100%' }} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2.5 }}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Overview"
                                placeholder="Complete details about the service"
                                value={formData.overview}
                                onChange={handleChange('overview')}
                                disabled={submitting}
                                error={!!errors.overview}
                                helperText={errors.overview}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Process"
                                placeholder="Assessment, documentation, submission and follow-up"
                                value={formData.process}
                                onChange={handleChange('process')}
                                disabled={submitting}
                                error={!!errors.process}
                                helperText={errors.process}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Pricing Details"
                                placeholder="Starting price; additional government fees may apply"
                                value={formData.pricingDetails}
                                onChange={handleChange('pricingDetails')}
                                disabled={submitting}
                                error={!!errors.pricingDetails}
                                helperText={errors.pricingDetails}
                            />
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                size="small"
                                label="Terms And Conditions"
                                placeholder="Cancellation and refund policy"
                                value={formData.termsAndConditions}
                                onChange={handleChange('termsAndConditions')}
                                disabled={submitting}
                                error={!!errors.termsAndConditions}
                                helperText={errors.termsAndConditions}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{ alignSelf: 'flex-end' }}
                        >
                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={onCancel ? <CancelIcon /> : <ClearIcon />}
                                onClick={handleCancel}
                                disabled={submitting}
                                sx={{ textTransform: 'none' }}
                            >
                                {onCancel ? 'Cancel' : 'Clear'}
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                disabled={submitting || categoryLoading || serviceLoading || imageUploading}
                                startIcon={submitting && submitMode === 'draft' ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                onClick={handleSaveDraft}
                                sx={{ textTransform: 'none', borderColor: '#f79f03', color: '#b36b00', '&:hover': { borderColor: '#e08a02', bgcolor: '#fff7ed' } }}
                            >
                                {submitting && submitMode === 'draft' ? 'Saving Draft...' : 'Save Draft'}
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={submitting || categoryLoading || serviceLoading || imageUploading}
                                startIcon={submitting && submitMode === 'create' ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                sx={{ bgcolor: '#f79f03', '&:hover': { bgcolor: '#e08a02' }, textTransform: 'none' }}
                            >
                                {submitting && submitMode === 'create' ? 'Creating...' : 'Create Service Listing'}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </StyledPaper>
        </Box>
    );
}
