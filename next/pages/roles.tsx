import React, { useState } from 'react';
import { 
  Checkbox, 
  FormControlLabel, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Snackbar, 
  Alert, 
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Shield, Save, User, MapPin } from 'lucide-react';
import axios from 'axios';
import { SnackbarCloseReason } from '@mui/material/Snackbar';

const RoleCreationPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [roleName, setRoleName] = useState<string>('');
  const [permissions, setPermissions] = useState({
    viewPlaces: false,
    editPlaces: false,
    deletePlaces: false,
    viewPersons: false,
    editPersons: false,
    deletePersons: false,
    viewRoles: false,
    editRoles: false,
    deleteRoles: false,
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      setAlert({
        open: true,
        message: 'لطفاً نام نقش را وارد کنید',
        severity: 'error',
      });
      return;
    }

    const newRole = {
      name: roleName,
      permissions: JSON.stringify(permissions),
    };

    try {
      const response = await axios.post('http://localhost:3001/users/role', newRole);
      setAlert({
        open: true,
        message: 'نقش با موفقیت ایجاد شد',
        severity: 'success',
      });
      // Reset form
      setRoleName('');
      setPermissions({
        viewPlaces: false,
        editPlaces: false,
        deletePlaces: false,
        viewPersons: false,
        editPersons: false,
        deletePersons: false,
        viewRoles: false,
        editRoles: false,
        deleteRoles: false,
      });
    } catch (error) {
      setAlert({
        open: true,
        message: 'خطا در ایجاد نقش. لطفا دوباره تلاش کنید',
        severity: 'error',
      });
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({ ...alert, open: false });
  };

  const PermissionSection = ({ 
    title, 
    icon, 
    permissions: sectionPermissions 
  }: { 
    title: string; 
    icon: React.ReactNode;
    permissions: { name: string; label: string }[];
  }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography variant="h6" color="primary">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sectionPermissions.map(({ name, label }) => (
            <FormControlLabel
              key={name}
              control={
                <Checkbox
                  checked={permissions[name as keyof typeof permissions]}
                  onChange={handleCheckboxChange}
                  name={name}
                  sx={{
                    color: theme.palette.primary.main,
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              }
              label={label}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '0.9rem',
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box 
      sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        p: { xs: 2, sm: 3 },
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="نام نقش"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Shield size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  '& > fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <PermissionSection
              title="اماکن"
              icon={<MapPin size={24} />}
              permissions={[
                { name: 'viewPlaces', label: 'مشاهده اماکن' },
                { name: 'editPlaces', label: 'ایجاد/ویرایش اماکن' },
                { name: 'deletePlaces', label: 'حذف اماکن' },
              ]}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <PermissionSection
              title="اشخاص"
              icon={<User size={24} />}
              permissions={[
                { name: 'viewPersons', label: 'مشاهده اشخاص' },
                { name: 'editPersons', label: 'ایجاد/ویرایش اشخاص' },
                { name: 'deletePersons', label: 'حذف اشخاص' },
              ]}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <PermissionSection
              title="نقش‌ها"
              icon={<Shield size={24} />}
              permissions={[
                { name: 'viewRoles', label: 'مشاهده نقش‌ها' },
                { name: 'editRoles', label: 'ایجاد/ویرایش نقش‌ها' },
                { name: 'deleteRoles', label: 'حذف نقش‌ها' },
              ]}
            />
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<Save size={20} />}
            sx={{
              width: { xs: '100%', sm: '50%', md: '30%' },
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            ذخیره نقش
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
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

export default RoleCreationPage;