'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Chip,
    CircularProgress,
    Stack,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Verified as VerifiedIcon,
    CloudUpload as CloudUploadIcon,
    Image as ImageIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Swal from 'sweetalert2';
import SiteLogo from '@/images/site-logo.png';
import SliderImage1 from '@/images/immify_kyc_step_1_no_logo.png';
import SliderImage2 from '@/images/immify_kyc_step_2_no_logo.png';
import SliderImage3 from '@/images/immify_kyc_step_3_no_logo.png';
import SliderImage4 from '@/images/immify_kyc_step_4_no_logo.png';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    borderRadius: 0,
    boxShadow: 'none',
    border: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}));

const sliderImages = [
    SliderImage1,
    SliderImage2,
    SliderImage3,
    SliderImage4
];

const VerifyButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f79f03',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#e08a02',
    },
    textTransform: 'none',
    minWidth: '70px',
    height: '36px',
    flexShrink: 0,
    fontSize: '12px',
    padding: '4px 8px',
    '&.Mui-disabled': {
        backgroundColor: '#16a34a',
        color: '#fff',
    },
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
    '& .MuiStepLabel-label': {
        fontWeight: 500,
        fontSize: '14px',
    },
    '& .MuiStepIcon-root': {
        color: '#cbd5e1',
    },
    '& .MuiStepIcon-root.Mui-active': {
        color: '#f79f03',
    },
    '& .MuiStepIcon-root.Mui-completed': {
        color: '#16a34a',
    },
}));

const PreviewImageContainer = styled(Box)({
    position: 'relative',
    width: '100%',
    maxWidth: '140px',
    height: '100px',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 'none',
    marginTop: '8px',
});

const PreviewImage = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
});

const RemoveImageButton = styled(IconButton)({
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '2px',
    width: '24px',
    height: '24px',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: '16px',
    },
});

const StepContentWrapper = styled(Box)({
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
});

const UploadContainer = styled(Box)({
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '12px',
});

const FieldsContainer = styled(Box)({
    flex: 1,
    overflow: 'auto',
    paddingRight: '4px',
    '&::-webkit-scrollbar': {
        width: '0px',
        background: 'transparent',
    },
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
});

const SliderImageWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
});

