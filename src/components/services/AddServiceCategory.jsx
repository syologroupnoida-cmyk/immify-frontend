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
} from '@mui/material';
import {
    Category as CategoryIcon,
    Description as DescriptionIcon,
    Save as SaveIcon,
    Clear as ClearIcon,
    Cancel as CancelIcon,
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

const SectionHeader = ({ icon, title }) => {
    const orange = '#f79f03';
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            {React.cloneElement(icon, { sx: { color: orange, fontSize: 20 } })}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                {title}
            </Typography>
        </Box>
    );
};

const fieldIconSx = { fontSize: 18, color: '#94a3b8' };

// Real API function
const createCategoryApi = async (payload) => {
    const response = await fetch('/api/v1/add-category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        let errorMessage = 'Failed to create category';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
    }

    return await response.json();
};

// Main Component
const CreateServiceCategory = ({
    onSubmit,
    onCancel,
    initialData = { categoryName: '', description: '' },
    isLoading = false,
    error = null,
}) => {
    const [formData, setFormData] = useState({
        categoryName: initialData.categoryName || '',
        description: initialData.description || '',
    });

    const [errors, setErrors] = useState({
        categoryName: '',
        description: '',
    });

    const [touched, setTouched] = useState({
        categoryName: false,
        description: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'categoryName':
                if (!value.trim()) {
                    return 'Category name is required';
                }
                if (value.trim().length < 3) {
                    return 'Category name must be at least 3 characters';
                }
                if (value.trim().length > 50) {
                    return 'Category name must be less than 50 characters';
                }
                if (!/^[a-zA-Z0-9\s\-&]+$/.test(value.trim())) {
                    return 'Category name contains invalid characters';
                }
                return '';

            case 'description':
                if (value && value.length > 500) {
                    return 'Description must be less than 500 characters';
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
                    categoryName: '',
                    description: '',
                });
                setErrors({
                    categoryName: '',
                    description: '',
                });
                setTouched({
                    categoryName: false,
                    description: false,
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

        const newErrors = {
            categoryName: validateField('categoryName', formData.categoryName),
            description: validateField('description', formData.description),
        };

        setErrors(newErrors);
        setTouched({
            categoryName: true,
            description: true,
        });

        const hasErrors = Object.values(newErrors).some((error) => error !== '');

        if (!hasErrors) {
            setIsSubmitting(true);

            try {
                // Prepare payload
                const payload = {
                    categoryName: formData.categoryName.trim(),
                    description: formData.description.trim(),
                };

                // Call real API
                const response = await createCategoryApi(payload);

                // Show success SweetAlert
                await Swal.fire({
                    icon: 'success',
                    title: 'Created Successfully!',
                    text: 'The service category has been created successfully.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f79f03',
                });

                // Call onSubmit callback if provided
                if (onSubmit) {
                    onSubmit(payload);
                }

                // Clear form after successful submission
                setFormData({
                    categoryName: '',
                    description: '',
                });
                setErrors({
                    categoryName: '',
                    description: '',
                });
                setTouched({
                    categoryName: false,
                    description: false,
                });
                setApiError(null);

            } catch (err) {
                setApiError(err.message);

                // Show error SweetAlert
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: err.message || 'Failed to create category. Please try again.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#f79f03',
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // Show validation errors
            await Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors in the form.',
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
                        Create Service Category
                    </Typography>
                </Paper>

                {/* Form Body */}
                <StyledPaper elevation={0} sx={{ borderRadius: '4px', bgcolor: '#fff' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Category Information Section */}
                        <Box sx={{ mb: 2 }}>
                            <SectionHeader
                                icon={<CategoryIcon />}
                                title="Category Information"
                            />
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
                                    name="categoryName"
                                    placeholder="e.g., Web Development, IT Services"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.categoryName && touched.categoryName}
                                    helperText={
                                        touched.categoryName && errors.categoryName
                                            ? errors.categoryName
                                            : `${formData.categoryName.length}/50 characters`
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CategoryIcon sx={fieldIconSx} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    size="small"
                                    label="Description"
                                    name="description"
                                    placeholder="Brief description of the service category"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.description && touched.description}
                                    helperText={
                                        touched.description && errors.description
                                            ? errors.description
                                            : `${formData.description.length}/500 characters (optional)`
                                    }
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <DescriptionIcon sx={fieldIconSx} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Error Display */}
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
                                    {isSubmitting || isLoading ? 'Creating...' : 'Create Category'}
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </StyledPaper>
            </Box>
        </Box>
    );
};

export default CreateServiceCategory;