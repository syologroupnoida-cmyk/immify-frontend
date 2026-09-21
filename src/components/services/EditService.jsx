'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    InputAdornment,
} from '@mui/material';
import {
    Save as SaveIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Category as CategoryIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2.5),
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: '#1e293b',
    fontSize: '16px',
    marginBottom: theme.spacing(2),
}));

const ServiceChip = styled(Chip)(() => ({
    backgroundColor: '#f1f5f9',
    '& .MuiChip-deleteIcon': {
        color: '#64748b',
        '&:hover': {
            color: '#ef4444',
        },
    },
    '&:hover': {
        backgroundColor: '#e2e8f0',
    },
}));

// Constants
const SERVICE_CATEGORIES_ENDPOINT = '/super-admin/service-categories';
const UPDATE_CATEGORY_ENDPOINT = '/super-admin/service-categories';


// Main Component
const EditService = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('id');

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
    });

    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState('');
    const [serviceErrors, setServiceErrors] = useState('');

    // Track deleted services
    const [deletedServiceIds, setDeletedServiceIds] = useState([]);

    // Validation errors
    const [errors, setErrors] = useState({
        categoryName: '',
        description: '',
    });

    // Fetch category details
    const fetchCategoryDetails = useCallback(async () => {
        if (!categoryId) {
            setIsEditMode(false);
            return;
        }

        setLoading(true);
        setFetchError('');
        try {
            const response = await MainApi.get(`${SERVICE_CATEGORIES_ENDPOINT}/${categoryId}`);
            const data = response?.data?.data ?? response?.data ?? {};

            setFormData({
                categoryName: data.name || '',
                description: data.description || '',
            });

            // Set services from the category
            if (data.services && Array.isArray(data.services)) {
                setServices(data.services.map(service => ({
                    id: service.id,
                    name: service.name || service.serviceName || '',
                    description: service.description || '',
                    status: service.status || 'active',
                    isNew: false,
                })));
            } else {
                setServices([]);
            }

            setDeletedServiceIds([]);
            setIsEditMode(true);
        } catch (error) {
            setFetchError(error?.response?.data?.message || error?.message || 'Unable to load category details.');
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        queueMicrotask(fetchCategoryDetails);
    }, [fetchCategoryDetails]);

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle service CRUD operations
    const handleAddService = () => {
        const serviceName = newService.trim();
        if (!serviceName) {
            setServiceErrors('Service name cannot be empty');
            return;
        }

        // Check for duplicate
        if (services.some(s => s.name.toLowerCase() === serviceName.toLowerCase())) {
            setServiceErrors('Service already exists in this category');
            return;
        }

        const newServiceObj = {
            id: `temp_${Date.now()}`,
            name: serviceName,
            description: '',
            isNew: true,
        };

        setServices(prev => [...prev, newServiceObj]);
        setNewService('');
        setServiceErrors('');
    };

    const handleRemoveService = (index) => {
        const service = services[index];
        // If it's an existing service with an ID, track it for deletion
        if (service.id && !service.isNew && !String(service.id).startsWith('temp_')) {
            setDeletedServiceIds(prev => [...prev, service.id]);
        }
        
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
    };

    const handleUpdateService = (index, field, value) => {
        const updatedServices = [...services];
        updatedServices[index][field] = value;
        setServices(updatedServices);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddService();
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.categoryName.trim()) {
            newErrors.categoryName = 'Category name is required';
            isValid = false;
        }

        if (services.length === 0) {
            setServiceErrors('At least one service is required');
            isValid = false;
        } else {
            setServiceErrors('');
        }

        setErrors(newErrors);
        return isValid;
    };

    // Prepare payload for PATCH
    const preparePatchPayload = () => {
        const payload = {
            name: formData.categoryName.trim(),
            description: formData.description.trim(),
        };

        // Prepare services data
        const servicesPayload = services.map(service => {
            const serviceData = {
                name: service.name,
                description: service.description || '',
            };

            // If it's an existing service (has numeric ID), include the ID
            if (service.id && !String(service.id).startsWith('temp_') && !service.isNew) {
                serviceData.id = service.id;
            }

            return serviceData;
        });

        // Add services and deleted service IDs to payload
        if (servicesPayload.length > 0) {
            payload.services = servicesPayload;
        }

        if (deletedServiceIds.length > 0) {
            payload.deletedServiceIds = deletedServiceIds;
        }

        return payload;
    };

    // Handle submit with PATCH
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSaving(true);
        try {
            const payload = preparePatchPayload();
            let response;
            let successMessage = '';

            if (isEditMode && categoryId) {
                // Update existing category using PATCH
                response = await MainApi.patch(`${UPDATE_CATEGORY_ENDPOINT}/${categoryId}`, payload);
                successMessage = 'Category updated successfully!';
            } else {
                // Create new category using POST
                response = await MainApi.post(SERVICE_CATEGORIES_ENDPOINT, payload);
                successMessage = 'Category created successfully!';
            }

            await Swal.fire({
                icon: 'success',
                title: isEditMode ? 'Updated!' : 'Created!',
                text: successMessage,
                confirmButtonColor: '#f79f03',
            });

        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to save category.';
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMsg,
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.push('/services');
    };

    // Render loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading category details...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', p: 0 }}>
            <StyledPaper>
                {/* Header */}
                <Box sx={{ pb: 1.25, mb: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                        {isEditMode ? 'Edit Service Category' : 'Create Service Category'}
                    </Typography>
                </Box>

                {fetchError && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFetchError('')}>
                        {fetchError}
                    </Alert>
                )}

                {/* Category Information Section */}
                <Box sx={{ mb: 3 }}>
                    <SectionHeader>Category Information</SectionHeader>
                    <Divider sx={{ mb: 2 }} />

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                            gap: 2.5,
                            width: '100%',
                        }}
                    >
                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                label="Category Name"
                                value={formData.categoryName}
                                onChange={(e) => handleChange('categoryName', e.target.value)}
                                error={!!errors.categoryName}
                                helperText={errors.categoryName || `${formData.categoryName.length}/50 characters`}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CategoryIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <Box>
                            <TextField
                                fullWidth
                                size="small"
                                label="Description"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Brief description of the service category"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EditIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                {/* Services Section */}
                <Box>
                    <SectionHeader>Services</SectionHeader>
                    <Divider sx={{ mb: 3 }} />

                    {/* Add Service Input */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto' }, gap: 1, mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Enter service name"
                            value={newService}
                            onChange={(e) => {
                                setNewService(e.target.value);
                                setServiceErrors('');
                            }}
                            onKeyPress={handleKeyPress}
                            error={!!serviceErrors}
                            helperText={serviceErrors}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AddIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddService}
                            sx={{
                                bgcolor: '#f79f03',
                                '&:hover': { bgcolor: '#e08a02' },
                                textTransform: 'none',
                                whiteSpace: 'nowrap',
                                minWidth: '120px',
                            }}
                            startIcon={<AddIcon />}
                        >
                            Add Service
                        </Button>
                    </Box>

                    {services.length > 0 ? (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {services.map((service, index) => (
                                <ServiceChip
                                    key={service.id || index}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                            <span>{service.name}</span>
                                            {service.isNew ? (
                                                <Chip
                                                    label="New"
                                                    size="small"
                                                    sx={{ height: 18, fontSize: '10px', bgcolor: '#fef3c7', color: '#92400e' }}
                                                />
                                            ) : (
                                                <Chip
                                                    label="Existing"
                                                    size="small"
                                                    sx={{ height: 18, fontSize: '10px', bgcolor: '#dbeafe', color: '#1e40af' }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    onDelete={() => handleRemoveService(index)}
                                    deleteIcon={<CloseIcon />}
                                    sx={{ py: 0.5 }}
                                />
                            ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                border: '1px dashed #cbd5e1',
                                borderRadius: '8px',
                                p: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="body2" color="textSecondary">
                                No services added yet. Type a service name and click Add Service.
                            </Typography>
                        </Box>
                    )}

                    {services.length > 0 && (
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                            {services.length} service(s) added
                            {deletedServiceIds.length > 0 && ` (${deletedServiceIds.length} marked for deletion)`}
                        </Typography>
                    )}
                </Box>

                {/* Bottom Actions */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={saving}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        sx={{
                            bgcolor: '#f79f03',
                            '&:hover': { bgcolor: '#e08a02' },
                            textTransform: 'none',
                        }}
                    >
                        {saving ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                    </Button>
                </Box>
            </StyledPaper>
        </Box>
    );
};

export default EditService;
