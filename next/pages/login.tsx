import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Link,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { motion } from 'framer-motion';

interface LoginInputs {
  nationalCode: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { handleSubmit, control, setError, clearErrors } = useForm<LoginInputs>();
  const router = useRouter();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', data);
      localStorage.setItem('access_token', response.data.access_token);
      setSnackbarSeverity('success');
      setSnackbarMessage('ورود موفقیت‌آمیز بود');
      setSnackbarOpen(true);
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      setError('nationalCode', { message: 'Login failed' });
      setSnackbarSeverity('error');
      if (error.response && error.response.status === 401) {
        setSnackbarMessage('رمز عبور یا کد ملی اشتباه است');
      } else {
        setSnackbarMessage('مشکلی پیش آمد. دوباره تلاش کنید.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = () => {
    clearErrors('nationalCode');
    clearErrors('password');
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: 3,
            background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 2,
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <LockOutlinedIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            ورود به حساب کاربری
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Controller
              name="nationalCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="کد ملی"
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { fontWeight: 500 }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="رمز عبور"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { fontWeight: 500 }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          sx={{
                            color: theme.palette.text.secondary,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'ورود به حساب'
              )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Link
                href="/register2"
                sx={{
                  textDecoration: 'none',
                  color: theme.palette.primary.main,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  '&:hover': {
                    color: theme.palette.primary.dark,
                  },
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                حساب کاربری ندارید؟ ثبت‌نام کنید
              </Link>
            </Box>
          </form>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            fontSize: '0.95rem',
            fontWeight: 500,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            '& .MuiAlert-icon': {
              marginRight: '12px',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(4px)',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
};

export default LoginForm;