import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Eye, EyeOff, User, Phone, Car as IdCard, Lock } from 'lucide-react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  fullName: yup.string().required('نام و نام خانوادگی الزامی است'),
  nationalCode: yup.string()
    .required('کد ملی الزامی است')
    .matches(/^[0-9]{10}$/, 'کد ملی باید 10 رقم باشد'),
  phoneNumber: yup.string()
    .required('شماره تماس الزامی است')
    .matches(/^[0-9]{11}$/, 'شماره تماس باید 11 رقم باشد'),
  password: yup.string()
    .required('رمز عبور الزامی است')
    .min(8, 'رمز عبور باید حداقل 8 کاراکتر باشد'),
  role: yup.string().required('انتخاب نقش الزامی است'),
}).required();

interface FormInputs {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  password: string;
  role: string;
}

interface Role {
  id: number;
  name: string;
}

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      nationalCode: '',
      phoneNumber: '',
      password: '',
      role: '',
    },
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get<Role[]>('http://localhost:3001/users/role');
        setRoles(response.data);
      } catch (error) {
        setAlert({
          open: true,
          message: 'خطا در دریافت نقش‌ها',
          severity: 'error',
        });
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: FormInputs) => {
    try {
      const role = roles.find((r) => r.name === data.role);
      if (!role) throw new Error('نقش معتبر نیست');

      const response = await axios.post('/api/add-user', {
        ...data,
        roleId: role.id,
      });

      if (response.status === 200) {
        setAlert({
          open: true,
          message: 'کاربر با موفقیت ثبت شد',
          severity: 'success',
        });
        reset();
      }
    } catch (error: unknown) {
      setAlert({
        open: true,
        message: error && typeof error === 'object' && 'response' in error
          ? ((error.response as any)?.data?.message as string) || 'خطا در ثبت کاربر'
          : 'خطا در ثبت کاربر',
        severity: 'error',
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: `calc(100vh - ${theme.spacing(16)})`,
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '500px',
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{
            mb: 4,
            textAlign: 'center',
            fontWeight: 600,
            color: theme.palette.primary.main,
          }}
        >
          ثبت‌نام کاربر جدید
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="نام و نام خانوادگی"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="nationalCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="کد ملی"
                  error={!!errors.nationalCode}
                  helperText={errors.nationalCode?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IdCard size={20} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="شماره تماس"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  label="رمز عبور"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>نقش</InputLabel>
                  <Select
                    {...field}
                    label="نقش"
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.role && (
                    <Typography color="error" variant="caption" sx={{ mt: 0.5, mr: 1.5 }}>
                      {errors.role.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                },
              }}
            >
              ثبت‌نام
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterPage;