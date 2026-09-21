// components/PasswordUpdate.jsx
'use client';

import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import MainApi from '@/util/MainApi';

const accent = '#f79f03';
const deepText = '#24313f';

function getApiErrorMessage(error, fallback = 'Unable to update password') {
  const data = error?.response?.data;
  return data?.message || data?.msg || data?.error || error?.message || fallback;
}

const passwordApi = {
  updatePassword: async (payload) => {
    if (payload.currentPassword === payload.newPassword) {
      throw new Error('New password must be different from current password');
    }

    const response = await MainApi.post('/api/v1/auth/change-password', {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });

    const responsePayload = response?.data || {};
    return {
      success: responsePayload?.success !== false,
      message: responsePayload?.message || responsePayload?.msg || 'Password updated successfully',
      data: responsePayload?.data || responsePayload,
    };
  },
};

export default function PasswordUpdate() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    } else if (formData.currentPassword.length < 6) {
      newErrors.currentPassword = 'Password must be at least 6 characters';
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'For better security, use at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
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
    
    try {
      const response = await passwordApi.updatePassword(formData);
      
      if (response.success) {
        // Reset form
        setFormData({
          currentPassword: '',
          newPassword: '',
        });
        await Swal.fire({
          icon: 'success',
          title: 'Password updated',
          text: response.message || 'Password updated successfully',
          confirmButtonText: 'OK',
          confirmButtonColor: accent,
        });
      }
    } catch (err) {
      const message = getApiErrorMessage(err, err.message || 'Unable to update password');
      await Swal.fire({
        icon: 'error',
        title: 'Password update failed',
        text: message,
        confirmButtonText: 'OK',
        confirmButtonColor: accent,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
    });
    setErrors({});
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.newPassword;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: 'Weak', color: 'error.main' };
    if (strength <= 4) return { strength, label: 'Medium', color: 'warning.main' };
    return { strength, label: 'Strong', color: 'success.main' };
  };

  const passwordStrength = getPasswordStrength();
  const inputSx = {
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
          Update Password
        </Typography>
        <Box sx={{ width: 58, height: 3, bgcolor: accent, borderRadius: 999, mb: 2.5 }} />

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              mt: 1,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            }}
          >
          {/* Current Password */}
          <TextField
            fullWidth
            type={showPasswords.current ? 'text' : 'password'}
            label="Current Password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
            required
            disabled={loading}
            size="small"
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPasswords.current ? 'Hide current password' : 'Show current password'}
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                      size="small"
                    >
                      {showPasswords.current ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* New Password */}
          <TextField
            fullWidth
            type={showPasswords.new ? 'text' : 'password'}
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            required
            disabled={loading}
            size="small"
            sx={inputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPasswords.new ? 'Hide new password' : 'Show new password'}
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                      size="small"
                    >
                      {showPasswords.new ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          </Box>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <Box sx={{ maxWidth: { xs: '100%', md: '33%' } }}>
              <Typography variant="caption" sx={{ color: passwordStrength.color }}>
                Password Strength: {passwordStrength.label}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  mt: 0.5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${(passwordStrength.strength / 6) * 100}%`,
                    height: '100%',
                    bgcolor: passwordStrength.color,
                    transition: 'width 0.3s ease',
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Password Requirements */}
          <Box
            sx={{
              p: 1.5,
              bgcolor: '#fff8ec',
              borderRadius: 2,
              border: '1px solid #ffe1a8',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: deepText }}>
              Password Requirements:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <Typography component="li" variant="caption">
                At least 6 characters long
              </Typography>
              <Typography component="li" variant="caption">
                Contains uppercase and lowercase letters
              </Typography>
              <Typography component="li" variant="caption">
                Contains at least one number
              </Typography>
              <Typography component="li" variant="caption">
                For stronger password, use special characters
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              sx={{ borderColor: '#d7dde6', color: deepText }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ bgcolor: accent, '&:hover': { bgcolor: accent } }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </Box>
        </Box>
      </form>
      </Paper>
    </Box>
  );
}
