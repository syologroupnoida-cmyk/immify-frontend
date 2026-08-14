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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from 'next/image';
import SiteLogo from '@/images/site-logo.png';
import SignUpImage from '@/images/user-login-img.png';

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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Login Successful', formData);
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
              {/* Email Field with User Icon */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
                <TextField
                  name="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  size="small"
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={{ width: '92%', maxWidth: 440 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
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
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ width: '92%', maxWidth: 440 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
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
                  maxWidth: 440,
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
                  sx={{
                    py: 1.2,
                    height: 44,
                    width: '92%',
                    maxWidth: 440,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  Login →
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 2, width: '92%', maxWidth: 440, mx: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            {/* Google Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{
                  py: 1.2,
                  height: 44,
                  width: '92%',
                  maxWidth: 440,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: '#e0e0e0',
                  color: 'text.primary',
                }}
              >
                Continue with Google
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="/user/sign-up" underline="hover" fontWeight={600}>
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