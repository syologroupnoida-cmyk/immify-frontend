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
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  EmailOutlined,
  PersonOutlined,
  PhoneOutlined,
  Security,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Refresh,
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import SiteLogo from '@/images/site-logo.png';
import SignUpImage from '@/images/agent-sign-up.png';
import MainApi from '@/util/MainApi';
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

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('X7K9P4');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isOtpOpen || resendSeconds <= 0) return undefined;

    const timerId = window.setInterval(() => {
      setResendSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isOtpOpen, resendSeconds]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Allow only numbers and maximum 10 digits
      const onlyNums = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phone: onlyNums,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user types
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

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newCode = '';
    for (let i = 0; i < 6; i++) {
      newCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(newCode);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone Number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'Captcha is required';
    } else if (formData.captcha.toUpperCase() !== captchaCode) {
      newErrors.captcha = 'Captcha does not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const email = formData.email.trim();

      await MainApi.post('/auth/register', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email,
        phone: formData.phone.trim(),
        password: formData.password,
        role: 'VENDOR',
        vendorType: 'CONSULTANCY',
      }, { skipAuth: true });

      await Swal.fire({
        icon: 'success',
        title: 'OTP sent',
        text: `OTP sent to ${email}. Please verify your email.`,
        timer: 1800,
        showConfirmButton: false,
        confirmButtonColor: '#1a56db',
      });
      setRegisteredEmail(email);
      setOtp('');
      setOtpError('');
      setResendSeconds(300);
      setIsOtpOpen(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Sign up failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!registeredEmail) {
      setOtpError('Email address is missing. Please sign up again.');
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setOtpError('Enter the 6 digit OTP sent to your email.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      await MainApi.post('/auth/verify-email', {
        email: registeredEmail,
        otp: otp.trim(),
      }, { skipAuth: true });

      setIsRedirecting(true);
      await router.push('/agent/login');
    } catch (error) {
      setOtpError(getApiErrorMessage(error, 'OTP verification failed. Please try again.'));
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!registeredEmail || resendSeconds > 0) return;

    setIsResendingOtp(true);
    setOtpError('');

    try {
      await MainApi.post('/auth/resend-otp', {
        email: registeredEmail,
      }, { skipAuth: true });

      setOtp('');
      setResendSeconds(300);
      await Swal.fire({
        icon: 'success',
        title: 'OTP resent',
        text: `A new OTP has been sent to ${registeredEmail}.`,
        timer: 1500,
        showConfirmButton: false,
        didOpen: () => {
          const container = Swal.getContainer();
          if (container) container.style.zIndex = '2000';
        },
      });
    } catch (error) {
      setOtpError(getApiErrorMessage(error, 'Failed to resend OTP. Please try again.'));
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          bgcolor: '#f0f4f8',
          // removed side padding so it becomes full width
        }}
      >
        <Paper
          elevation={2}
          sx={{
            display: 'flex',
            width: '100%',          // full width
            maxWidth: '100%',       // full page width
            mx: 0,
            borderRadius: 0,        // remove rounded corners for full-width look
            overflow: 'hidden',
            minHeight: '100vh',
          }}
        >
          {/* ========== LEFT SIDE ========== */}
          <Box
            sx={{
              flex: 1.3,                    // increased from 1 → makes left side wider
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
              alt="Sign Up Background"
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
                fontWeight={700}
                color="#0f172a"
                sx={{ lineHeight: 1.3, mb: 2, fontWeight: 800, fontSize: { md: '1.75rem', lg: '2rem' } }}
              >
                Your Journey to a<br />
                Better Future Starts Here
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360 }}>
                Expert guidance, hassle-free process, and trusted immigration services to help you
                move forward with confidence.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  {
                    title: 'Expert Guidance',
                    desc: 'Get advice from experienced immigration professionals.',
                    icon: '👤',
                  },
                  {
                    title: 'Hassle-Free Process',
                    desc: 'We simplify the complex immigration process for you.',
                    icon: '📄',
                  },
                  {
                    title: 'Trusted & Secure',
                    desc: 'Your data is safe with us. We ensure privacy and security.',
                    icon: '🛡️',
                  },
                ].map((item) => (
                  <Box key={item.title} sx={{ display: 'flex', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(26, 86, 219, 0.15)',
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

          {/* ========== RIGHT SIDE (SIGN UP FORM) ========== */}
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
            <Box sx={{ width: '100%', textAlign: 'center', mb: 5 }}>
              <Typography
                variant="h5"
                sx={{ fontSize: '1.6rem', mb: 1, fontWeight: 700, color: '#0f172a' }}
              >
                Create a Agent 
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up to start your immigration journey
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {submitError}
                </Alert>
              )}

              {/* First Name & Last Name */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.firstName}
                />
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.lastName}
                />
              </Box>

              {/* Email & Phone Number */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.email}
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.phone}
                  helperText={errors.phone}

                />
              </Box>

              {/* Password & Confirm Password */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.password}
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
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.confirmPassword}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            onClick={() => setShowConfirmPassword((value) => !value)}
                            edge="end"
                            size="small"
                          >
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Captcha */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 1,
                    letterSpacing: 5,
                    fontWeight: 700,
                    fontSize: '1.16rem',
                    color: '#1e293b',
                    userSelect: 'none',
                    fontFamily: 'monospace',
                    minWidth: 180,
                    px: 2,
                    pr: 5,
                  }}
                >
                  {captchaCode}
                    <IconButton
                      size="small"
                    onClick={refreshCaptcha}
                    disabled={isSubmitting}
                    sx={{
                      position: 'absolute',
                      right: 4,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'white',
                      border: '1px solid #e2e8f0',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: '#f8fafc' },
                    }}
                  >
                    <Refresh fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  name="captcha"
                  label="Enter Captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  size="small"
                  disabled={isSubmitting}
                  error={!!errors.captcha}
                  helperText={errors.captcha}
                />
              </Box>

              {/* Sign Up Button - Right Aligned */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                  sx={{
                    py: 1,
                    height: 42,
                    width: '100%',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                  }}
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  style={{ width: 20, height: 20 }}
                />
              }
              sx={{
                py: 1,
                height: 42,
                width: '100%',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                borderColor: '#e0e0e0',
                color: 'text.primary',
                mt: 1,
              }}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link href="/agent/login" underline="hover" fontWeight={600}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog open={isOtpOpen} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: '#0b2a6f',
            color: '#fff',
            fontWeight: 700,
            py: 1,
            px: 2.5,
          }}
        >
          Verify Agent Email
        </DialogTitle>
        <DialogContent sx={{ position: 'relative', pt: 2, pb: 0.75, minHeight: 170 }}>
          {(isVerifyingOtp || isRedirecting) && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                bgcolor: 'rgba(255,255,255,0.88)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
              }}
            >
              <CircularProgress sx={{ color: '#0b2a6f' }} />
              <Typography fontWeight={700} color="#0b2a6f">
                {isRedirecting ? 'Redirecting to login...' : 'Verifying OTP...'}
              </Typography>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1.5 }}>
            Enter the 6 digit OTP sent to {registeredEmail}.
          </Typography>

          {otpError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {otpError}
            </Alert>
          )}

          <TextField
            fullWidth
            autoFocus
            label="OTP"
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/[^0-9]/g, '').slice(0, 6));
              if (otpError) setOtpError('');
            }}
            size="small"
            disabled={isVerifyingOtp || isRedirecting}
          />

          <Box sx={{ mt: 1.25, textAlign: 'center' }}>
            {resendSeconds > 0 ? (
              <Typography variant="body2" color="text.secondary">
                Resend OTP in {Math.floor(resendSeconds / 60)}:
                {String(resendSeconds % 60).padStart(2, '0')}
              </Typography>
            ) : (
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={isResendingOtp || isVerifyingOtp || isRedirecting}
                sx={{ textTransform: 'none', fontWeight: 700, color: '#0b2a6f' }}
              >
                {isResendingOtp ? 'Resending...' : 'Resend OTP'}
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pt: 0, pb: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={isVerifyingOtp || isRedirecting || otp.length !== 6}
            sx={{
              height: 42,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#0b2a6f',
              '&:hover': { bgcolor: '#082159' },
            }}
          >
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default SignUp;
