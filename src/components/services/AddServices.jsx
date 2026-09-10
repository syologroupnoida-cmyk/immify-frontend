'use client';

import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Divider,
    Stack,
    CircularProgress,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    width: '100%',
    borderRadius: '4px',
    boxShadow: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
}));

const SectionHeader = ({ title }) => {
    return (
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b', mb: 2 }}>
            {title}
        </Typography>
    );
};

const createServiceCategoryApi = (payload) => MainApi.post('/super-admin/service-categories', payload);

// Main Component
const AddServices = ({
    onSubmit,
    onCancel,
    initialData = { name: '', description: '', services: [] },
    isLoading = false,
    error = null,
}) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        description: initialData.description || '',
        services: initialData.services?.map((service) => typeof service === 'string' ? service : service.name).filter(Boolean) || [],
    });

    const [newService, setNewService] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        description: '',
        services: '',
    });

    const [touched, setTouched] = useState({
        name: false,
        description: false,
        services: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return 'Category name is required';
                }
                if (value.trim().length < 3) {
                    return 'Category name must be at least 3 characters';
                }
                if (value.trim().length > 80) {
                    return 'Category name must be less than 80 characters';
                }
                return '';

            case 'description':
                if (value.trim().length > 500) {
                    return 'Description must be less than 500 characters';
                }
                return '';

            case 'services':
                if (value.length === 0) {
                    return 'At least one service is required';
                }
                return '';

            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    const handleAddService = () => {
        const serviceName = newService.trim();
        if (!serviceName) {
            setErrors(prev => ({
                ...prev,
                services: 'Service name cannot be empty'
            }));
            return;
        }

        if (formData.services.includes(serviceName)) {
            setErrors(prev => ({
                ...prev,
                services: 'Service already exists'
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            services: [...prev.services, serviceName]
        }));
        setNewService('');
        setErrors(prev => ({
            ...prev,
            services: ''
        }));
        setTouched(prev => ({
            ...prev,
            services: true
        }));
    };

    const handleRemoveService = (serviceToRemove) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter(service => service !== serviceToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddService();
        }
    };

    const handleClear = () => {
        Swal.fire({
            title: 'Clear All?',
            text: 'This will remove all entered data. Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Clear All',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({
                    name: '',
                    description: '',
                    services: [],
                });
                setNewService('');
                setErrors({
                    name: '',
                    description: '',
                    services: '',
                });
                setTouched({
                    name: false,
                    description: false,
                    services: false,
                });
                setApiError(null);

                Swal.fire({
                    icon: 'info',
                    title: 'Form Cleared',
                    text: 'All data has been cleared',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);

        // Validate all fields
        const newErrors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description),
            services: validateField('services', formData.services),
        };

        setErrors(newErrors);
        setTouched({
            name: true,
            description: true,
            services: true,
        });

        const hasErrors = Object.values(newErrors).some((error) => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);

            try {
                // Prepare payload
                const payload = {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    services: formData.services.map((name) => ({ name })),
                };

                // Call actual API
                const response = await createServiceCategoryApi(payload);
                const successMessage = response?.data?.message || 'Services created successfully.';

                // Show success SweetAlert with OK button
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: successMessage,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f79f03',
                });

                // Call onSubmit callback if provided
                if (onSubmit) {
                    onSubmit(payload);
                }

                // Clear form after successful submission
                setFormData({
                    name: '',
                    description: '',
                    services: [],
                });
                setNewService('');
                setErrors({
                    name: '',
                    description: '',
                    services: '',
                });
                setTouched({
                    name: false,
                    description: false,
                    services: false,
                });
                setApiError(null);

            } catch (err) {
                setApiError(err.message);

                // Show error SweetAlert with OK button
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to create services. Please try again.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f79f03',
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Show validation errors with OK button
            await Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill in all required fields correctly.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f79f03',
            });
        }
    };

    return (
        <Box sx={{ bgcolor: '#fff', width: '100%' }}>
            <Box sx={{ width: '100%', mx: 0, px: 0 }}>
                {/* Header */}
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        p: 1.75,
                        mb: 0,
                        bgcolor: '#fff',
                        borderRadius: '4px 4px 0 0',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', fontSize: 18 }}>
                        Add Services
                    </Typography>
                </Paper>

                {/* Form Body */}
                <StyledPaper elevation={0} sx={{ borderRadius: '4px', bgcolor: '#fff' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Service Information Section */}
                        <Box sx={{ mb: 2 }}>
                            <SectionHeader title="Service Information" />
                            <Divider />
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                                columnGap: 3,
                                rowGap: 2.5,
                                width: '100%',
                            }}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    label="Category Name"
                                    name="name"
                                    placeholder="e.g., Immigration Services"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.name && touched.name}
                                    helperText={
                                        touched.name && errors.name
                                            ? errors.name
                                            : `${formData.name.length}/80 characters`
                                    }
                                />
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    label="Description"
                                    name="description"
                                    placeholder="e.g., PR, Express Entry, Citizenship, Residency"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.description && touched.description}
                                    helperText={
                                        touched.description && errors.description
                                            ? errors.description
                                            : `${formData.description.length}/500 characters (optional)`
                                    }
                                />
                            </Box>

                            {/* Services Section */}
                            <Box sx={{ minWidth: 0, gridColumn: { xs: '1', md: '1 / -1' } }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter service name"
                                            value={newService}
                                            onChange={(e) => setNewService(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <IconButton
                                            onClick={handleAddService}
                                            sx={{
                                                bgcolor: '#f79f03',
                                                color: '#fff',
                                                '&:hover': {
                                                    bgcolor: '#e08a02',
                                                },
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '4px',
                                                flexShrink: 0,
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    </Box>

                                    {errors.services && touched.services && (
                                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                            {errors.services}
                                        </Typography>
                                    )}

                                    {/* Services Chips */}
                                    {formData.services.length > 0 && (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {formData.services.map((service, index) => (
                                                <Chip
                                                    key={index}
                                                    label={service}
                                                    onDelete={() => handleRemoveService(service)}
                                                    deleteIcon={<CloseIcon />}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#f1f5f9',
                                                        '& .MuiChip-deleteIcon': {
                                                            color: '#64748b',
                                                            '&:hover': {
                                                                color: '#ef4444',
                                                            },
                                                        },
                                                        '&:hover': {
                                                            bgcolor: '#e2e8f0',
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}

                                    {formData.services.length === 0 && (
                                        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                                            No services added yet.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {(error || apiError) && (
                            <Box sx={{ mt: 2 }}>
                                <Typography color="error" variant="body2">
                                    {error || apiError}
                                </Typography>
                            </Box>
                        )}

                        {/* Submit Buttons */}
                        <Box sx={{ mt: 3 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{ width: 'fit-content', ml: 'auto' }}
                            >
                                <Button
                                    type="button"
                                    variant="outlined"
                                    size="medium"
                                    onClick={onCancel || handleClear}
                                    startIcon={onCancel ? <CancelIcon /> : <ClearIcon />}
                                    disabled={isSubmitting || isLoading}
                                    sx={{ textTransform: 'none' }}
                                >
                                    {onCancel ? 'Cancel' : 'Clear'}
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="medium"
                                    disabled={isSubmitting || isLoading}
                                    startIcon={
                                        isSubmitting || isLoading ? (
                                            <CircularProgress size={16} color="inherit" />
                                        ) : (
                                            <SaveIcon />
                                        )
                                    }
                                    sx={{
                                        bgcolor: '#f79f03',
                                        '&:hover': { bgcolor: '#e08a02' },
                                        textTransform: 'none',
                                    }}
                                >
                                    {isSubmitting || isLoading ? 'Creating...' : 'Create Services'}
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </StyledPaper>
            </Box>
        </Box>
    );
};

export default AddServices;
