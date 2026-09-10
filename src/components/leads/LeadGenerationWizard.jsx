'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircleOutlined,
  CloudUploadOutlined,
  DescriptionOutlined,
  FactCheckOutlined,
  PersonOutlined,
  SchoolOutlined,
  Send,
  WorkOutlineOutlined,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';
import { uploadLeadDocument } from '@/util/leadDocuments';

const CATEGORY_ENDPOINT = '/service-categories';
const LEADS_ENDPOINT = '/leads';

const initialFormData = {
  categoryId: '',
  serviceId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  whatsappNumber: '',
  gender: 'Male',
  dateOfBirth: '',
  maritalStatus: 'Single',
  nationality: 'Indian',
  city: '',
  state: '',
  country: 'India',
  servicesRequired: '',
  destinationCountries: '',
  highestQualification: '',
  passingYear: '',
  university: '',
  percentageOrCgpa: '',
  currentCompany: '',
  currentDesignation: '',
  industry: '',
  yearsOfExperience: '',
  currentSalary: '',
  relevantExperience: '',
  languageTestTaken: '',
  overallScore: '',
  listeningScore: '',
  readingScore: '',
  writingScore: '',
  speakingScore: '',
  passportAvailable: 'Yes',
  passportExpiry: '',
  familyMaritalStatus: 'Single',
  spouseQualification: '',
  children: '',
  dependents: '',
  investmentBudget: '',
  applicationTimeline: '',
  additionalInformation: '',
  consentToCalls: false,
  termsAccepted: false,
};

const initialFiles = {
  resumeUrl: null,
  passportDocumentUrl: null,
  ieltsDocumentUrl: null,
  educationalCertificateUrls: [],
  experienceLetterUrls: [],
  bankStatementUrl: null,
};

const initialUploadLoading = {
  resumeUrl: false,
  passportDocumentUrl: false,
  ieltsDocumentUrl: false,
  educationalCertificateUrls: false,
  experienceLetterUrls: false,
  bankStatementUrl: false,
};

const steps = [
  { label: 'Service', icon: FactCheckOutlined },
  { label: 'Personal', icon: PersonOutlined },
  { label: 'Education', icon: SchoolOutlined },
  { label: 'Work', icon: WorkOutlineOutlined },
  { label: 'Documents', icon: DescriptionOutlined },
];

const selectOptions = {
  gender: ['Male', 'Female', 'Other'],
  maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  passportAvailable: ['Yes', 'No'],
  familyMaritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  languageTestTaken: ['IELTS', 'PTE', 'TOEFL', 'Duolingo', 'Not Taken'],
};

function getFirstArray(...values) {
  return values.find((value) => Array.isArray(value) && value.length > 0) || [];
}

function unwrapResponseData(responseData) {
  return responseData?.data ?? responseData ?? {};
}

function getCategoryId(category) {
  return String(category?.serviceCategoryId || category?.categoryId || category?.id || category?._id || category?.uuid || '');
}

function getCategoryName(category) {
  return category?.name || category?.categoryName || category?.title || 'Unnamed Category';
}

function getServiceName(service) {
  if (typeof service === 'string') return service;
  return service?.name || service?.serviceName || service?.title || 'Unnamed Service';
}

function getServiceId(service) {
  if (typeof service === 'string') return '';
  return String(service?.serviceId || service?.id || service?._id || service?.uuid || '');
}

function getCategoryServices(category) {
  return getFirstArray(
    category?.services,
    category?.service,
    category?.serviceList,
    category?.serviceItems,
    category?.service_items,
    category?.children,
    category?.data?.services,
    category?.data?.service,
    category?.data?.serviceList,
    category?.data?.serviceItems
  )
    .map((service) => ({
      id: getServiceId(service),
      name: getServiceName(service),
      raw: service,
    }))
    .filter((service) => service.id && service.name);
}

