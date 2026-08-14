// app/profile/page.jsx
'use client';

import React, { useState, useRef } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Box,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';
import {
  getApiErrorMessage,
  getApiMessage,
  extractUploadedImageUrl,
  mapStoredUserToProfileForm,
  persistStoredUser,
  readStoredUserFromStorage,
} from '@/util/profileHelpers';

const accent = '#f79f03';
const deepText = '#24313f';


// Dummy API function
const dummyApi = {
  // Fetch user profile
  getUserProfile: async () => {
    const authUser = readStoredUserFromStorage();
    const mapped = mapStoredUserToProfileForm(authUser);

    if (!mapped) {
      return {
        success: false,
        message: 'No profile data found in local storage (authData).',
        data: null,
      };
    }

    return {
      success: true,
      data: mapped,
    };
  },

  // Update user profile
  updateUserProfile: async (formData) => {
    if (!formData.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    const payload = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      phone: formData.phoneNumber?.trim(),
      avatarUrl: formData.profileImageUrl || formData.profileImage || null,
    };

    const response = await MainApi.patch('/api/v1/auth/me', payload);
    const responsePayload = response?.data || {};
    const updatedUser = responsePayload?.data?.user || responsePayload?.user || responsePayload?.data || responsePayload || {};
    const normalizedUser = persistStoredUser({
      ...updatedUser,
      firstName: updatedUser.firstName || payload.firstName,
      lastName: updatedUser.lastName || payload.lastName,
      email: updatedUser.email || payload.email,
      phone: updatedUser.phone || payload.phone || payload.phoneNumber,
      phoneNumber: updatedUser.phoneNumber || payload.phoneNumber || payload.phone,
      profileImage: updatedUser.profileImage || updatedUser.avatarUrl || updatedUser.avatar_url || payload.profileImage,
      avatarUrl: updatedUser.avatarUrl || updatedUser.avatar_url || updatedUser.profileImage || payload.profileImage,
    });

    return {
      success: responsePayload?.success !== false,
      message: getApiMessage(responsePayload, 'Profile updated successfully'),
      data: normalizedUser,
    };
  },

  // Upload profile image
  uploadProfileImage: async (imageFile) => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
    uploadFormData.append('purpose', 'avatar');

    const response = await MainApi.post('/api/v1/uploads/image', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const responsePayload = response?.data || {};
    const imageUrl = extractUploadedImageUrl(responsePayload);

    if (!imageUrl) {
      throw new Error('Image upload succeeded but no image URL was returned.');
    }

    return {
      success: responsePayload?.success !== false,
      imageUrl,
      message: getApiMessage(responsePayload, 'Image uploaded successfully'),
    };
  },
};

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: null,
    profileImageUrl: null,
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  async function fetchUserProfile() {
    try {
      setFetchLoading(true);
      const response = await dummyApi.getUserProfile();
      
      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Unable to find profile data.');
      }
    } catch (err) {
      setError('Failed to load user profile');
      console.error('Error fetching profile:', err);
    } finally {
      setFetchLoading(false);
    }
  }

  // Fetch user data on component mount
  React.useEffect(() => {
    queueMicrotask(fetchUserProfile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, profileImage: 'Please upload a valid image file' }));
        return;
      }

      try {
        setLoading(true);
        const response = await dummyApi.uploadProfileImage(file);

        if (response.success) {
          const previewUrl = URL.createObjectURL(file);
          setFormData((prev) => ({
            ...prev,
            profileImage: previewUrl,
            profileImageUrl: response.imageUrl,
          }));
          setErrors((prev) => ({ ...prev, profileImage: undefined }));
        }
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to upload image'));
        console.error('Error uploading image:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null, profileImageUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await dummyApi.updateUserProfile(formData);

      if (response.success) {
        setError(null);
        await Swal.fire({
          icon: 'success',
          title: 'Profile updated',
          text: response.message || 'Profile updated successfully',
          confirmButtonText: 'OK',
          confirmButtonColor: accent,
        });
      }
    } catch (err) {
      const message = err.message || 'Failed to save profile';
      setError(message);
      await Swal.fire({
        icon: 'error',
        title: 'Profile update failed',
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: accent,
      });
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchUserProfile(); // Reset to original data
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (fetchLoading) {
    return (
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ p: 2.5, textAlign: 'center', borderRadius: 2, border: '1px solid #edf0f4', boxShadow: '0 8px 18px rgba(31,45,61,0.05)' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
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
          User Profile
        </Typography>
        <Box sx={{ width: 58, height: 3, bgcolor: accent, borderRadius: 999, mb: 2.5 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Profile Image Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 0.75,
              mb: 2.5,
              pb: 1,
            }}
          >
            <Box sx={{ width: 140, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ position: 'relative', width: 104, height: 104, flexShrink: 0 }}>
                <Avatar
                  src={formData.profileImage || formData.profileImageUrl || undefined}
                  alt={`${formData.firstName} ${formData.lastName}`}
                  sx={{
                    width: 104,
                    height: 104,
                    bgcolor: accent,
                    fontSize: '2.1rem',
                    fontWeight: 600,
                  }}
                >
                  {!formData.profileImage &&
                    `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`}
                </Avatar>
                <IconButton
                  component="label"
                  aria-label="Upload profile photo"
                  disabled={loading}
                  sx={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: 34,
                    height: 34,
                    bgcolor: accent,
                    color: '#fff',
                    border: '2px solid #fff',
                    boxShadow: '0 6px 14px rgba(31,45,61,0.16)',
                    '&:hover': { bgcolor: accent },
                  }}
                >
                  <PhotoCamera sx={{ fontSize: 18 }} />
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </IconButton>
                {formData.profileImage && (
                  <IconButton
                    aria-label="Remove profile photo"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: 28,
                      height: 28,
                      bgcolor: '#d92d20',
                      color: '#fff',
                      border: '2px solid #fff',
                      boxShadow: '0 6px 14px rgba(31,45,61,0.16)',
                      '&:hover': { bgcolor: '#b42318' },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
              <Typography sx={{ color: deepText, fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' }}>
                Profile picture
              </Typography>
            </Box>

            {errors.profileImage && (
              <Typography color="error" variant="caption" sx={{ display: 'block' }}>
                {errors.profileImage}
              </Typography>
            )}
          </Box>

          {/* Form Fields - 3 columns on medium screens and above */}
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              mt: 1,
              mb: 0.5,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            }}
          >
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              disabled={loading}
              size="small"
              sx={{
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
              }}
            />

            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              disabled={loading}
              size="small"
              sx={{
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
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              disabled={loading}
              size="small"
              sx={{
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
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2.5,
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
