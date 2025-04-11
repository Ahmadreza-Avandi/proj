import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Backdrop,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Fade,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Class as ClassIcon,
  School as SchoolIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  VpnKey as VpnKeyIcon,
  AccountCircle as AccountCircleIcon,
  CameraAlt as CameraIcon,
  PhotoCamera as PhotoCameraIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface UserData {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  role: string;
  className?: string;
  reshte?: string;
  grade?: string;
  reshteImage?: string;
  gradeImage?: string;
  photo?: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    nationalCode: '',
    phoneNumber: '',
    role: '',
    className: '',
    reshte: '',
    grade: '',
    reshteImage: '',
    gradeImage: '',
    photo: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });
  const router = useRouter();
  const theme = useTheme();
  const [openPhotoDialog, setOpenPhotoDialog] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      try {
        if (!token) {
          router.push('/login');
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const nationalCode = decodedToken.nationalCode;

        const response = await fetch(`http://localhost:3001/users/by-national-code/${nationalCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem('access_token');
          router.push('/login');
          return;
        }

        const user = await response.json();
        
        // دریافت نام نقش از جدول role
        const roleResponse = await fetch(`http://localhost:3001/roles/${user.roleId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        let roleName = 'نقش نامشخص';
        if (roleResponse.ok) {
          const roleData = await roleResponse.json();
          roleName = roleData.name;
        }

        // دریافت اطلاعات کلاس
        let className = '';
        if (user.classId) {
          const classResponse = await fetch(`http://localhost:3001/classes/${user.classId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (classResponse.ok) {
            const classData = await classResponse.json();
            className = classData.name;
          }
        }

        // دریافت اطلاعات رشته
        let reshte = '';
        let reshteImage = '';
        if (user.reshteId) {
          const reshteResponse = await fetch(`http://localhost:3001/reshte/${user.reshteId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (reshteResponse.ok) {
            const reshteData = await reshteResponse.json();
            reshte = reshteData.name;
            reshteImage = reshteData.imageUrl || ''; // اگر تصویر رشته وجود داشت
          }
        }

        // دریافت اطلاعات پایه تحصیلی
        let grade = '';
        let gradeImage = '';
        if (user.gradeId) {
          const gradeResponse = await fetch(`http://localhost:3001/grades/${user.gradeId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (gradeResponse.ok) {
            const gradeData = await gradeResponse.json();
            grade = gradeData.name;
            gradeImage = gradeData.imageUrl || ''; // اگر تصویر پایه وجود داشت
          }
        }

        // تنظیم آدرس عکس کاربر
        const photo = `https://photo-attendance-system.storage.c2.liara.space/user_register/${user.nationalCode}.jpg?ts=${Date.now()}`;

        setUserData({
          fullName: user.fullName,
          nationalCode: user.nationalCode,
          phoneNumber: user.phoneNumber,
          role: roleName,
          className: className,
          reshte: reshte,
          grade: grade,
          reshteImage: reshteImage,
          gradeImage: gradeImage,
          photo: photo,
        });
      } catch (error) {
        console.error('Error:', error);
        localStorage.removeItem('access_token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePasswordEditToggle = () => {
    setIsEditingPassword(!isEditingPassword);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData: UserData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prevData: PasswordData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:3001/users/by-national-code/${userData.nationalCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'تغییرات با موفقیت ذخیره شد',
          severity: 'success',
        });
        setIsEditing(false);
      } else {
        setSnackbar({
          open: true,
          message: 'خطا در به‌روزرسانی اطلاعات کاربر',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در به‌روزرسانی اطلاعات کاربر',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'رمز عبور جدید و تکرار آن مطابقت ندارند',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:3001/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'رمز عبور با موفقیت تغییر کرد',
          severity: 'success',
        });
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setSnackbar({
          open: true,
          message: 'خطا در تغییر رمز عبور',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'خطا در تغییر رمز عبور',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // مدیریت باز کردن دوربین
  const handleOpenCamera = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 720, height: 720 },
        audio: false 
      });
      
      setStream(videoStream);
      setIsCameraOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setSnackbar({
        open: true,
        message: 'خطا در دسترسی به دوربین',
        severity: 'error',
      });
    }
  };

  // بستن دوربین
  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // گرفتن عکس
  const capturePhoto = () => {
    if (videoRef.current && photoRef.current) {
      const video = videoRef.current;
      const canvas = photoRef.current;
      
      // تنظیم ابعاد کنواس برابر با ویدیو
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // کشیدن فریم فعلی ویدیو روی کنواس
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // تبدیل به URL داده
        const imageSrc = canvas.toDataURL('image/jpeg');
        setCapturedPhoto(imageSrc);
        handleCloseCamera();
      }
    }
  };

  // آپلود عکس از فایل
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ذخیره عکس جدید
  const handleSavePhoto = async () => {
    if (!capturedPhoto) return;
    
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    try {
      // تبدیل عکس به بلاب
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      
      // ایجاد فرم دیتا
      const formData = new FormData();
      formData.append('photo', blob, `${userData.nationalCode}.jpg`);
      
      // ارسال به سرور
      const uploadResponse = await fetch(`http://localhost:3001/users/upload-photo/${userData.nationalCode}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (uploadResponse.ok) {
        // به‌روزرسانی عکس نمایش داده شده
        setUserData({
          ...userData,
          photo: `${userData.photo}?ts=${Date.now()}`, // اضافه کردن timestamp برای جلوگیری از کش
        });
        
        setSnackbar({
          open: true,
          message: 'عکس پروفایل با موفقیت به‌روزرسانی شد',
          severity: 'success',
        });
        
        setCapturedPhoto(null);
        setOpenPhotoDialog(false);
      } else {
        throw new Error('خطا در آپلود عکس');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setSnackbar({
        open: true,
        message: 'خطا در آپلود عکس',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // لغو عکس جدید
  const handleCancelPhoto = () => {
    setCapturedPhoto(null);
    setOpenPhotoDialog(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          mb: 4, 
          fontWeight: 600,
          color: theme.palette.primary.main,
          textAlign: 'center' 
        }}>
          پروفایل کاربری
        </Typography>

        <Grid container spacing={4}>
          {/* کارت اطلاعات پروفایل */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box 
                  sx={{ 
                    pt: 3, 
                    pb: 2, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    position: 'relative'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={userData.photo || "/no-avatar.png"}
                      alt={userData.fullName}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: theme.palette.primary.main,
                        mb: 2,
                        boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = "/no-avatar.png";
                      }}
                    >
                      <AccountCircleIcon sx={{ fontSize: 70 }} />
                    </Avatar>
                    <IconButton 
                      onClick={() => setOpenPhotoDialog(true)}
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        right: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 1)',
                        },
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      <CameraIcon fontSize="small" color="primary" />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    {userData.fullName}
                  </Typography>
                  <Chip 
                    label={userData.role}
                    color="primary" 
                    size="medium"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <BadgeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="کد ملی" 
                        secondary={userData.nationalCode} 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="شماره تلفن" 
                        secondary={userData.phoneNumber} 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItem>
                    
                    {userData.className && (
                      <ListItem>
                        <ListItemIcon>
                          <ClassIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="کلاس" 
                          secondary={userData.className} 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )}
                    
                    {userData.grade && (
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="پایه تحصیلی" 
                          secondary={userData.grade} 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )}
                    
                    {userData.reshte && (
                      <ListItem>
                        <ListItemIcon>
                          <SchoolIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="رشته تحصیلی" 
                          secondary={userData.reshte} 
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* کارت تصاویر رشته و پایه تحصیلی */}
          {(userData.reshteImage || userData.gradeImage) && (
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                  mb: 4
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ mr: 1 }} /> تصاویر رشته و پایه تحصیلی
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {userData.reshteImage && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            تصویر رشته: {userData.reshte}
                          </Typography>
                          <Box
                            component="img"
                            src={userData.reshteImage}
                            alt={`تصویر رشته ${userData.reshte}`}
                            sx={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '300px',
                              objectFit: 'contain',
                              borderRadius: 2,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            }}
                          />
                        </Grid>
                      )}
                      
                      {userData.gradeImage && (
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            تصویر پایه تحصیلی: {userData.grade}
                          </Typography>
                          <Box
                            component="img"
                            src={userData.gradeImage}
                            alt={`تصویر پایه تحصیلی ${userData.grade}`}
                            sx={{
                              width: '100%',
                              height: 'auto',
                              maxHeight: '300px',
                              objectFit: 'contain',
                              borderRadius: 2,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          )}

          {/* کارت فرم‌های ویرایش */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                mb: 4
              }}>
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3 
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} /> اطلاعات شخصی
                    </Typography>
                    <Button
                      variant={isEditing ? "outlined" : "contained"}
                      onClick={handleEditToggle}
                      startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                      size="small"
                      sx={{ borderRadius: 2 }}
                    >
                      {isEditing ? "لغو" : "ویرایش"}
                    </Button>
                  </Box>

      <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
        <TextField
          fullWidth
          label="نام کامل"
          name="fullName"
          value={userData.fullName}
          onChange={handleChange}
          disabled={!isEditing}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="کد ملی"
          name="nationalCode"
          value={userData.nationalCode}
          disabled
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="شماره تلفن"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleChange}
          disabled={!isEditing}
                          variant="outlined"
                          InputProps={{
                            sx: { borderRadius: 2 }
                          }}
                        />
                      </Grid>
                      {isEditing && (
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            fullWidth
                            sx={{ 
                              borderRadius: 2, 
                              py: 1.2,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` 
                            }}
                          >
                            ذخیره تغییرات
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </CardContent>
              </Card>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card sx={{ 
                  borderRadius: 3,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 3 
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        <VpnKeyIcon sx={{ mr: 1 }} /> تغییر رمز عبور
                      </Typography>
                      <Button
                        variant={isEditingPassword ? "outlined" : "contained"}
                        onClick={handlePasswordEditToggle}
                        startIcon={isEditingPassword ? <CancelIcon /> : <LockIcon />}
                        size="small"
                        sx={{ borderRadius: 2 }}
                      >
                        {isEditingPassword ? "لغو" : "تغییر رمز عبور"}
                      </Button>
                    </Box>

                    {isEditingPassword && (
                      <form onSubmit={handlePasswordSubmit}>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="رمز عبور فعلی"
                              name="currentPassword"
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              variant="outlined"
                              InputProps={{
                                sx: { borderRadius: 2 }
                              }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="رمز عبور جدید"
                              name="newPassword"
                              type="password"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              variant="outlined"
                              InputProps={{
                                sx: { borderRadius: 2 }
                              }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
                              label="تکرار رمز عبور جدید"
                              name="confirmPassword"
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              variant="outlined"
                              InputProps={{
                                sx: { borderRadius: 2 }
                              }}
                              required
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<SaveIcon />}
                              fullWidth
                              sx={{ 
                                borderRadius: 2, 
                                py: 1.2,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}` 
                              }}
                            >
                              ثبت رمز عبور جدید
        </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* دیالوگ تغییر عکس پروفایل */}
      <Dialog 
        open={openPhotoDialog} 
        onClose={handleCancelPhoto}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
          تغییر عکس پروفایل
        </DialogTitle>
        <DialogContent>
          {isCameraOpen ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  border: '1px solid #ddd', 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  mb: 2,
                  width: '100%',
                  maxWidth: 400,
                  maxHeight: 400
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: 'auto' }}
                />
              </Box>
              <Button
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                onClick={capturePhoto}
                sx={{ borderRadius: 2 }}
              >
                گرفتن عکس
              </Button>
            </Box>
          ) : capturedPhoto ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                component="img"
                src={capturedPhoto}
                alt="عکس گرفته شده"
                sx={{ 
                  maxWidth: '100%',
                  maxHeight: 400,
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <Typography variant="body1" gutterBottom>
                برای تغییر عکس پروفایل، یکی از گزینه‌های زیر را انتخاب کنید:
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CameraIcon />}
                  onClick={handleOpenCamera}
                  sx={{ borderRadius: 2, mx: 1 }}
                >
                  گرفتن عکس با دوربین
                </Button>
                <label htmlFor="photo-upload">
                  <Input
                    id="photo-upload"
                    type="file"
                    inputProps={{
                      accept: 'image/*'
                    }}
                    onChange={handleFileUpload}
                    sx={{ display: 'none' }}
                  />
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ borderRadius: 2, mx: 1 }}
                  >
                    آپلود از کامپیوتر
                  </Button>
                </label>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {capturedPhoto ? (
            <>
              <Button onClick={handleCancelPhoto} variant="outlined" sx={{ borderRadius: 2 }}>
                لغو
              </Button>
              <Button
                onClick={handleSavePhoto}
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ borderRadius: 2 }}
              >
                ذخیره عکس
              </Button>
            </>
          ) : (
            <Button onClick={handleCancelPhoto} variant="outlined" sx={{ borderRadius: 2 }}>
              بستن
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* کنواس پنهان برای پردازش تصویر */}
      <canvas ref={photoRef} style={{ display: 'none' }} />
    </Container>
  );
};

export default ProfilePage;
