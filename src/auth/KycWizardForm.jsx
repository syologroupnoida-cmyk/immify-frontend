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
    MenuItem,
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
import MainApi from '@/util/MainApi';
import { getLoginPath, getVendorType, normalizeRole } from '@/util/authRouting';
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

const referralSourceOptions = ['GOOGLE', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'FRIEND', 'OTHER'];
const maxImageSizeKb = 500;
const maxImageSizeBytes = maxImageSizeKb * 1024;

function readStoredJson(key) {
    if (typeof window === 'undefined') return null;

    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch {
        return null;
    }
}

function getPostKycLoginPath() {
    if (typeof window === 'undefined') return '/agent/login';

    const authData = readStoredJson('authData') || {};
    const storedUser = readStoredJson('userData') || readStoredJson('UserData') || {};
    const dataUser = authData?.data?.user || authData?.user || {};
    const user = Object.keys(storedUser).length > 0 ? storedUser : dataUser;
    const role = normalizeRole(window.localStorage.getItem('userRole') || user?.role || authData?.data?.user?.role || authData?.role);
    const vendorType = getVendorType(user) || getVendorType(authData);

    return getLoginPath(role, { ...authData, ...user, vendorType }) || '/agent/login';
}

function withKycSubmittedFlag(path) {
    return `${path}${path.includes('?') ? '&' : '?'}kycSubmitted=1`;
}

function clearAuthSession() {
    if (typeof window === 'undefined') return;

    [
        'isAuthenticated',
        'authData',
        'userData',
        'UserData',
        'userRole',
        'accessToken',
        'refreshToken',
        'refreshExpiresAt',
    ].forEach((key) => window.localStorage.removeItem(key));

    [
        'tripz_auth',
        'tripz_role',
        'tripz_kyc',
        'tripz_kyc_status',
        'tripz_vendor_type',
        'tripz_next_step',
    ].forEach((name) => {
        document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
    });

    window.dispatchEvent(new Event('tripz-auth-change'));
}

function getFirstArray(...values) {
    return values.find((value) => Array.isArray(value)) || [];
}

function normalizeServiceCategories(responseData) {
    const categoriesArray = getFirstArray(
        responseData,
        responseData?.data,
        responseData?.data?.data,
        responseData?.categories,
        responseData?.serviceCategories,
        responseData?.data?.categories,
        responseData?.data?.serviceCategories,
        responseData?.data?.items,
        responseData?.data?.results,
        responseData?.items,
        responseData?.results
    );
    const categories = categoriesArray.length > 0
        ? categoriesArray
        : [responseData?.data, responseData].filter((value) => (
            value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            (value.name || value.categoryName || value.title)
        ));

    return categories.map((category, categoryIndex) => {
        const categoryId = category?._id || category?.id || category?.slug || `category-${categoryIndex}`;
        const categoryName = category?.name || category?.categoryName || category?.title || 'Unnamed Category';

        return {
            id: String(categoryId),
            name: categoryName,
        };
    }).filter((category) => category.name);
}

