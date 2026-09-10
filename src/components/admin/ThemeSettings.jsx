// app/theme-settings/page.jsx
'use client';

import React, { useState, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Language,
  ImageOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MainApi from '@/util/MainApi';

const accent = '#f79f03';
const deepText = '#24313f';

const textFieldSx = {
  '& .MuiInputBase-root': {
    minHeight: '42px',
  },
  '& .MuiInputBase-input': {
    py: 1.15,
  },
  '& .MuiOutlinedInput-root.Mui-focused fieldset': {
    borderColor: accent,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: accent,
  },
};

const FileUploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 140,
  width: 220,
  borderRadius: 14,
  transition: 'all 160ms ease',
  '&:hover': {
    borderColor: accent,
    backgroundColor: '#fff8ed',
  },
}));

// Reads the logged-in user's data from localStorage under the "authData" key,
// in case theme settings need to be scoped per vendor/tenant.
function readAuthDataFromStorage() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('authData');
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.user || parsed?.data?.user || parsed?.data || parsed;
  } catch (err) {
    console.error('Failed to parse authData from localStorage:', err);
    return null;
  }
}

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.error || error?.message || fallback;
}

const themeApi = {
  getThemeSettings: async () => {
    const response = await MainApi.get('/api/v1/theme/settings');
    const payload = response?.data || {};
    const data = payload?.data || payload || {};

    return {
      success: response?.status >= 200 && response?.status < 300 && payload?.success !== false,
      data: {
        websiteName: data.websiteName || data.website_name || '',
        headerLogo: data.headerLogo || data.header_logo || null,
        sidebarLogo: data.sidebarLogo || data.sidebar_logo || null,
        faviconIcon: data.faviconIcon || data.favicon_icon || null,
      },
    };
  },

  updateThemeSettings: async (formData) => {
    if (!formData.websiteName.trim()) {
      throw new Error('Website name is required');
    }

    const payload = {
      websiteName: formData.websiteName.trim(),
      headerLogo: formData.headerLogo?.url || formData.headerLogo || null,
      sidebarLogo: formData.sidebarLogo?.url || formData.sidebarLogo || null,
      faviconIcon: formData.faviconIcon?.url || formData.faviconIcon || null,
    };

    const response = await MainApi.post('/api/v1/theme/settings', payload);
    const responsePayload = response?.data || {};

    return {
      success: response?.status >= 200 && response?.status < 300 && responsePayload?.success !== false,
      message: responsePayload?.message || 'Theme settings updated successfully',
      data: payload,
    };
  },

  uploadThemeImage: async (file, purpose) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    const response = await MainApi.post('/api/v1/uploads/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responsePayload = response?.data || {};
    const imageUrl = responsePayload?.data?.url || responsePayload?.url || responsePayload?.imageUrl || responsePayload?.image_url || responsePayload?.data?.imageUrl || responsePayload?.data?.image_url || null;

    if (!imageUrl) {
      throw new Error('Image upload succeeded but no image URL was returned.');
    }

    return {
      success: response?.status >= 200 && response?.status < 300 && responsePayload?.success !== false,
      url: imageUrl,
      purpose,
      publicId: responsePayload?.data?.publicId || responsePayload?.publicId || null,
    };
  },
};

function LogoUploadField({ label, hint, previewUrl, uploading, onUpload, onRemove, inputId }) {
  return (
    <Box>
      <Typography sx={{ color: '#334155', fontSize: 13, fontWeight: 600, mb: 0.8 }}>{label}</Typography>
      <FileUploadBox>
        <input
          accept="image/*"
          type="file"
          id={inputId}
          onChange={onUpload}
          style={{ display: 'none' }}
        />
        <label htmlFor={inputId} style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewUrl ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 12 }}>
              <Box component="img" src={previewUrl} alt={label} sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
              {uploading && (
                <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.7)' }}>
                  <CircularProgress size={22} />
                </Box>
              )}
                <IconButton
                  size="small"
                  onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove();
                }}
                disabled={uploading}
                sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', p: 0.35, '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.6 }}>
              <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: '#fff4de', color: accent, display: 'grid', placeItems: 'center' }}>
                {uploading ? <CircularProgress size={18} /> : <ImageOutlined fontSize="small" />}
              </Box>
              <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: deepText }}>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 10, textAlign: 'center', px: 0.5 }}>
                {hint}
              </Typography>
            </Box>
          )}
        </label>
      </FileUploadBox>
    </Box>
  );
}