// Image upload API function
const uploadImage = async (file, purpose) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    try {
        const response = await fetch('/api/v1/upload/images', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload image');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Main Component
const KycWizardForm = ({ onSubmit, onCancel }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeStep, setActiveStep] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1: Services
        selectedServices: [],

        // Step 2: Company Details
        companyName: '',
        address: '',
        companyLink: '',
        instagramLink: '',
        companyImage: null,
        companyImageUrl: null,
        employeeCount: '',

        // Step 3: Documents
        aadharNumber: '',
        aadharImage: null,
        aadharImageUrl: null,
        aadharVerified: false,
        panNumber: '',
        panImage: null,
        panImageUrl: null,
        panVerified: false,
        cinNumber: '',
        cinImage: null,
        cinImageUrl: null,
        cinVerified: false,
        gstNumber: '',
        gstImage: null,
        gstImageUrl: null,
        gstVerified: false,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companyImagePreview, setCompanyImagePreview] = useState(null);
    const [verifyErrors, setVerifyErrors] = useState({});
    const [documentImagePreviews, setDocumentImagePreviews] = useState({});

    // Services options
    const services = [
        { id: 'web_dev', label: 'Web Development' },
        { id: 'mobile_dev', label: 'Mobile Development' },
        { id: 'it_services', label: 'IT Services' },
        { id: 'design', label: 'Design Services' },
        { id: 'digital_marketing', label: 'Digital Marketing' },
        { id: 'cloud_services', label: 'Cloud Services' },
    ];

    // Steps configuration
    const steps = [
        { label: 'Select Services', step: 'services' },
        { label: 'Company Details', step: 'company-details' },
        { label: 'Document Verification', step: 'documents' },
        { label: 'Review & Submit', step: 'review' }
    ];

    // Get current step from URL query parameter
    useEffect(() => {
        const stepParam = searchParams.get('step');
        if (stepParam) {
            const stepIndex = steps.findIndex(s => s.step === stepParam);
            if (stepIndex !== -1) {
                setActiveStep(stepIndex);
            }
        }
        setIsInitialLoad(false);
    }, [searchParams]);

    // Update URL when step changes
    const updateRoute = (stepIndex) => {
        const stepValue = steps[stepIndex].step;
        const params = new URLSearchParams(searchParams.toString());
        params.set('step', stepValue);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    // Validation functions
    const validateAadharNumber = (value) => {
        const cleaned = value.replace(/\s/g, '');
        if (!/^\d{12}$/.test(cleaned)) {
            return 'Aadhar number must be exactly 12 digits';
        }
        return '';
    };

    const validatePANNumber = (value) => {
        const cleaned = value.replace(/\s/g, '').toUpperCase();
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)) {
            return 'PAN must be in format: ABCDE1234F';
        }
        return '';
    };

    const validateCINNumber = (value) => {
        const cleaned = value.replace(/\s/g, '').toUpperCase();
        if (!/^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{1}[0-9]{6}[A-Z]{1}$/.test(cleaned)) {
            return 'Invalid CIN format';
        }
        return '';
    };

    const validateGSTNumber = (value) => {
        const cleaned = value.replace(/\s/g, '').toUpperCase();
        if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{1}$/.test(cleaned)) {
            return 'Invalid GST format';
        }
        return '';
    };

    // Handle form field changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (verifyErrors[field]) {
            setVerifyErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Handle service selection
    const handleServiceToggle = (serviceId) => {
        setFormData(prev => {
            const current = prev.selectedServices;
            const newSelection = current.includes(serviceId)
                ? current.filter(id => id !== serviceId)
                : [...current, serviceId];
            return { ...prev, selectedServices: newSelection };
        });
    };

    // Handle file upload with API call
    const handleFileUpload = async (field, file, purpose) => {
        if (!file) return;

        setUploadingImage(true);

        try {
            Swal.fire({
                title: 'Uploading...',
                text: 'Please wait while we upload your image',
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await uploadImage(file, purpose);
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Uploaded Successfully!',
                text: 'Image has been uploaded successfully.',
                confirmButtonColor: '#f79f03',
                timer: 1500,
                showConfirmButton: false,
            });

            const imageUrl = response.data?.url || response.url || response.imageUrl;

            if (field === 'companyImage') {
                setCompanyImagePreview(imageUrl);
                setFormData(prev => ({
                    ...prev,
                    [field]: imageUrl,
                    companyImageUrl: imageUrl,
                }));
                if (errors.companyImage) {
                    setErrors(prev => ({ ...prev, companyImage: '' }));
                }
            } else {
                setFormData(prev => ({
                    ...prev,
                    [field]: imageUrl,
                    [`${field}Url`]: imageUrl,
                }));
                setDocumentImagePreviews(prev => ({
                    ...prev,
                    [field]: imageUrl
                }));
            }

        } catch (error) {
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: error.message || 'Failed to upload image. Please try again.',
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setUploadingImage(false);
        }
    };

    // Handle file selection
    const handleFileSelect = (field, file, purpose) => {
        if (file) {
            if (field === 'companyImage') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setCompanyImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
            handleFileUpload(field, file, purpose);
        }
    };

    // Handle remove image
    const handleRemoveImage = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: null,
            [`${field}Url`]: null,
        }));
        if (field === 'companyImage') {
            setCompanyImagePreview(null);
        } else {
            setDocumentImagePreviews(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // Handle document verification
    const handleVerify = (docType, numberField, verifyField) => {
        const number = formData[numberField];

        setVerifyErrors(prev => ({ ...prev, [numberField]: '' }));

        if (!number || !number.trim()) {
            setVerifyErrors(prev => ({
                ...prev,
                [numberField]: `Please enter ${docType} number first`
            }));
            return;
        }

        let validationError = '';
        switch (numberField) {
            case 'aadharNumber':
                validationError = validateAadharNumber(number);
                break;
            case 'panNumber':
                validationError = validatePANNumber(number);
                break;
            case 'cinNumber':
                validationError = validateCINNumber(number);
                break;
            case 'gstNumber':
                validationError = validateGSTNumber(number);
                break;
            default:
                break;
        }

        if (validationError) {
            setVerifyErrors(prev => ({ ...prev, [numberField]: validationError }));
            return;
        }

        Swal.fire({
            title: 'Verifying...',
            text: `Please wait while we verify ${docType}`,
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading();
            },
        });

        // Simulate API call
        setTimeout(() => {
            Swal.close();

            Swal.fire({
                icon: 'success',
                title: `${docType} Verified!`,
                text: `${docType} has been verified successfully.`,
                confirmButtonColor: '#f79f03',
            });

            setFormData(prev => ({
                ...prev,
                [verifyField]: true
            }));
        }, 1500);
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        switch (activeStep) {
            case 0:
                if (formData.selectedServices.length === 0) {
                    newErrors.selectedServices = 'Please select at least one service';
                    isValid = false;
                }
                break;

            case 1:
                if (!formData.companyName.trim()) {
                    newErrors.companyName = 'Company name is required';
                    isValid = false;
                }
                if (!formData.address.trim()) {
                    newErrors.address = 'Address is required';
                    isValid = false;
                }
                if (!formData.companyLink.trim()) {
                    newErrors.companyLink = 'Company link is required';
                    isValid = false;
                }
                if (!formData.instagramLink.trim()) {
                    newErrors.instagramLink = 'Instagram link is required';
                    isValid = false;
                }
                if (!formData.employeeCount) {
                    newErrors.employeeCount = 'Number of employees is required';
                    isValid = false;
                }
                break;

            case 2:
                if (!formData.aadharNumber.trim()) {
                    newErrors.aadharNumber = 'Aadhar number is required';
                    isValid = false;
                } else if (!formData.aadharVerified) {
                    newErrors.aadharVerified = 'Please verify Aadhar card';
                    isValid = false;
                }

                if (!formData.panNumber.trim()) {
                    newErrors.panNumber = 'PAN number is required';
                    isValid = false;
                } else if (!formData.panVerified) {
                    newErrors.panVerified = 'Please verify PAN card';
                    isValid = false;
                }
                break;

            case 3:
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep()) {
            const nextStep = Math.min(activeStep + 1, steps.length - 1);
            setActiveStep(nextStep);
            updateRoute(nextStep);
        }
    };

    // Handle back step
    const handleBack = () => {
        const prevStep = Math.max(activeStep - 1, 0);
        setActiveStep(prevStep);
        updateRoute(prevStep);
    };

    // Handle final submit
    const handleSubmit = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                services: formData.selectedServices.map(id =>
                    services.find(s => s.id === id)?.label
                ),
                companyDetails: {
                    name: formData.companyName,
                    address: formData.address,
                    companyLink: formData.companyLink,
                    instagramLink: formData.instagramLink,
                    employeeCount: formData.employeeCount,
                    companyImage: formData.companyImageUrl || formData.companyImage,
                },
                documents: {
                    aadhar: {
                        number: formData.aadharNumber,
                        image: formData.aadharImageUrl || formData.aadharImage,
                        verified: formData.aadharVerified,
                    },
                    pan: {
                        number: formData.panNumber,
                        image: formData.panImageUrl || formData.panImage,
                        verified: formData.panVerified,
                    },
                    cin: {
                        number: formData.cinNumber,
                        image: formData.cinImageUrl || formData.cinImage,
                        verified: formData.cinVerified,
                    },
                    gst: {
                        number: formData.gstNumber,
                        image: formData.gstImageUrl || formData.gstImage,
                        verified: formData.gstVerified,
                    },
                },
            };

            const response = await fetch('/api/v1/kyc-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to submit KYC');
            }

            await Swal.fire({
                icon: 'success',
                title: 'KYC Submitted Successfully!',
                text: 'Your KYC verification is in process.',
                confirmButtonColor: '#f79f03',
            });

            if (onSubmit) {
                onSubmit(payload);
            }

            // Reset form
            setFormData({
                selectedServices: [],
                companyName: '',
                address: '',
                companyLink: '',
                instagramLink: '',
                companyImage: null,
                companyImageUrl: null,
                employeeCount: '',
                aadharNumber: '',
                aadharImage: null,
                aadharImageUrl: null,
                aadharVerified: false,
                panNumber: '',
                panImage: null,
                panImageUrl: null,
                panVerified: false,
                cinNumber: '',
                cinImage: null,
                cinImageUrl: null,
                cinVerified: false,
                gstNumber: '',
                gstImage: null,
                gstImageUrl: null,
                gstVerified: false,
            });
            setCompanyImagePreview(null);
            setDocumentImagePreviews({});
            setActiveStep(0);
            updateRoute(0);

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to submit KYC',
                confirmButtonColor: '#f79f03',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render step content
    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return renderServicesStep();
            case 1:
                return renderCompanyDetailsStep();
            case 2:
                return renderDocumentVerificationStep();
            case 3:
                return renderReviewStep();
            default:
                return null;
        }
    };

    // Step 1: Services Selection
    const renderServicesStep = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Select Services
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Please select the services you offer
            </Typography>

            <FormGroup>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
                        columnGap: 3,
                        rowGap: 0.5,
                        width: '100%',
                    }}
                >
                    {services.map((service) => (
                        <Box key={service.id} sx={{ minWidth: 0 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.selectedServices.includes(service.id)}
                                        onChange={() => handleServiceToggle(service.id)}
                                        sx={{
                                            color: '#f79f03',
                                            '&.Mui-checked': {
                                                color: '#f79f03',
                                            },
                                        }}
                                    />
                                }
                                label={service.label}
                                sx={{
                                    m: 0,
                                    width: '100%',
                                    minHeight: 36,
                                    '& .MuiFormControlLabel-label': {
                                        color: '#1e293b',
                                        fontSize: 14,
                                    },
                                }}
                            />
                        </Box>
                    ))}
                </Box>
            </FormGroup>

            {errors.selectedServices && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.selectedServices}
                </Typography>
            )}
        </Box>
    );

    // Step 2: Company Details
    const renderCompanyDetailsStep = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Company Details
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2.5,
                    width: '100%',
                }}
            >
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Company Name"
                        value={formData.companyName}
                        onChange={(e) => handleChange('companyName', e.target.value)}
                        error={!!errors.companyName}
                        helperText={errors.companyName}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Number of Employees"
                        type="number"
                        value={formData.employeeCount}
                        onChange={(e) => handleChange('employeeCount', e.target.value)}
                        error={!!errors.employeeCount}
                        helperText={errors.employeeCount}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Company Website Link"
                        value={formData.companyLink}
                        onChange={(e) => handleChange('companyLink', e.target.value)}
                        error={!!errors.companyLink}
                        helperText={errors.companyLink}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Instagram Link"
                        value={formData.instagramLink}
                        onChange={(e) => handleChange('instagramLink', e.target.value)}
                        error={!!errors.instagramLink}
                        helperText={errors.instagramLink}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Address"
                        multiline
                        rows={2}
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        error={!!errors.address}
                        helperText={errors.address}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <UploadContainer>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                textTransform: 'none',
                                width: '100%',
                                borderColor: '#cbd5e1',
                                color: '#475569',
                            }}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? 'Uploading...' : 'Upload Company Logo'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFileSelect('companyImage', file, 'companyImage');
                                    }
                                    e.target.value = '';
                                }}
                            />
                        </Button>

                        {errors.companyImage && (
                            <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                                {errors.companyImage}
                            </Typography>
                        )}

                        {companyImagePreview && (
                            <PreviewImageContainer>
                                <PreviewImage src={companyImagePreview} alt="Company Logo Preview" />
                                <RemoveImageButton onClick={() => handleRemoveImage('companyImage')} size="small">
                                    <CloseIcon />
                                </RemoveImageButton>
                            </PreviewImageContainer>
                        )}
                    </UploadContainer>
                </Box>
            </Box>
        </Box>
    );

    // Step 3: Document Verification
    const renderDocumentVerificationStep = () => {
        const documents = [
            {
                key: 'aadhar',
                label: 'Aadhar Card',
                number: formData.aadharNumber,
                image: formData.aadharImage,
                imageUrl: formData.aadharImageUrl,
                verified: formData.aadharVerified,
                numberField: 'aadharNumber',
                imageField: 'aadharImage',
                verifyField: 'aadharVerified',
                placeholder: 'Enter 12-digit Aadhar number',
                purpose: 'aadhar',
                preview: documentImagePreviews.aadharImage,
                showUpload: true,
                optional: false,
            },
            {
                key: 'pan',
                label: 'PAN Card',
                number: formData.panNumber,
                image: formData.panImage,
                imageUrl: formData.panImageUrl,
                verified: formData.panVerified,
                numberField: 'panNumber',
                imageField: 'panImage',
                verifyField: 'panVerified',
                placeholder: 'Enter PAN number (e.g., ABCDE1234F)',
                purpose: 'pan',
                preview: documentImagePreviews.panImage,
                showUpload: true,
                optional: false,
            },
            {
                key: 'cin',
                label: 'CIN',
                number: formData.cinNumber,
                image: formData.cinImage,
                imageUrl: formData.cinImageUrl,
                verified: formData.cinVerified,
                numberField: 'cinNumber',
                imageField: 'cinImage',
                verifyField: 'cinVerified',
                placeholder: 'Enter CIN number',
                purpose: 'cin',
                preview: documentImagePreviews.cinImage,
                showUpload: true,
                optional: true,
            },
            {
                key: 'gst',
                label: 'GST',
                number: formData.gstNumber,
                image: formData.gstImage,
                imageUrl: formData.gstImageUrl,
                verified: formData.gstVerified,
                numberField: 'gstNumber',
                imageField: 'gstImage',
                verifyField: 'gstVerified',
                placeholder: 'Enter GST number',
                purpose: 'gst',
                preview: documentImagePreviews.gstImage,
                showUpload: true,
                optional: true,
            },
        ];

        return (
            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Document Verification
                </Typography>

                {documents.map((doc) => (
                    <Paper key={doc.key} sx={{ p: 1.5, mb: 1.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', xl: '140px 1fr 200px' },
                                gap: 2,
                                alignItems: 'start',
                                width: '100%',
                            }}
                        >
                            {/* Label only – NO Verified chip */}
                            <Box sx={{ minWidth: 0, pt: { md: 1 } }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {doc.label}
                                    {doc.optional && (
                                        <Typography component="span" variant="caption" color="textSecondary" sx={{ ml: 0.75 }}>
                                            Optional
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>

                            {/* Number Input */}
                            <Box sx={{ minWidth: 0, width: '100%' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={doc.placeholder}
                                    value={doc.number}
                                    onChange={(e) => handleChange(doc.numberField, e.target.value)}
                                    error={!!verifyErrors[doc.numberField] || !!errors[doc.numberField]}
                                    helperText={verifyErrors[doc.numberField] || errors[doc.numberField] || ''}
                                    disabled={doc.verified}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            width: '100%',
                                            backgroundColor: doc.verified ? '#f8fafc' : 'transparent',
                                        }
                                    }}
                                />
                            </Box>

                            {/* Upload + Verify buttons */}
                            <Box sx={{ minWidth: 0 }}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="stretch">
                                    {doc.showUpload && (
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                            startIcon={<ImageIcon />}
                                            sx={{
                                                textTransform: 'none',
                                                flex: 1,
                                                minWidth: '80px',
                                                fontSize: '12px',
                                                padding: '4px 8px',
                                                opacity: doc.verified ? 0.5 : 1,
                                                cursor: doc.verified ? 'not-allowed' : 'pointer',
                                            }}
                                            disabled={doc.verified || uploadingImage}
                                        >
                                            {uploadingImage ? 'Uploading...' : 'Upload'}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        handleFileSelect(doc.imageField, file, doc.purpose);
                                                    }
                                                    e.target.value = '';
                                                }}
                                            />
                                        </Button>
                                    )}

                                    <VerifyButton
                                        size="small"
                                        onClick={() => handleVerify(doc.label, doc.numberField, doc.verifyField)}
                                        disabled={doc.verified || !doc.number?.trim()}
                                        startIcon={doc.verified ? <VerifiedIcon /> : null}
                                    >
                                        {doc.verified ? 'Verified' : 'Verify'}
                                    </VerifyButton>
                                </Stack>

                                {doc.image && !doc.verified && (
                                    <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                                        Image uploaded – click Verify
                                    </Typography>
                                )}

                                {doc.preview && doc.verified && (
                                    <PreviewImageContainer sx={{ maxWidth: '80px', height: '60px', marginTop: '4px' }}>
                                        <PreviewImage src={doc.preview} alt={`${doc.label}`} />
                                    </PreviewImageContainer>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                ))}

                {(errors.aadharVerified || errors.panVerified) && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {errors.aadharVerified || errors.panVerified}
                    </Typography>
                )}
            </Box>
        );
    };

    // Step 4: Review
    const renderReviewStep = () => (
        <Box>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                Review & Submit
            </Typography>

            <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#f79f03' }}>
                    Selected Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {formData.selectedServices.map(id => {
                        const service = services.find(s => s.id === id);
                        return service ? (
                            <Chip key={id} label={service.label} size="small" />
                        ) : null;
                    })}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#f79f03' }}>
                    Company Details
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Company Name</Typography>
                        <Typography variant="body2">{formData.companyName || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Employees</Typography>
                        <Typography variant="body2">{formData.employeeCount || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Website</Typography>
                        <Typography variant="body2">{formData.companyLink || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Instagram</Typography>
                        <Typography variant="body2">{formData.instagramLink || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Address</Typography>
                        <Typography variant="body2">{formData.address || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Company Logo</Typography>
                        {companyImagePreview ? (
                            <PreviewImageContainer sx={{ maxWidth: '80px', height: '60px', marginTop: '4px' }}>
                                <PreviewImage src={companyImagePreview} alt="Company Logo" />
                            </PreviewImageContainer>
                        ) : (
                            <Typography variant="body2">No logo uploaded</Typography>
                        )}
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#f79f03' }}>
                    Documents Status
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1 }}>
                    {['aadhar', 'pan', 'cin', 'gst'].map(doc => (
                        <Box key={doc} sx={{ minWidth: 0 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                                {doc}
                            </Typography>
                            <Typography variant="body2">
                                {formData[`${doc}Verified`] ? (
                                    <Chip size="small" label="Verified" color="success" icon={<VerifiedIcon />} />
                                ) : (
                                    <Chip size="small" label="Pending" color="warning" />
                                )}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );

    // Image slider effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3500);

        return () => clearInterval(timer);
    }, []);

    // Set initial step in URL only once
    useEffect(() => {
        if (!isInitialLoad) {
            const stepParam = searchParams.get('step');
            if (!stepParam) {
                updateRoute(0);
            }
        }
    }, [isInitialLoad]);

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                maxHeight: '100vh',
                minHeight: '100vh',
                bgcolor: '#f8fafc',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 0,
                overflow: 'hidden',
            }}
        >
            {/* Left side image slider */}
            <Paper
                elevation={0}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'relative',
                    height: '100vh',
                    overflow: 'hidden',
                    borderRadius: 0,
                    border: 0,
                    bgcolor: '#0f172a',
                }}
            >
                {sliderImages.map((image, index) => (
                    <Box
                        key={index}
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: currentImageIndex === index ? 1 : 0,
                            transition: 'opacity 700ms ease',
                        }}
                    >
                        <SliderImageWrapper>
                            <Image
                                src={image}
                                alt={`KYC Step ${index + 1}`}
                                fill
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                }}
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </SliderImageWrapper>
                    </Box>
                ))}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 24,
                        left: 28,
                        zIndex: 2,
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        src={SiteLogo}
                        alt="Immify"
                        style={{ width: 132, height: 'auto', objectFit: 'contain' }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(15,23,42,0.16) 0%, rgba(15,23,42,0.72) 100%)',
                        zIndex: 1,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        left: 32,
                        right: 32,
                        bottom: 32,
                        color: '#fff',
                        zIndex: 2,
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Verify and grow with confidence
                    </Typography>
                    <Typography variant="body2" sx={{ maxWidth: 420, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8 }}>
                        Complete your business verification with secure document checks and service details.
                    </Typography>
                </Box>
            </Paper>

            {/* Right side form */}
            <StyledPaper>
                {/* Header */}
                <Box sx={{ mb: 1.5, textAlign: 'center', flexShrink: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
                        KYC Verification
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Complete your KYC verification process
                    </Typography>
                </Box>

                {/* Stepper */}
                <Box sx={{ overflowX: 'auto', pb: 1, mb: 1.5, flexShrink: 0 }}>
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ minWidth: { xs: 640, md: 'auto' } }}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StyledStepLabel>{step.label}</StyledStepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {/* Step Content */}
                <StepContentWrapper>
                    <FieldsContainer>
                        {renderStepContent(activeStep)}
                    </FieldsContainer>
                </StepContentWrapper>

                {/* Navigation Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: '1px solid #e2e8f0',
                    flexShrink: 0
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowBackIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                sx={{
                                    bgcolor: '#f79f03',
                                    '&:hover': { bgcolor: '#e08a02' },
                                    textTransform: 'none',
                                }}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit KYC'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    bgcolor: '#f79f03',
                                    '&:hover': { bgcolor: '#e08a02' },
                                    textTransform: 'none',
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </StyledPaper>
        </Box>
    );
};

export default KycWizardForm;