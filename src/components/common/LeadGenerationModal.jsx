'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Select,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUploadOutlined,
  Send as SendIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';
import { getLeadDocumentPayload, leadDocumentTypeOptions, uploadLeadDocument } from '@/util/leadDocuments';
import LeadModalImage from '@/images/lead-generation-modal-v2.png';
import SiteLogo from '@/images/site-logo.png';

const CATEGORY_ENDPOINT = '/service-categories';
const LEADS_ENDPOINT = '/leads';

const initialFormData = {
  categoryId: '',
  serviceId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'India',
  state: '',
  city: '',
  message: '',
};

const initialLeadDocument = {
  file: null,
  name: 'Resume',
};

function getFirstArray(...values) {
  return values.find((value) => Array.isArray(value) && value.length > 0) || [];
}

function getCategoryId(category) {
  return String(category?.serviceCategoryId || category?.categoryId || category?.id || category?._id || category?.uuid || '');
}

function getCategoryName(category) {
  return category?.name || category?.categoryName || category?.title || 'Unnamed Category';
}

function getServiceId(service) {
  if (typeof service === 'string') return '';
  return String(service?.serviceId || service?.id || service?._id || service?.uuid || '');
}

function getServiceName(service) {
  if (typeof service === 'string') return service;
  return service?.name || service?.serviceName || service?.title || 'Unnamed Service';
}

function getCategoryServices(category) {
  return getFirstArray(
    category?.services,
    category?.serviceItems,
    category?.children,
    category?.data?.services
  ).map((service) => ({
    id: getServiceId(service),
    name: getServiceName(service),
    raw: service,
  })).filter((service) => service.id && service.name);
}