const EMPTY_FORM_DATA = {
  websiteName: '',
  headerLogo: null, // { url, publicId }
  sidebarLogo: null,
  faviconIcon: null,
};

export default function ThemeSettings() {
  const [formData, setFormData] = useState(EMPTY_FORM_DATA);

  const [headerLogoPreview, setHeaderLogoPreview] = useState('');
  const [sidebarLogoPreview, setSidebarLogoPreview] = useState('');
  const [faviconPreview, setFaviconPreview] = useState('');

  const [headerLogoUploading, setHeaderLogoUploading] = useState(false);
  const [sidebarLogoUploading, setSidebarLogoUploading] = useState(false);
  const [faviconUploading, setFaviconUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const headerLogoInputRef = useRef(null);
  const sidebarLogoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  async function fetchThemeSettings() {
    try {
      setFetchLoading(true);
      setError(null);

      // Keep authData handy here in case the real endpoint needs a vendor/tenant id.
      readAuthDataFromStorage();

      const response = await themeApi.getThemeSettings();

      if (response.success) {
        const data = response.data;
        setFormData({
          websiteName: data.websiteName || '',
          headerLogo: data.headerLogo || null,
          sidebarLogo: data.sidebarLogo || null,
          faviconIcon: data.faviconIcon || null,
        });
        setHeaderLogoPreview(data.headerLogo?.url || '');
        setSidebarLogoPreview(data.sidebarLogo?.url || '');
        setFaviconPreview(data.faviconIcon?.url || '');
      } else {
        setError('Unable to load theme settings.');
      }
    } catch (err) {
      setError('Failed to load theme settings');
      console.error('Error fetching theme settings:', err);
    } finally {
      setFetchLoading(false);
    }
  }

  React.useEffect(() => {
    queueMicrotask(fetchThemeSettings);
  }, []);

  const handleWebsiteNameChange = (e) => {
    setFormData((prev) => ({ ...prev, websiteName: e.target.value }));
    if (errors.websiteName) {
      setErrors((prev) => ({ ...prev, websiteName: undefined }));
    }
  };

  const makeImageUploadHandler = ({ purpose, setPreview, setUploading, field }) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [field]: 'Image size should be less than 5MB' }));
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [field]: 'Please upload a valid image file' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    setFormData((prev) => ({ ...prev, [field]: null }));

    try {
      const response = await themeApi.uploadThemeImage(file, purpose);
      if (!response?.url) throw new Error('Unexpected upload response shape.');

      setFormData((prev) => ({ ...prev, [field]: { url: response.url, publicId: response.publicId || null } }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (err) {
      setPreview('');
      setFormData((prev) => ({ ...prev, [field]: null }));
      setError(getApiErrorMessage(err, `Failed to upload ${field}`));
      console.error(`Error uploading ${field}:`, err);
    } finally {
      setUploading(false);
    }
  };

  const handleHeaderLogoUpload = makeImageUploadHandler({
    purpose: 'theme-header-logo',
    setPreview: setHeaderLogoPreview,
    setUploading: setHeaderLogoUploading,
    field: 'headerLogo',
  });

  const handleSidebarLogoUpload = makeImageUploadHandler({
    purpose: 'theme-sidebar-logo',
    setPreview: setSidebarLogoPreview,
    setUploading: setSidebarLogoUploading,
    field: 'sidebarLogo',
  });

  const handleFaviconUpload = makeImageUploadHandler({
    purpose: 'theme-favicon',
    setPreview: setFaviconPreview,
    setUploading: setFaviconUploading,
    field: 'faviconIcon',
  });

  const removeHeaderLogo = () => {
    setFormData((prev) => ({ ...prev, headerLogo: null }));
    setHeaderLogoPreview('');
    if (headerLogoInputRef.current) headerLogoInputRef.current.value = '';
  };

  const removeSidebarLogo = () => {
    setFormData((prev) => ({ ...prev, sidebarLogo: null }));
    setSidebarLogoPreview('');
    if (sidebarLogoInputRef.current) sidebarLogoInputRef.current.value = '';
  };

  const removeFavicon = () => {
    setFormData((prev) => ({ ...prev, faviconIcon: null }));
    setFaviconPreview('');
    if (faviconInputRef.current) faviconInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.websiteName.trim()) {
      newErrors.websiteName = 'Website name is required';
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (headerLogoUploading || sidebarLogoUploading || faviconUploading) {
      setError('Please wait until all images finish uploading.');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await themeApi.updateThemeSettings(formData);

      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to save theme settings');
      console.error('Error saving theme settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchThemeSettings();
    setErrors({});
    if (headerLogoInputRef.current) headerLogoInputRef.current.value = '';
    if (sidebarLogoInputRef.current) sidebarLogoInputRef.current.value = '';
    if (faviconInputRef.current) faviconInputRef.current.value = '';
  };

  if (fetchLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #edf0f4', boxShadow: '0 8px 18px rgba(31,45,61,0.05)' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading theme settings...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.25, sm: 1.5, md: 2 },
          borderRadius: 2,
          border: '1px solid #edf0f4',
          boxShadow: '0 8px 18px rgba(31,45,61,0.05)',
          bgcolor: '#fff',
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{ mb: 0.75, fontWeight: 700, color: deepText, fontSize: 18 }}
        >
          Theme Settings
        </Typography>
        <Box sx={{ width: 58, height: 3, bgcolor: accent, borderRadius: 999, mb: 2.5 }} />

        {saveSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Theme settings updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Website Name */}
          <Box sx={{ mb: 3, maxWidth: 420 }}>
            <TextField
              fullWidth
              label="Website Name"
              name="websiteName"
              value={formData.websiteName}
              onChange={handleWebsiteNameChange}
              error={!!errors.websiteName}
              helperText={errors.websiteName}
              required
              disabled={loading}
              size="small"
            />
          </Box>

          {/* Logos & Favicon */}
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
            }}
          >
            <LogoUploadField
              label="Header Logo"
              hint="Recommended: transparent PNG, wide format"
              previewUrl={headerLogoPreview}
              uploading={headerLogoUploading}
              onUpload={handleHeaderLogoUpload}
              onRemove={removeHeaderLogo}
              inputId="header-logo-upload"
            />

            <LogoUploadField
              label="Sidebar Logo"
              hint="Recommended: transparent PNG, square/compact"
              previewUrl={sidebarLogoPreview}
              uploading={sidebarLogoUploading}
              onUpload={handleSidebarLogoUpload}
              onRemove={removeSidebarLogo}
              inputId="sidebar-logo-upload"
            />

            <LogoUploadField
              label="Favicon Icon"
              hint="Recommended: 32x32 or 64x64 PNG/ICO"
              previewUrl={faviconPreview}
              uploading={faviconUploading}
              onUpload={handleFaviconUpload}
              onRemove={removeFavicon}
              inputId="favicon-upload"
            />
          </Box>

          {(errors.headerLogo || errors.sidebarLogo || errors.faviconIcon) && (
            <Box sx={{ mt: 1.5 }}>
              {errors.headerLogo && (
                <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                  Header Logo: {errors.headerLogo}
                </Typography>
              )}
              {errors.sidebarLogo && (
                <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                  Sidebar Logo: {errors.sidebarLogo}
                </Typography>
              )}
              {errors.faviconIcon && (
                <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                  Favicon Icon: {errors.faviconIcon}
                </Typography>
              )}
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              disabled={loading}
              sx={{ borderColor: '#d7dde6', color: deepText }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={loading}
              sx={{ bgcolor: accent, '&:hover': { bgcolor: accent } }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}