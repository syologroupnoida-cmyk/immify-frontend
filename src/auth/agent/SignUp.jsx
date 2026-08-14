import React, { useState } from 'react';
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
import SiteLogo from '@/images/site-logo.png';
import SignUpImage from '@/images/agent-sign-up.png';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('X7K9P');

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
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newCode = '';
    for (let i = 0; i < 5; i++) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted Successfully', formData);
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
              {/* First Name & Last Name */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  size="small"
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  size="small"
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  size="small"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  inputProps={{
                    maxLength: 10,        // hard limit
                    inputMode: 'numeric',
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
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
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Captcha */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    flex: 1,
                    position: 'relative',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: 1,
                    letterSpacing: 4,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: '#1e293b',
                    userSelect: 'none',
                    fontFamily: 'monospace',
                  }}
                >
                  {captchaCode}
                  <IconButton
                    size="small"
                    onClick={refreshCaptcha}
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
                  error={!!errors.captcha}
                  helperText={errors.captcha}
                  sx={{ flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Security color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Sign Up Button - Right Aligned */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
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
                  Sign Up →
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
    </ThemeProvider>
  );
};

export default SignUp;