function normalizeServices(responseData) {
  const data = responseData?.data ?? responseData ?? {};
  const nestedData = data?.data ?? data ?? {};
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

  return serviceList.map((service) => ({
    id: getServiceId(service),
    name: getServiceName(service),
    raw: service,
  })).filter((service) => service.id && service.name);
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

function normalizeCategories(responseData) {
  const data = responseData?.data ?? responseData ?? {};
  const categories = getFirstArray(
    data,
    data?.data,
    data?.items,
    data?.results,
    data?.categories,
    data?.serviceCategories,
    data?.data?.items,
    data?.data?.results,
    data?.data?.categories,
    data?.data?.serviceCategories
  );

  return dedupeByIdOrName(categories.map((category) => ({
    id: getCategoryId(category),
    name: getCategoryName(category),
    services: dedupeByIdOrName(getCategoryServices(category)),
    raw: category,
  })).filter((category) => category.id && category.name));
}

function validateForm(formData) {
  const nextErrors = {};

  if (!formData.categoryId) nextErrors.categoryId = 'Select service category';
  if (!formData.serviceId) nextErrors.serviceId = 'Select service';
  if (!formData.firstName.trim()) nextErrors.firstName = 'First name is required';
  if (!formData.lastName.trim()) nextErrors.lastName = 'Last name is required';
  if (!formData.email.trim()) {
    nextErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    nextErrors.email = 'Enter a valid email';
  }
  if (!formData.phone.trim()) nextErrors.phone = 'Phone is required';
  if (!formData.country.trim()) nextErrors.country = 'Country is required';
  if (!formData.state.trim()) nextErrors.state = 'State is required';
  if (!formData.city.trim()) nextErrors.city = 'City is required';

  return nextErrors;
}

export default function LeadGenerationModal({ open, onClose }) {
  const [formData, setFormData] = useState(initialFormData);
  const [leadDocument, setLeadDocument] = useState(initialLeadDocument);
  const [categories, setCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState('');

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === formData.categoryId),
    [categories, formData.categoryId]
  );
  const services = selectedCategory?.services || [];
  const isRequiredFormComplete = useMemo(() => (
    Boolean(
      formData.categoryId
      && formData.serviceId
      && formData.firstName.trim()
      && formData.lastName.trim()
      && formData.email.trim()
      && formData.phone.trim()
      && formData.country.trim()
      && formData.state.trim()
      && formData.city.trim()
    )
  ), [formData]);

  useEffect(() => {
    if (!open || categories.length > 0) return;

    let isMounted = true;

    async function loadCategories() {
      setCategoryLoading(true);
      setLoadError('');

      try {
        const response = await MainApi.get(CATEGORY_ENDPOINT, {
          skipAuth: true,
          suppressAuthRedirect: true,
        });

        if (isMounted) {
          setCategories(normalizeCategories(response?.data));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error?.response?.data?.message || error?.message || 'Unable to load service categories.');
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoryLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [categories.length, open]);

  const fetchCategoryServices = async (categoryId) => {
    const category = categories.find((item) => item.id === categoryId);

    if (!category) return;

    setServiceLoading(true);
    try {
      const response = await MainApi.get(`${CATEGORY_ENDPOINT}/${categoryId}`, {
        skipAuth: true,
        suppressAuthRedirect: true,
      });
      const normalized = normalizeCategories(response?.data);
      const detailCategory = normalized[0];
      const responseServices = normalizeServices(response?.data);
      const nextServices = detailCategory?.services?.length > 0
        ? detailCategory.services
        : responseServices.length > 0
          ? responseServices
          : category.services;

      setCategories((current) => current.map((item) => (
        item.id === categoryId ? { ...item, services: nextServices } : item
      )));
    } catch {
      setCategories((current) => current.map((item) => (
        item.id === categoryId ? { ...item, services: [] } : item
      )));
    } finally {
      setServiceLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setFormData((current) => ({
      ...current,
      [field]: value,
      ...(field === 'categoryId' ? { serviceId: '' } : {}),
    }));

    setErrors((current) => ({ ...current, [field]: '' }));

    if (field === 'categoryId' && value) {
      fetchCategoryServices(value);
    }
  };

  const handleDocumentChange = (field) => (event) => {
    const value = field === 'file' ? event.target.files?.[0] || null : event.target.value;
    setLeadDocument((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (submitLoading) return;
    onClose?.();
  };

  const handleDialogClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
    handleClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitLoading(true);
    try {
      const documentUrl = await uploadLeadDocument(leadDocument.file, leadDocument.name);
      const documentPayload = getLeadDocumentPayload(leadDocument.name, documentUrl);
      const payload = {
        categoryId: formData.categoryId,
        serviceId: formData.serviceId,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        state: formData.state.trim(),
        city: formData.city.trim(),
        message: formData.message.trim(),
        ...documentPayload,
        metadata: {
          source: 'website',
          ...(documentUrl ? { documentName: leadDocument.name } : {}),
        },
      };

      const response = await MainApi.post(LEADS_ENDPOINT, payload, {
        skipAuth: true,
        suppressAuthRedirect: true,
      });

      setFormData(initialFormData);
      setLeadDocument(initialLeadDocument);
      setErrors({});
      onClose?.();

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response?.data?.message || 'Your enquiry has been submitted successfully.',
        confirmButtonColor: '#1f2a77',
        customClass: {
          container: 'lead-modal-swal-container',
        },
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.response?.data?.message || error?.message || 'Unable to submit your enquiry.',
        confirmButtonColor: '#1f2a77',
        customClass: {
          container: 'lead-modal-swal-container',
        },
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        .lead-modal-swal-container {
          z-index: 2500 !important;
        }
      `}</style>
      <Dialog
        open={open}
        onClose={handleDialogClose}
        disableEscapeKeyDown
        maxWidth={false}
        BackdropProps={{
          sx: {
            backdropFilter: 'blur(18px)',
            backgroundColor: 'rgba(0, 0, 0, 0.86)',
          },
        }}
        PaperProps={{
          sx: {
            width: { xs: '94vw', md: 900 },
            maxWidth: 900,
            m: 0,
            borderRadius: '10px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Button
            onClick={handleClose}
            disabled={submitLoading}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 4,
              minWidth: 0,
              width: 34,
              height: 34,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.92)',
              color: '#172033',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
              '&:hover': { bgcolor: '#fff' },
            }}
            aria-label="Close lead form"
          >
            <CloseIcon fontSize="small" />
          </Button>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              bgcolor: '#fff',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: { xs: 'none', md: 'block' },
                minHeight: 520,
                bgcolor: '#eef3ff',
                overflow: 'hidden',
              }}
            >
              <Image
                src={LeadModalImage}
                alt="Immify lead generation"
                fill
                sizes="450px"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(90deg, rgba(31,42,119,0.88) 0%, rgba(31,42,119,0.56) 42%, rgba(31,42,119,0.08) 100%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 18,
                  left: 18,
                  zIndex: 2,
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 24px rgba(15,23,42,0.18)',
                }}
              >
                <Image
                  src={SiteLogo}
                  alt="Immify"
                  width={50}
                  height={50}
                  style={{ width: 50, height: 50, objectFit: 'contain' }}
                />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: 106,
                  left: 18,
                  zIndex: 2,
                  width: '58%',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 1.4,
                }}
              >
                {[
                  { label: 'Matched', value: 'Leads' },
                  { label: 'Verified', value: 'Services' },
                  { label: 'Quick', value: 'Response' },
                  { label: 'Clear', value: 'Steps' },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      minHeight: 58,
                      border: '1px solid rgba(255,255,255,0.22)',
                      bgcolor: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '9px',
                      px: 1,
                      py: 0.9,
                      color: '#fff',
                    }}
                  >
                    <Typography sx={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.68)' }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ mt: 0.25, fontSize: 12, fontWeight: 800, lineHeight: 1.25, color: 'rgba(255,255,255,0.94)' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '72%',
                  p: 3,
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>
                  Immify Lead Support
                </Typography>
                <Typography sx={{ mt: 1, fontSize: 25, lineHeight: 1.18, fontWeight: 800 }}>
                  Get matched with the right consultant.
                </Typography>
                <Box sx={{ mt: 2, display: 'grid', gap: 1 }}>
                  {['Verified service categories', 'Quick enquiry routing', 'Clear next steps'].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="span"
                        sx={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          bgcolor: '#fff',
                          color: '#1f2a77',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 900,
                          lineHeight: 1,
                        }}
                      >
                        ✓
                      </Box>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                p: { xs: 2, sm: 3 },
                pt: { xs: 3.5, sm: 4.5 },
                background: 'linear-gradient(90deg, rgba(31,42,119,0.24) 0%, rgba(41,70,145,0.14) 22%, rgba(239,244,255,0.92) 58%, #ffffff 100%)',
              }}
            >
              <Box sx={{ pr: 4, pb: 2.5, borderBottom: '1px solid #e2e8f0' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 22, color: '#172033' }}>
                  Request a Consultation
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, fontSize: 14.5 }}>
                  Select your service and tell us where you need support.
                </Typography>
              </Box>

              {loadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {loadError}
                </Alert>
              )}

              <Box
                component="form"
                id="lead-generation-form"
                onSubmit={handleSubmit}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                  columnGap: 1.5,
                  rowGap: 1.6,
                  mt: 2.5,
                }}
              >
                <FormControl fullWidth size="small" error={!!errors.categoryId}>
                  <InputLabel id="lead-category-label">Select Services Category</InputLabel>
                  <Select
                    labelId="lead-category-label"
                    label="Select Services Category"
                    value={formData.categoryId}
                    onChange={handleChange('categoryId')}
                    disabled={categoryLoading}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.categoryId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.categoryId}
                    </Typography>
                  )}
                </FormControl>

                <FormControl fullWidth size="small" error={!!errors.serviceId}>
                  <InputLabel id="lead-service-label">Select Service</InputLabel>
                  <Select
                    labelId="lead-service-label"
                    label="Select Service"
                    value={formData.serviceId}
                    onChange={handleChange('serviceId')}
                    disabled={!formData.categoryId || categoryLoading || serviceLoading || services.length === 0}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.serviceId}
                    </Typography>
                  )}
                  {formData.categoryId && serviceLoading && (
                    <Typography variant="caption" sx={{ mt: 0.5, ml: 1.75, color: '#64748b' }}>
                      Loading services...
                    </Typography>
                  )}
                  {formData.categoryId && !serviceLoading && services.length === 0 && (
                    <Typography variant="caption" sx={{ mt: 0.5, ml: 1.75, color: '#64748b' }}>
                      No services found for this category.
                    </Typography>
                  )}
                </FormControl>

                <TextField fullWidth size="small" label="First Name" value={formData.firstName} onChange={handleChange('firstName')} error={!!errors.firstName} helperText={errors.firstName} />
                <TextField fullWidth size="small" label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} error={!!errors.lastName} helperText={errors.lastName} />
                <TextField fullWidth size="small" label="Email" value={formData.email} onChange={handleChange('email')} error={!!errors.email} helperText={errors.email} />
                <TextField fullWidth size="small" label="Phone" value={formData.phone} onChange={handleChange('phone')} error={!!errors.phone} helperText={errors.phone} />
                <TextField fullWidth size="small" label="Country" value={formData.country} onChange={handleChange('country')} error={!!errors.country} helperText={errors.country} />
                <TextField fullWidth size="small" label="State" value={formData.state} onChange={handleChange('state')} error={!!errors.state} helperText={errors.state} />
                <TextField fullWidth size="small" label="City" value={formData.city} onChange={handleChange('city')} error={!!errors.city} helperText={errors.city} />
                <TextField
                  fullWidth
                  size="small"
                  label="Message (Optional)"
                  value={formData.message}
                  onChange={handleChange('message')}
                  error={!!errors.message}
                  helperText={errors.message}
                />
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Document Name"
                  value={leadDocument.name}
                  onChange={handleDocumentChange('name')}
                >
                  {leadDocumentTypeOptions.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadOutlined />}
                  sx={{
                    minHeight: 40,
                    justifyContent: 'flex-start',
                    borderColor: '#cbd5e1',
                    color: '#1f2a77',
                    textTransform: 'none',
                  }}
                >
                  {leadDocument.file ? leadDocument.file.name : 'Upload Document'}
                  <input
                    hidden
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleDocumentChange('file')}
                  />
                </Button>
              </Box>

              <Box sx={{ mt: 2.25, pt: 1.75, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  type="submit"
                  form="lead-generation-form"
                  variant="contained"
                  disabled={submitLoading || categoryLoading || !isRequiredFormComplete}
                  startIcon={submitLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                  sx={{ bgcolor: '#1f2a77', '&:hover': { bgcolor: '#18205f' }, textTransform: 'none' }}
                >
                  {submitLoading ? 'Submitting...' : 'Submit Enquiry'}
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
