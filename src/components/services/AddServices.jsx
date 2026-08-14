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
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Save as SaveIcon,
    Clear as ClearIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Build as BuildIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2';

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

const fieldIconSx = { fontSize: 18, color: '#94a3b8' };

// API function
const addServicesApi = async (payload) => {
    try {
        const response = await fetch('/api/v1/add-services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let errorMessage = 'Failed to add services';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                errorMessage = response.statusText || `Server error (${response.status})`;
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error. Please check your connection.');
        }
        throw error;
    }
};

// Main Component
const AddServices = ({
    onSubmit,
    onCancel,
    initialData = { category: '', services: [] },
    isLoading = false,
    error = null,
}) => {
    const [formData, setFormData] = useState({
        category: initialData.category || '',
        services: initialData.services || [],
    });

    const [newService, setNewService] = useState('');
    const [errors, setErrors] = useState({
        category: '',
        services: '',
    });

    const [touched, setTouched] = useState({
        category: false,
        services: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock category data - replace with actual API call
    const categories = [
        { id: 1, name: 'Web Development' },
        { id: 2, name: 'Mobile Development' },
        { id: 3, name: 'IT Services' },
        { id: 4, name: 'Design Services' },
        { id: 5, name: 'Digital Marketing' },
        { id: 6, name: 'Cloud Services' },
    ];

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'category':
                if (!value) {
                    return 'Category is required';
                }
                return '';

            case 'services':
                if (formData.services.length === 0) {
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
                    category: '',
                    services: [],
                });
                setNewService('');
                setErrors({
                    category: '',
                    services: '',
                });
                setTouched({
                    category: false,
                    services: false,
                });

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

        // Validate all fields
        const newErrors = {
            category: validateField('category', formData.category),
            services: validateField('services', formData.services),
        };

        setErrors(newErrors);
        setTouched({
            category: true,
            services: true,
        });

        const hasErrors = Object.values(newErrors).some((error) => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);

            try {
                // Prepare payload
                const payload = {
                    category: formData.category,
                    services: formData.services.map(name => ({ name })),
                };

                // Call actual API
                const response = await addServicesApi(payload);

                // Show success SweetAlert with OK button
                await Swal.fire({
                    icon: 'success',
                    title: 'Services Created Successfully!',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Category:</strong> ${formData.category}</p>
                            <p><strong>Services Added (${formData.services.length}):</strong></p>
                            <ul style="text-align: left; margin: 10px 0;">
                                ${formData.services.map(s => `<li>${s}</li>`).join('')}
                            </ul>
                        </div>
                    `,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f79f03',
                });

                // Call onSubmit callback if provided
                if (onSubmit) {
                    onSubmit(payload);
                }

                // Clear form after successful submission
                setFormData({
                    category: '',
                    services: [],
                });
                setNewService('');
                setErrors({
                    category: '',
                    services: '',
                });
                setTouched({
                    category: false,
                    services: false,
                });

            } catch (err) {
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

                        {/* Two columns layout with equal width */}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                                columnGap: 3,
                                rowGap: 2.5,
                                width: '100%',
                            }}
                        >
                            {/* Category Dropdown */}
                            <Box sx={{ minWidth: 0 }}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    error={!!errors.category && touched.category}
                                >
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Category"
                                    >
                                        <MenuItem value="">
                                            <em>Select a category</em>
                                        </MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.name}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.category && errors.category && (
                                        <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
                                            {errors.category}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Services Section */}
                            <Box sx={{ minWidth: 0 }}>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Enter service name"
                                            value={newService}
                                            onChange={(e) => setNewService(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <BuildIcon sx={fieldIconSx} />
                                                    </InputAdornment>
                                                ),
                                            }}
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