function normalizeServices(responseData) {
  const data = unwrapResponseData(responseData);
  const nestedData = unwrapResponseData(data);
  const serviceList = getFirstArray(
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

  return serviceList
    .map((service) => ({
      id: getServiceId(service),
      name: getServiceName(service),
      raw: service,
    }))
    .filter((service) => service.id && service.name);
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

function normalizeCategoryItem(category) {
  return {
    id: getCategoryId(category),
    name: getCategoryName(category),
    services: dedupeByIdOrName(getCategoryServices(category)),
    raw: category,
  };
}

function normalizeCategories(responseData) {
  const data = unwrapResponseData(responseData);
  const nestedData = unwrapResponseData(data);
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
    data?.data?.serviceCategories,
    data?.data?.rows,
    data?.data?.list,
    nestedData?.content,
    nestedData?.items,
    nestedData?.results,
    nestedData?.categories,
    nestedData?.serviceCategories
  );

  if (categories.length > 0) {
    return dedupeByIdOrName(categories.map(normalizeCategoryItem).filter((category) => category.id && category.name));
  }

  if (data && typeof data === 'object' && (data.id || data._id || data.categoryId || data.serviceCategoryId || data.name || data.categoryName || data.title)) {
    return [normalizeCategoryItem(data)].filter((category) => category.id && category.name);
  }

  if (nestedData && typeof nestedData === 'object' && (nestedData.id || nestedData._id || nestedData.categoryId || nestedData.serviceCategoryId || nestedData.name || nestedData.categoryName || nestedData.title)) {
    return [normalizeCategoryItem(nestedData)].filter((category) => category.id && category.name);
  }

  return [];
}

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function fieldSx() {
  return {
    '& .MuiOutlinedInput-root': { borderRadius: '6px', backgroundColor: '#fff' },
    '& .MuiInputLabel-root': { color: '#475569' },
  };
}

function isPdfFile(file) {
  if (!file) return false;
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
}

function createUploadedDocument(file, url, name) {
  return {
    file,
    url,
    name: name || file?.name || 'Lead Document',
  };
}

function getUploadedDocumentUrl(document) {
  if (!document) return '';
  if (typeof document === 'string') return document;
  return document.url || '';
}

function getUploadedDocumentName(document, fallbackName) {
  if (!document) return fallbackName;
  return document.name || document.file?.name || fallbackName;
}

function UploadField({ label, value, multiple = false, uploading = false, error = '', onChange }) {
  const files = multiple ? value || [] : value ? [value] : [];

  return (
    <Box sx={{ border: '1px dashed #cbd5e1', borderRadius: '6px', bgcolor: '#f8fafc', p: 1.5 }}>
      <Button
        component="label"
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadOutlined />}
        disabled={uploading}
        sx={{ width: '100%', justifyContent: 'flex-start', borderRadius: '6px', borderColor: '#cbd5e1', color: '#1f2a77', textTransform: 'none' }}
      >
        {uploading ? `Uploading ${label}...` : label}
        <input
          hidden
          type="file"
          accept="application/pdf"
          multiple={multiple}
          onChange={(event) => {
            const nextFiles = Array.from(event.target.files || []);
            onChange(multiple ? nextFiles : nextFiles[0] || null);
            event.target.value = '';
          }}
        />
      </Button>
      {files.length > 0 && (
        <Box sx={{ mt: 1, display: 'grid', gap: 0.5 }}>
          {files.map((document) => (
            <Typography key={`${getUploadedDocumentName(document, label)}-${getUploadedDocumentUrl(document) || document?.file?.size || ''}`} sx={{ fontSize: 12, color: '#475569' }}>
              {getUploadedDocumentName(document, label)}
              {getUploadedDocumentUrl(document) ? ' - Uploaded' : ''}
            </Typography>
          ))}
        </Box>
      )}
      {error && <Typography sx={{ mt: 0.75, fontSize: 12, color: '#d32f2f' }}>{error}</Typography>}
    </Box>
  );
}