// Image upload API function
const uploadImage = async (file, purpose) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    return MainApi.post('/uploads/image', formData);
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
        businessName: '',
        companyType: '',
        companySince: '',
        teamSize: '',
        country: 'India',
        officeAddress: '',
        officeCity: '',
        officeState: '',
        destinations: '',
        dailyLeadRequirement: '',
        profileUrl: '',
        referralSource: '',
        marketplaceWorked: false,
        agreeTerms: false,
        declareTrue: false,
        companyImage: null,
        companyImageUrl: null,

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
    const [serviceCategories, setServiceCategories] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [servicesError, setServicesError] = useState('');

    // Steps configuration
    const steps = [
        { label: 'Select Services', step: 'services' },
        { label: 'Company Details', step: 'company-details' },
        { label: 'Document Verification', step: 'documents' },
        { label: 'Additional Details', step: 'additional-details' },
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

    useEffect(() => {
        let isMounted = true;

        async function loadServiceCategories() {
            setIsLoadingServices(true);
            setServicesError('');

            try {
                const response = await MainApi.get('/service-categories', { suppressAuthRedirect: true });
                if (!isMounted) return;

                setServiceCategories(normalizeServiceCategories(response?.data));
            } catch (error) {
                if (!isMounted) return;

                setServicesError(error.message || 'Failed to load service categories.');
                setServiceCategories([]);
            } finally {
                if (isMounted) {
                    setIsLoadingServices(false);
                }
            }
        }

        loadServiceCategories();

        return () => {
            isMounted = false;
        };
    }, []);

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
        const verificationResetMap = {
            aadharNumber: 'aadharVerified',
            panNumber: 'panVerified',
            cinNumber: 'cinVerified',
            gstNumber: 'gstVerified',
        };

        setFormData(prev => ({
            ...prev,
            [field]: value,
            ...(verificationResetMap[field] ? { [verificationResetMap[field]]: false } : {}),
        }));
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

            const imageUrl = response?.data?.url || response?.data?.data?.url || response?.data?.imageUrl || response?.data?.data?.imageUrl || response?.url || response?.imageUrl;
            if (!imageUrl) {
                throw new Error('Upload completed but image URL was not returned.');
            }

            if (field === 'companyImage') {
                setCompanyImagePreview(imageUrl);
                setFormData(prev => ({
                    ...prev,
                    [field]: imageUrl,
                    companyImageUrl: imageUrl,
                    profileUrl: imageUrl,
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
            if (file.size > maxImageSizeBytes) {
                Swal.fire({
                    icon: 'error',
                    title: 'Image Too Large',
                    text: `Please upload an image under ${maxImageSizeKb} KB.`,
                    confirmButtonColor: '#f79f03',
                });
                return;
            }

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
            ...(field === 'companyImage' ? { profileUrl: '' } : {}),
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
    const handleVerify = async (docType, numberField, verifyField, endpoint) => {
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

        try {
            Swal.fire({
                title: 'Verifying...',
                text: `Please wait while we verify ${docType}`,
                allowOutsideClick: false,
                showConfirmButton: false,
                willOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await MainApi.post(endpoint, { number: number.trim().toUpperCase() });
            Swal.close();

            await Swal.fire({
                icon: 'success',
                title: `${docType} Verified!`,
                text: response?.data?.message || `${docType} has been verified successfully.`,
                confirmButtonColor: '#f79f03',
            });

            setFormData(prev => ({
                ...prev,
                [verifyField]: true
            }));
        } catch (error) {
            Swal.close();
            setVerifyErrors(prev => ({ ...prev, [numberField]: error.message || `${docType} verification failed` }));
            await Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.message || `${docType} verification failed. Please try again.`,
                confirmButtonColor: '#f79f03',
            });
        }
    };

    // Validate current step
    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        switch (activeStep) {
            case 0:
                if (isLoadingServices) {
                    newErrors.selectedServices = 'Please wait while services are loading';
                    isValid = false;
                } else if (servicesError) {
                    newErrors.selectedServices = servicesError;
                    isValid = false;
                } else if (serviceCategories.length === 0) {
                    newErrors.selectedServices = 'No categories are available';
                    isValid = false;
                } else if (formData.selectedServices.length === 0) {
                    newErrors.selectedServices = 'Please select at least one category';
                    isValid = false;
                }
                break;

            case 1:
                if (!formData.companyName.trim()) {
                    newErrors.companyName = 'Company name is required';
                    isValid = false;
                }
                if (!formData.businessName.trim()) {
                    newErrors.businessName = 'Business name is required';
                    isValid = false;
                }
                if (!formData.companyType) {
                    newErrors.companyType = 'Company type is required';
                    isValid = false;
                }
                if (!formData.companySince || Number.isNaN(Number(formData.companySince)) || Number(formData.companySince) < 0) {
                    newErrors.companySince = 'Company since must be a valid number';
                    isValid = false;
                }
                if (!formData.teamSize || Number(formData.teamSize) < 1) {
                    newErrors.teamSize = 'Team size is required';
                    isValid = false;
                }
                if (!formData.country.trim()) {
                    newErrors.country = 'Country is required';
                    isValid = false;
                }
                if (!formData.officeAddress.trim()) {
                    newErrors.officeAddress = 'Office address is required';
                    isValid = false;
                }
                if (!formData.officeCity.trim()) {
                    newErrors.officeCity = 'Office city is required';
                    isValid = false;
                }
                if (!formData.officeState.trim()) {
                    newErrors.officeState = 'Office state is required';
                    isValid = false;
                }
                if (!formData.destinations.trim()) {
                    newErrors.destinations = 'Destinations are required';
                    isValid = false;
                }
                if (!formData.dailyLeadRequirement || Number(formData.dailyLeadRequirement) < 1) {
                    newErrors.dailyLeadRequirement = 'Daily lead requirement is required';
                    isValid = false;
                }
                if (!formData.profileUrl) {
                    newErrors.companyImage = 'Company logo is required';
                    isValid = false;
                }
                break;

            case 3:
                if (!formData.referralSource) {
                    newErrors.referralSource = 'Referral source is required';
                    isValid = false;
                }
                if (!formData.agreeTerms) {
                    newErrors.agreeTerms = 'Please agree to the terms';
                    isValid = false;
                }
                if (!formData.declareTrue) {
                    newErrors.declareTrue = 'Please confirm the declaration';
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
                if (formData.cinNumber.trim() && !formData.cinVerified) {
                    newErrors.cinVerified = 'Please verify CIN';
                    isValid = false;
                }
                if (formData.gstNumber.trim() && !formData.gstVerified) {
                    newErrors.gstVerified = 'Please verify GST';
                    isValid = false;
                }
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
                companyName: formData.companyName.trim(),
                businessName: formData.businessName.trim(),
                companyType: formData.companyType,
                companySince: Number(formData.companySince),
                teamSize: Number(formData.teamSize),
                country: formData.country.trim(),
                officeAddress: formData.officeAddress.trim(),
                officeCity: formData.officeCity.trim(),
                officeState: formData.officeState.trim(),
                services: formData.selectedServices,
                destinations: formData.destinations.split(',').map(item => item.trim()).filter(Boolean),
                dailyLeadRequirement: Number(formData.dailyLeadRequirement),
                profileUrl: formData.profileUrl,
                referralSource: formData.referralSource,
                marketplaceWorked: Boolean(formData.marketplaceWorked),
                agreeTerms: Boolean(formData.agreeTerms),
                declareTrue: Boolean(formData.declareTrue),
                panNumber: formData.panNumber.trim().toUpperCase(),
            };

            const response = await MainApi.post('/vendor/kyc', payload);

            const loginPath = withKycSubmittedFlag(getPostKycLoginPath());

            await Swal.fire({
                icon: 'success',
                title: 'KYC Submitted Successfully!',
                text: response?.data?.message || 'Your KYC verification is in process.',
                confirmButtonColor: '#f79f03',
            });

            if (onSubmit) {
                onSubmit(payload);
            }

            clearAuthSession();
            router.replace(loginPath);

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
                return renderAdditionalDetailsStep();
            case 4:
                return renderReviewStep();
            default:
                return null;
        }
    };

    // Step 1: Services Selection
    const renderServicesStep = () => (
        <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Select services:
            </Typography>

            {isLoadingServices ? (
                <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="textSecondary">
                        Loading categories...
                    </Typography>
                </Stack>
            ) : servicesError ? (
                <Typography color="error" variant="body2">
                    {servicesError}
                </Typography>
            ) : serviceCategories.length === 0 ? (
                <Typography color="textSecondary" variant="body2">
                    No categories are available.
                </Typography>
            ) : (
                <Stack spacing={2}>
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
                            {serviceCategories.map((category) => (
                                <Box key={category.id} sx={{ minWidth: 0 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={formData.selectedServices.includes(category.id)}
                                                onChange={() => handleServiceToggle(category.id)}
                                                sx={{
                                                    color: '#f79f03',
                                                    '&.Mui-checked': {
                                                        color: '#f79f03',
                                                    },
                                                }}
                                            />
                                        }
                                        label={category.name}
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
                </Stack>
            )}

            {errors.selectedServices && (
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.selectedServices}
                </Typography>
            )}
        </Box>
    );

    // Step 2: Company Details
    const renderCompanyDetailsStep = () => (
        <Box sx={{ pt: 1.5 }}>
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
                        label="Business Name"
                        value={formData.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        error={!!errors.businessName}
                        helperText={errors.businessName}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        select
                        size="small"
                        label="Company Type"
                        value={formData.companyType}
                        onChange={(e) => handleChange('companyType', e.target.value)}
                        error={!!errors.companyType}
                        helperText={errors.companyType}
                    >
                        {['PVT_LTD', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP', 'OTHER'].map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Company Since"
                        type="number"
                        placeholder="2015"
                        value={formData.companySince}
                        onChange={(e) => handleChange('companySince', e.target.value)}
                        error={!!errors.companySince}
                        helperText={errors.companySince || 'Enter year or number'}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Team Size"
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => handleChange('teamSize', e.target.value)}
                        error={!!errors.teamSize}
                        helperText={errors.teamSize}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Country"
                        value={formData.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        error={!!errors.country}
                        helperText={errors.country}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Office City"
                        value={formData.officeCity}
                        onChange={(e) => handleChange('officeCity', e.target.value)}
                        error={!!errors.officeCity}
                        helperText={errors.officeCity}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Office State"
                        value={formData.officeState}
                        onChange={(e) => handleChange('officeState', e.target.value)}
                        error={!!errors.officeState}
                        helperText={errors.officeState}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Destinations"
                        placeholder="Goa, Kerala"
                        value={formData.destinations}
                        onChange={(e) => handleChange('destinations', e.target.value)}
                        error={!!errors.destinations}
                        helperText={errors.destinations || 'Comma separated destinations'}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Daily Lead Requirement"
                        type="number"
                        value={formData.dailyLeadRequirement}
                        onChange={(e) => handleChange('dailyLeadRequirement', e.target.value)}
                        error={!!errors.dailyLeadRequirement}
                        helperText={errors.dailyLeadRequirement}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Office Address"
                        multiline
                        rows={2}
                        value={formData.officeAddress}
                        onChange={(e) => handleChange('officeAddress', e.target.value)}
                        error={!!errors.officeAddress}
                        helperText={errors.officeAddress}
                    />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                    <UploadContainer
                        sx={{
                            p: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1,
                            minHeight: 40,
                        }}
                    >
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                                textTransform: 'none',
                                flex: 1,
                                minWidth: 0,
                                height: 40,
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
                                        handleFileSelect('companyImage', file, 'company-logo');
                                    }
                                    e.target.value = '';
                                }}
                            />
                        </Button>

                        {!companyImagePreview && (
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
                            >
                                Max {maxImageSizeKb} KB
                            </Typography>
                        )}

                        {errors.companyImage && (
                            <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                                {errors.companyImage}
                            </Typography>
                        )}

                        {companyImagePreview && (
                            <PreviewImageContainer
                                sx={{
                                    flex: '0 0 40px',
                                    width: 40,
                                    maxWidth: 40,
                                    height: 40,
                                    mt: 0,
                                    borderRadius: '6px',
                                }}
                            >
                                <PreviewImage src={companyImagePreview} alt="Company Logo Preview" />
                                <RemoveImageButton
                                    onClick={() => handleRemoveImage('companyImage')}
                                    size="small"
                                    sx={{
                                        top: 1,
                                        right: 1,
                                        width: 16,
                                        height: 16,
                                        p: 0,
                                        '& .MuiSvgIcon-root': { fontSize: 12 },
                                    }}
                                >
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
                verifyEndpoint: '/vendor/kyc/verify/aadhaar/initiate',
                purpose: 'aadhar',
                preview: documentImagePreviews.aadharImage,
                showUpload: false,
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
                verifyEndpoint: '/vendor/kyc/verify/pan',
                purpose: 'pan',
                preview: documentImagePreviews.panImage,
                showUpload: false,
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
                verifyEndpoint: '/vendor/kyc/verify/cin',
                purpose: 'cin',
                preview: documentImagePreviews.cinImage,
                showUpload: false,
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
                verifyEndpoint: '/vendor/kyc/verify/gstin',
                purpose: 'gst',
                preview: documentImagePreviews.gstImage,
                showUpload: false,
                optional: true,
            },
        ];

        return (
            <Box>
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
                            {/* Label only - no verified chip */}
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
                                        onClick={() => handleVerify(doc.label, doc.numberField, doc.verifyField, doc.verifyEndpoint)}
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

                {(errors.aadharVerified || errors.panVerified || errors.cinVerified || errors.gstVerified) && (
                    <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                        {errors.aadharVerified || errors.panVerified || errors.cinVerified || errors.gstVerified}
                    </Typography>
                )}
            </Box>
        );
    };

    // Step 4: Additional Details
    const renderAdditionalDetailsStep = () => (
        <Box>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2.5,
                    width: '100%',
                }}
            >
                <Box sx={{ minWidth: 0, gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1e293b' }}>
                        Referral Sources
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
                            {referralSourceOptions.map((option) => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Checkbox
                                            checked={formData.referralSource === option}
                                            onChange={(event) => handleChange('referralSource', event.target.checked ? option : '')}
                                            sx={{ color: '#f79f03', '&.Mui-checked': { color: '#f79f03' } }}
                                        />
                                    }
                                    label={option}
                                    sx={{
                                        m: 0,
                                        minHeight: 36,
                                        '& .MuiFormControlLabel-label': {
                                            color: '#1e293b',
                                            fontSize: 14,
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </FormGroup>
                    {errors.referralSource && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            {errors.referralSource}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ minWidth: 0, gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.marketplaceWorked}
                                onChange={(e) => handleChange('marketplaceWorked', e.target.checked)}
                                sx={{ color: '#f79f03', '&.Mui-checked': { color: '#f79f03' } }}
                            />
                        }
                        label="Worked with marketplace before"
                    />
                </Box>

                <Box sx={{ minWidth: 0, gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.agreeTerms}
                                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                                sx={{ color: '#f79f03', '&.Mui-checked': { color: '#f79f03' } }}
                            />
                        }
                        label="I agree to the terms"
                    />
                    {errors.agreeTerms && (
                        <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                            {errors.agreeTerms}
                        </Typography>
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formData.declareTrue}
                                onChange={(e) => handleChange('declareTrue', e.target.checked)}
                                sx={{ color: '#f79f03', '&.Mui-checked': { color: '#f79f03' } }}
                            />
                        }
                        label="I declare that the provided information is true"
                    />
                    {errors.declareTrue && (
                        <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                            {errors.declareTrue}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );

    // Step 5: Review
    const renderReviewStep = () => (
        <Box>
            <Paper sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600, color: '#f79f03' }}>
                    Selected Services
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                    {formData.selectedServices.map(id => {
                        const category = serviceCategories.find(item => item.id === id);
                        return category ? (
                            <Chip key={id} label={category.name} size="small" />
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
                        <Typography variant="caption" color="textSecondary">Business Name</Typography>
                        <Typography variant="body2">{formData.businessName || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Company Type</Typography>
                        <Typography variant="body2">{formData.companyType || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Company Since</Typography>
                        <Typography variant="body2">{formData.companySince || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Team Size</Typography>
                        <Typography variant="body2">{formData.teamSize || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Daily Leads</Typography>
                        <Typography variant="body2">{formData.dailyLeadRequirement || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Country</Typography>
                        <Typography variant="body2">{formData.country || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">City / State</Typography>
                        <Typography variant="body2">{[formData.officeCity, formData.officeState].filter(Boolean).join(', ') || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Address</Typography>
                        <Typography variant="body2">{formData.officeAddress || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Destinations</Typography>
                        <Typography variant="body2">{formData.destinations || '-'}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="textSecondary">Referral Source</Typography>
                        <Typography variant="body2">{formData.referralSource || '-'}</Typography>
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
