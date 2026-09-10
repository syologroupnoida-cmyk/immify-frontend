import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  Link,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import SiteLogo from '@/images/site-logo.png';
import SignUpImage from '@/images/agent-login-img.png';
import MainApi from '@/util/MainApi';
import { getKycStatus, getPostLoginPath, normalizeRole, shouldCompleteKyc } from '@/util/authRouting';
import { requestGoogleIdToken } from '@/util/googleAuth';
import { getApiErrorMessage } from '@/util/profileHelpers';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a56db',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const reviewMessage = 'Your application is under review. We will email you once your account is approved.';
const DASHBOARD_KYC_COMPLETE_STATUSES = new Set([
  'approved',
  'approved_by_admin',
  'completed',
  'complete',
  'verified',
  'true',
]);

function isReviewMessage(message = '') {
  const normalizedMessage = String(message).toLowerCase();
  return normalizedMessage.includes('under review') ||
    normalizedMessage.includes('account is approved') ||
    normalizedMessage.includes('application is under review');
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!router.isReady || router.query.kycSubmitted !== '1') return;

    Swal.fire({
      icon: 'info',
      title: 'Application Under Review',
      text: reviewMessage,
      confirmButtonColor: '#1a56db',
    });

    router.replace('/agent/login', undefined, { shallow: true });
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFirstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

  const isDashboardKycComplete = (payload, user) => {
    const data = payload?.data || {};
    const vendorProfile = user?.vendorProfile || data?.vendorProfile || data?.user?.vendorProfile || {};
    const kyc = user?.kyc || user?.kycDetails || user?.vendorKyc || vendorProfile?.kyc || data?.kyc || data?.vendorKyc || payload?.kyc || {};
    const status = String(getKycStatus(payload, user)).trim().toLowerCase();

    return DASHBOARD_KYC_COMPLETE_STATUSES.has(status) || [
      user?.kycCompleted,
      user?.isKycCompleted,
      user?.kycVerified,
      user?.isKycVerified,
      user?.hasCompletedKyc,
      vendorProfile?.kycCompleted,
      vendorProfile?.isKycCompleted,
      vendorProfile?.kycVerified,
      vendorProfile?.isKycVerified,
      vendorProfile?.hasCompletedKyc,
      kyc?.completed,
      kyc?.isCompleted,
      kyc?.verified,
      kyc?.isVerified,
      data?.kycCompleted,
      data?.isKycCompleted,
      data?.kycVerified,
      data?.isKycVerified,
      data?.hasCompletedKyc,
      payload?.kycCompleted,
      payload?.isKycCompleted,
      payload?.kycVerified,
      payload?.isKycVerified,
      payload?.hasCompletedKyc,
    ].some((value) => value === true || value === 1 || String(value).trim().toLowerCase() === 'true');
  };

  const persistAuthSession = (payload) => {
    if (typeof window === 'undefined') return { role: 'agent', user: {} };

    const data = payload?.data || payload || {};
    const tokenPayload = data?.tokens || payload?.tokens || {};
    const user = data?.user || payload?.user || data?.profile || payload?.profile || {};
    const vendorType = getFirstValue(user?.vendorType, user?.vendor_type, data?.vendorType, data?.vendor_type, payload?.vendorType, payload?.vendor_type);
    const rawRole = getFirstValue(user?.role, user?.userRole, user?.roleName, data?.role, payload?.role, 'agent');
    const role = normalizeRole(rawRole) === 'partner' && String(vendorType || '').toUpperCase() === 'CONSULTANCY'
      ? 'agent'
      : normalizeRole(rawRole || 'agent');
    const accessToken = getFirstValue(
      data?.accessToken,
      data?.access_token,
      tokenPayload?.accessToken,
      tokenPayload?.access_token,
      payload?.accessToken,
      payload?.access_token
    );
    const refreshToken = getFirstValue(
      data?.refreshToken,
      data?.refresh_token,
      tokenPayload?.refreshToken,
      tokenPayload?.refresh_token,
      payload?.refreshToken,
      payload?.refresh_token
    );
    const refreshExpiresAt = getFirstValue(
      data?.refreshExpiresAt,
      data?.refresh_expires_at,
      tokenPayload?.refreshExpiresAt,
      tokenPayload?.refresh_expires_at,
      payload?.refreshExpiresAt,
      payload?.refresh_expires_at
    );
    const kycStatus = String(getKycStatus(payload, user) || '').trim();
    const dashboardKycComplete = isDashboardKycComplete(payload, user);

    window.localStorage.setItem('isAuthenticated', 'true');
    window.localStorage.setItem('authData', JSON.stringify(payload));
    window.localStorage.setItem('userRole', role);

    if (user && typeof user === 'object') {
      window.localStorage.setItem('userData', JSON.stringify({ ...user, role, vendorType: vendorType || user?.vendorType }));
      window.localStorage.setItem('UserData', JSON.stringify({ ...user, role, vendorType: vendorType || user?.vendorType }));
    }

    if (accessToken) window.localStorage.setItem('accessToken', accessToken);
    if (refreshToken) window.localStorage.setItem('refreshToken', refreshToken);
    if (refreshExpiresAt) window.localStorage.setItem('refreshExpiresAt', refreshExpiresAt);

    document.cookie = 'tripz_auth=true; path=/; SameSite=Lax';
    document.cookie = `tripz_role=${role}; path=/; SameSite=Lax`;
    document.cookie = `tripz_kyc=${dashboardKycComplete ? 'true' : 'false'}; path=/; SameSite=Lax`;
    document.cookie = `tripz_kyc_status=${encodeURIComponent(kycStatus || (dashboardKycComplete ? 'completed' : 'pending'))}; path=/; SameSite=Lax`;
    if (vendorType) document.cookie = `tripz_vendor_type=${vendorType}; path=/; SameSite=Lax`;
    window.dispatchEvent(new Event('tripz-auth-change'));

    return { role, user: { ...user, role, vendorType } };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await MainApi.post('/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
      }, { skipAuth: true });
      const payload = response?.data || {};
      const { role, user } = persistAuthSession(payload);
      const redirectPath = getPostLoginPath(role, payload, user);

      if (shouldCompleteKyc(role, payload, user)) {
        await Swal.fire({
          icon: 'info',
          title: 'Complete KYC first',
          text: 'Your KYC is pending. Please complete KYC to access your dashboard.',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#1a56db',
        });
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 900,
        });
      }
      await router.push(redirectPath);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Login failed. Please check your email and password.');

      if (isReviewMessage(message)) {
        await Swal.fire({
          icon: 'error',
          title: 'Application Under Review',
          text: reviewMessage,
          confirmButtonColor: '#1a56db',
        });
        setSubmitError('');
        return;
      }

      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    setSubmitError('');

    try {
      const token = await requestGoogleIdToken();
      const response = await MainApi.post('/auth/google/login', {
        token,
        role: 'VENDOR',
      }, { skipAuth: true });
      const payload = response?.data || {};
      const { role, user } = persistAuthSession(payload);
      const redirectPath = getPostLoginPath(role, payload, user);

      if (shouldCompleteKyc(role, payload, user)) {
        await Swal.fire({
          icon: 'info',
          title: 'Complete KYC first',
          text: 'Your KYC is pending. Please complete KYC to access your dashboard.',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#1a56db',
        });
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Login successful',
          showConfirmButton: false,
          timer: 900,
        });
      }
      await router.push(redirectPath);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Google login failed. Please try again.');

      if (isReviewMessage(message)) {
        await Swal.fire({
          icon: 'error',
          title: 'Application Under Review',
          text: reviewMessage,
          confirmButtonColor: '#1a56db',
        });
        setSubmitError('');
        return;
      }

      setSubmitError(message);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          bgcolor: '#f0f4f8',
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            width: '100%',
            maxWidth: '100%',
            borderRadius: 0,
            overflow: 'hidden',
            minHeight: '100vh',
          }}
        >
          {/* ========== LEFT SIDE ========== */}
          <Box
            sx={{
              flex: 1.3,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 5,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src={SignUpImage}
              alt="Login Background"
              fill
              style={{
                objectFit: 'cover',
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(160deg, rgba(232,240,254,0.55) 0%, rgba(208,228,255,0.45) 50%, rgba(184,212,255,0.40) 100%)',
                zIndex: 1,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Image
                  src={SiteLogo}
                  alt="Site Logo"
                  style={{
                    height: '80px',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>

              <Typography
                variant="h4"
                fontWeight={800}
                color="#0f172a"
                sx={{
                  lineHeight: 1.3,
                  mb: 2,
                  fontSize: { md: '1.85rem', lg: '2.1rem',fontWeight: 800 },
                }}
              >
                Your Journey to a<br />
                Better Future{' '}
                <Box component="span" sx={{ color: '#1a56db' }}>
                  Starts Here
                </Box>
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 380 }}>
                Expert guidance, hassle-free process, and trusted immigration services to help you
                move forward with confidence.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  {
                    title: 'Expert Guidance',
                    desc: 'Get advice from experienced immigration professionals.',
                    icon: '👤',
                    bg: 'rgba(26, 86, 219, 0.12)',
                  },
                  {
                    title: 'Hassle-Free Process',
                    desc: 'We simplify the complex immigration process for you.',
                    icon: '📄',
                    bg: 'rgba(124, 58, 237, 0.12)',
                  },
                  {
                    title: 'Trusted & Secure',
                    desc: 'Your data is safe with us. We ensure privacy and security.',
                    icon: '🛡️',
                    bg: 'rgba(16, 185, 129, 0.12)',
                  },
                ].map((item) => (
                  <Box key={item.title} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography fontWeight={600} color="#0f172a" fontSize="0.95rem">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ========== RIGHT SIDE (LOGIN FORM) ========== */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 3, sm: 5, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'white',
            }}
          >
            <Box sx={{ width: '100%', textAlign: 'center', mb: 5, mt: 2 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: '1.6rem', mb: 1, fontWeight: 700, color: '#0f172a' }}
              >
                Welcome Back!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Login to your account and continue your journey
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {submitError && (
                <Alert severity="error" sx={{ width: '92%', maxWidth: 520, mx: 'auto', mb: 2 }}>
                  {submitError}
                </Alert>
              )}

              {/* Email Field with User Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
                <TextField
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting || isGoogleSubmitting}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ width: '92%', maxWidth: 520 }}
                />
              </Box>

              {/* Password Field with Lock Icon + Eye Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <TextField
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting || isGoogleSubmitting}
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ width: '92%', maxWidth: 520 }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword((value) => !value)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Remember me + Forgot Password */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '92%',
                  maxWidth: 520,
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={isSubmitting || isGoogleSubmitting}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Link href="#" underline="hover" variant="body2" color="primary" fontWeight={500}>
                  Forgot Password?
                </Link>
              </Box>

              {/* Login Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting || isGoogleSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{
                    py: 1.2,
                    height: 44,
                    width: '92%',
                    maxWidth: 520,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 2, width: '92%', maxWidth: 520, mx: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            {/* Google Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleLogin}
                disabled={isSubmitting || isGoogleSubmitting}
                startIcon={
                  isGoogleSubmitting ? (
                    <CircularProgress size={18} />
                  ) : (
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      style={{ width: 20, height: 20 }}
                    />
                  )
                }
                sx={{
                  py: 1.2,
                  height: 44,
                  width: '92%',
                  maxWidth: 520,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                }}
              >
                {isGoogleSubmitting ? 'Connecting...' : 'Continue with Google'}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don&apos;t have an account?{' '}
                <Link href="/agent/sign-up" underline="hover" fontWeight={600}>
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