export default function LeadGenerationWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState(initialFiles);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(initialUploadLoading);
  const [uploadErrors, setUploadErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState('');

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === formData.categoryId),
    [categories, formData.categoryId]
  );
  const services = selectedCategory?.services || [];

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setCategoryLoading(true);
      setLoadError('');

      try {
        const response = await MainApi.get(CATEGORY_ENDPOINT, {
          skipAuth: true,
          suppressAuthRedirect: true,
        });
        const loadedCategories = normalizeCategories(response?.data);

        if (isMounted) setCategories(loadedCategories);
      } catch (error) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || error?.message || 'Unable to load service categories.');
          setCategories([]);
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
    const category = categories.find((item) => item.id === categoryId);
    if (!category) {
      return category?.services || [];
    }

    setServiceLoading(true);
    try {
      const response = await MainApi.get(`${CATEGORY_ENDPOINT}/${categoryId}`, {
        skipAuth: true,
        suppressAuthRedirect: true,
      });
      const normalized = normalizeCategories(response?.data);
      const detailCategory = normalized[0] || null;
      const fallbackServices = category?.services || [];
      const responseServices = normalizeServices(response?.data);
      const nextServices = detailCategory?.services?.length > 0
        ? detailCategory.services
        : responseServices.length > 0
          ? responseServices
          : fallbackServices;
      setCategories((current) => current.map((item) => (
        item.id === categoryId ? { ...item, services: nextServices } : item
      )));
      return nextServices;
    } finally {
      setServiceLoading(false);
    }
  };

  const updateField = (field) => async (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'categoryId' ? { serviceId: '' } : {}),
    }));
    setErrors((current) => ({ ...current, [field]: '' }));
    if (field === 'categoryId' && value) {
      await fetchCategoryServices(value);
    }
  };

  const hasPendingUploads = Object.values(uploadLoading).some(Boolean);
  const hasUploadErrors = Object.values(uploadErrors).some(Boolean);

  const updateFile = async (field, value, documentName, multiple = false) => {
    const selectedFiles = multiple ? value || [] : value ? [value] : [];

    if (selectedFiles.length === 0) {
      setFiles((current) => ({ ...current, [field]: multiple ? [] : null }));
      setUploadErrors((current) => ({ ...current, [field]: '' }));
      return;
    }

    const invalidFile = selectedFiles.find((file) => !isPdfFile(file));
    if (invalidFile) {
      setFiles((current) => ({ ...current, [field]: multiple ? [] : null }));
      setUploadErrors((current) => ({ ...current, [field]: 'Please upload PDF files only.' }));
      return;
    }

    setFiles((current) => ({
      ...current,
      [field]: multiple
        ? selectedFiles.map((file, index) => createUploadedDocument(file, '', `${documentName} ${index + 1}`))
        : createUploadedDocument(selectedFiles[0], '', documentName),
    }));
    setUploadErrors((current) => ({ ...current, [field]: '' }));
    setUploadLoading((current) => ({ ...current, [field]: true }));

    try {
      const uploadedDocuments = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const name = multiple ? `${documentName} ${index + 1}` : documentName;
          const url = await uploadLeadDocument(file, name);
          if (!url) throw new Error('Upload succeeded but no file URL was returned.');
          return createUploadedDocument(file, url, name);
        })
      );

      setFiles((current) => ({
        ...current,
        [field]: multiple ? uploadedDocuments : uploadedDocuments[0],
      }));
    } catch (error) {
      setUploadErrors((current) => ({
        ...current,
        [field]: error?.response?.data?.message || error?.message || 'Unable to upload PDF. Please try again.',
      }));
    } finally {
      setUploadLoading((current) => ({ ...current, [field]: false }));
    }
  };

  const validateStep = (step = activeStep) => {
    const nextErrors = {};

    if (step === 0) {
      if (!formData.categoryId) nextErrors.categoryId = 'Select service category';
      if (!formData.serviceId) nextErrors.serviceId = 'Select service';
      if (!formData.servicesRequired.trim()) nextErrors.servicesRequired = 'Enter services required';
      if (!formData.destinationCountries.trim()) nextErrors.destinationCountries = 'Enter destination countries';
    }

    if (step === 1) {
      if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required';
      if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) nextErrors.email = 'Enter a valid email';
      if (!formData.phone.trim()) nextErrors.phone = 'Phone is required';
      if (!formData.whatsappNumber.trim()) nextErrors.whatsappNumber = 'WhatsApp number is required';
      if (!formData.dateOfBirth) nextErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.city.trim()) nextErrors.city = 'City is required';
      if (!formData.state.trim()) nextErrors.state = 'State is required';
      if (!formData.country.trim()) nextErrors.country = 'Country is required';
    }

    if (step === 2) {
      if (!formData.highestQualification.trim()) nextErrors.highestQualification = 'Highest qualification is required';
      if (!formData.passingYear) nextErrors.passingYear = 'Passing year is required';
      if (!formData.university.trim()) nextErrors.university = 'University is required';
    }

    if (step === 4) {
      if (!formData.termsAccepted) nextErrors.termsAccepted = 'Accept terms to submit';
      if (hasPendingUploads) nextErrors.documents = 'Please wait until PDF uploads finish.';
      if (hasUploadErrors) nextErrors.documents = 'Fix failed PDF uploads before submitting.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setActiveStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => {
    const resumeUrl = getUploadedDocumentUrl(files.resumeUrl);
    const passportDocumentUrl = getUploadedDocumentUrl(files.passportDocumentUrl);
    const ieltsDocumentUrl = getUploadedDocumentUrl(files.ieltsDocumentUrl);
    const bankStatementUrl = getUploadedDocumentUrl(files.bankStatementUrl);
    const educationalCertificateUrls = (files.educationalCertificateUrls || []).map(getUploadedDocumentUrl).filter(Boolean);
    const experienceLetterUrls = (files.experienceLetterUrls || []).map(getUploadedDocumentUrl).filter(Boolean);

    return {
      categoryId: formData.categoryId,
      serviceId: formData.serviceId,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      message: formData.additionalInformation.trim() || 'Customer immigration enquiry',
      metadata: {
        source: 'website-lead-generation-wizard',
        whatsappNumber: formData.whatsappNumber.trim(),
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality.trim(),
        servicesRequired: splitList(formData.servicesRequired),
        destinationCountries: splitList(formData.destinationCountries),
        highestQualification: formData.highestQualification.trim(),
        passingYear: numberOrNull(formData.passingYear),
        university: formData.university.trim(),
        percentageOrCgpa: formData.percentageOrCgpa.trim(),
        currentCompany: formData.currentCompany.trim(),
        currentDesignation: formData.currentDesignation.trim(),
        industry: formData.industry.trim(),
        yearsOfExperience: numberOrNull(formData.yearsOfExperience),
        currentSalary: formData.currentSalary.trim(),
        relevantExperience: formData.relevantExperience.trim(),
        languageTestTaken: formData.languageTestTaken,
        overallScore: formData.overallScore.trim(),
        listeningScore: formData.listeningScore.trim(),
        readingScore: formData.readingScore.trim(),
        writingScore: formData.writingScore.trim(),
        speakingScore: formData.speakingScore.trim(),
        passportAvailable: formData.passportAvailable,
        passportExpiry: formData.passportExpiry,
        familyMaritalStatus: formData.familyMaritalStatus,
        spouseQualification: formData.spouseQualification.trim(),
        children: numberOrNull(formData.children),
        dependents: numberOrNull(formData.dependents),
        investmentBudget: formData.investmentBudget.trim(),
        applicationTimeline: formData.applicationTimeline.trim(),
        resumeUrl,
        passportDocumentUrl,
        ieltsDocumentUrl,
        educationalCertificateUrls,
        experienceLetterUrls,
        bankStatementUrl,
        additionalInformation: formData.additionalInformation.trim(),
        consentToCalls: formData.consentToCalls,
        termsAccepted: formData.termsAccepted,
      },
    };
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (!validateStep(4)) return;

    setSubmitLoading(true);
    try {
      const payload = buildPayload();
      const response = await MainApi.post(LEADS_ENDPOINT, payload, {
        skipAuth: true,
        suppressAuthRedirect: true,
      });

      setFormData(initialFormData);
      setFiles(initialFiles);
      setUploadErrors({});
      setUploadLoading(initialUploadLoading);
      setActiveStep(0);

      await Swal.fire({
        icon: 'success',
        title: 'Lead submitted',
        text: response?.data?.message || 'Your lead generation request has been submitted successfully.',
        confirmButtonColor: '#1f2a77',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Unable to submit',
        text: error?.response?.data?.message || error?.message || 'Please check the details and try again.',
        confirmButtonColor: '#1f2a77',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderSelect = (field, label, options) => (
    <FormControl fullWidth size="small" error={Boolean(errors[field])}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={formData[field]} onChange={updateField(field)}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {errors[field] && <Typography sx={{ mt: 0.5, ml: 1.75, fontSize: 12, color: '#d32f2f' }}>{errors[field]}</Typography>}
    </FormControl>
  );

  const renderField = (field, label, props = {}) => (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={formData[field]}
      onChange={updateField(field)}
      error={Boolean(errors[field])}
      helperText={errors[field]}
      sx={fieldSx()}
      {...props}
    />
  );

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <FormControl fullWidth size="small" error={Boolean(errors.categoryId)}>
            <InputLabel>Select Services Category</InputLabel>
            <Select label="Select Services Category" value={formData.categoryId} onChange={updateField('categoryId')} disabled={categoryLoading}>
              {categoryLoading && <MenuItem value="">Loading categories...</MenuItem>}
              {!categoryLoading && categories.length === 0 && <MenuItem value="">No categories found</MenuItem>}
              {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
            </Select>
            {errors.categoryId && <Typography sx={{ mt: 0.5, ml: 1.75, fontSize: 12, color: '#d32f2f' }}>{errors.categoryId}</Typography>}
          </FormControl>
          <FormControl fullWidth size="small" error={Boolean(errors.serviceId)}>
            <InputLabel>Select Service</InputLabel>
            <Select label="Select Service" value={formData.serviceId} onChange={updateField('serviceId')} disabled={!formData.categoryId || serviceLoading}>
              {!formData.categoryId && <MenuItem value="">Select category first</MenuItem>}
              {serviceLoading && <MenuItem value="">Loading services...</MenuItem>}
              {formData.categoryId && !serviceLoading && services.length === 0 && <MenuItem value="">No services found</MenuItem>}
              {services.map((service) => <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>)}
            </Select>
            {errors.serviceId && <Typography sx={{ mt: 0.5, ml: 1.75, fontSize: 12, color: '#d32f2f' }}>{errors.serviceId}</Typography>}
          </FormControl>
          {renderField('servicesRequired', 'Services Required', { placeholder: 'Permanent Residency (PR), Immigration Consultation' })}
          {renderField('destinationCountries', 'Destination Countries', { placeholder: 'Canada, Australia' })}
          {renderField('investmentBudget', 'Investment Budget')}
          {renderField('applicationTimeline', 'Application Timeline')}
        </Box>
      );
    }

    if (activeStep === 1) {
      return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {renderField('firstName', 'First Name')}
          {renderField('lastName', 'Last Name')}
          {renderField('email', 'Email', { type: 'email' })}
          {renderField('phone', 'Phone')}
          {renderField('whatsappNumber', 'WhatsApp Number')}
          {renderSelect('gender', 'Gender', selectOptions.gender)}
          {renderField('dateOfBirth', 'Date of Birth', { type: 'date', InputLabelProps: { shrink: true } })}
          {renderSelect('maritalStatus', 'Marital Status', selectOptions.maritalStatus)}
          {renderField('nationality', 'Nationality')}
          {renderField('city', 'City')}
          {renderField('state', 'State')}
          {renderField('country', 'Country')}
        </Box>
      );
    }

    if (activeStep === 2) {
      return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {renderField('highestQualification', 'Highest Qualification')}
          {renderField('passingYear', 'Passing Year', { type: 'number' })}
          {renderField('university', 'University')}
          {renderField('percentageOrCgpa', 'Percentage / CGPA')}
          {renderSelect('languageTestTaken', 'Language Test Taken', selectOptions.languageTestTaken)}
          {renderField('overallScore', 'Overall Score')}
          {renderField('listeningScore', 'Listening Score')}
          {renderField('readingScore', 'Reading Score')}
          {renderField('writingScore', 'Writing Score')}
          {renderField('speakingScore', 'Speaking Score')}
        </Box>
      );
    }

    if (activeStep === 3) {
      return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {renderField('currentCompany', 'Current Company')}
          {renderField('currentDesignation', 'Current Designation')}
          {renderField('industry', 'Industry')}
          {renderField('yearsOfExperience', 'Years Of Experience', { type: 'number' })}
          {renderField('currentSalary', 'Current Salary')}
          {renderField('relevantExperience', 'Relevant Experience')}
          {renderSelect('passportAvailable', 'Passport Available', selectOptions.passportAvailable)}
          {renderField('passportExpiry', 'Passport Expiry', { type: 'date', InputLabelProps: { shrink: true } })}
          {renderSelect('familyMaritalStatus', 'Family Marital Status', selectOptions.familyMaritalStatus)}
          {renderField('spouseQualification', 'Spouse Qualification')}
          {renderField('children', 'Children', { type: 'number' })}
          {renderField('dependents', 'Dependents', { type: 'number' })}
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <UploadField label="Resume PDF" value={files.resumeUrl} uploading={uploadLoading.resumeUrl} error={uploadErrors.resumeUrl} onChange={(value) => updateFile('resumeUrl', value, 'Resume')} />
          <UploadField label="Passport PDF" value={files.passportDocumentUrl} uploading={uploadLoading.passportDocumentUrl} error={uploadErrors.passportDocumentUrl} onChange={(value) => updateFile('passportDocumentUrl', value, 'Passport')} />
          <UploadField label="IELTS / Language Test PDF" value={files.ieltsDocumentUrl} uploading={uploadLoading.ieltsDocumentUrl} error={uploadErrors.ieltsDocumentUrl} onChange={(value) => updateFile('ieltsDocumentUrl', value, 'Language Test Certificate')} />
          <UploadField label="Bank Statement PDF" value={files.bankStatementUrl} uploading={uploadLoading.bankStatementUrl} error={uploadErrors.bankStatementUrl} onChange={(value) => updateFile('bankStatementUrl', value, 'Bank Statement')} />
          <UploadField label="Educational Certificates PDFs" multiple value={files.educationalCertificateUrls} uploading={uploadLoading.educationalCertificateUrls} error={uploadErrors.educationalCertificateUrls} onChange={(value) => updateFile('educationalCertificateUrls', value, 'Educational Certificate', true)} />
          <UploadField label="Experience Letters PDFs" multiple value={files.experienceLetterUrls} uploading={uploadLoading.experienceLetterUrls} error={uploadErrors.experienceLetterUrls} onChange={(value) => updateFile('experienceLetterUrls', value, 'Experience Letter', true)} />
        </Box>
        {errors.documents && <Typography sx={{ fontSize: 12, color: '#d32f2f' }}>{errors.documents}</Typography>}
        {renderField('additionalInformation', 'Additional Information', { multiline: true, minRows: 4 })}
        <Box>
          <FormControlLabel control={<Checkbox checked={formData.consentToCalls} onChange={updateField('consentToCalls')} />} label="I consent to calls and WhatsApp updates." />
          <FormControlLabel control={<Checkbox checked={formData.termsAccepted} onChange={updateField('termsAccepted')} />} label="I accept the terms and privacy policy." />
          {errors.termsAccepted && <Typography sx={{ fontSize: 12, color: '#d32f2f' }}>{errors.termsAccepted}</Typography>}
        </Box>
      </Box>
    );
  };

  return (
    <main className="min-h-screen bg-white px-4 py-6 pt-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-[5px] border border-slate-200 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="bg-[#1f2a77] p-5 text-white lg:min-h-[calc(100vh-128px)]">
          <h2 className="mt-3 text-2xl font-bold leading-tight">Connect with our Expert</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">
            Complete the steps and upload PDFs for resume, passport, language test, education, experience, and finance documents.
          </p>

          <div className="mt-6 grid gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const complete = activeStep > index;
              const active = activeStep === index;

              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => index <= activeStep && setActiveStep(index)}
                  className={`flex w-full items-center gap-3 rounded-[5px] border px-3 py-3 text-left transition ${
                    active ? 'border-white bg-white text-[#1f2a77]' : 'border-white/15 bg-white/10 text-white'
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? 'bg-[#1f2a77] text-white' : 'bg-white/10 text-white'}`}>
                    {complete ? <CheckCircleOutlined fontSize="small" /> : <Icon fontSize="small" />}
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] opacity-70">Step {index + 1}</span>
                    <span className="block text-sm font-semibold">{step.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          </aside>

          <section className="bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{steps[activeStep].label} Details</h2>
              </div>
              {(categoryLoading || serviceLoading) && <CircularProgress size={22} sx={{ color: '#1f2a77' }} />}
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2 overflow-visible">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const complete = activeStep > index;
                const active = activeStep === index;

                return (
                  <button
                    key={`top-${step.label}`}
                    type="button"
                    onClick={() => index <= activeStep && setActiveStep(index)}
                    className="group relative flex min-w-0 flex-col items-center gap-2"
                    aria-label={`Go to ${step.label} step`}
                  >
                    {index < steps.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`absolute left-1/2 top-5 z-0 w-full border-t-2 border-dotted ${
                          activeStep > index ? 'border-emerald-400' : 'border-slate-300'
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${
                        active
                          ? 'border-[#1f2a77] bg-[#1f2a77] text-white'
                          : complete
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-300 bg-white text-slate-500'
                      }`}
                    >
                      {complete ? <CheckCircleOutlined fontSize="small" /> : <Icon fontSize="small" />}
                    </span>
                    <span className={`truncate text-xs font-semibold ${active ? 'text-[#1f2a77]' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form className="p-4 sm:p-6 lg:p-8" onSubmit={handleSubmit}>

          {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
          {renderStep()}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBack />}
              disabled={activeStep === 0 || submitLoading}
              onClick={handleBack}
              sx={{ borderRadius: '6px', textTransform: 'none' }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                variant="contained"
                endIcon={<ArrowForward />}
                disabled={categoryLoading || serviceLoading}
                onClick={handleNext}
                sx={{ borderRadius: '6px', bgcolor: '#1f2a77', textTransform: 'none', '&:hover': { bgcolor: '#18205f' } }}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                startIcon={submitLoading ? <CircularProgress size={16} color="inherit" /> : <Send />}
                disabled={submitLoading || hasPendingUploads}
                sx={{ borderRadius: '6px', bgcolor: '#1f2a77', textTransform: 'none', '&:hover': { bgcolor: '#18205f' } }}
              >
                {submitLoading ? 'Submitting...' : 'Submit Lead'}
              </Button>
            )}
          </div>
          </form>
          </section>
        </div>
      </div>
    </main>
  );
}
