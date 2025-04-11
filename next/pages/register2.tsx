import React, { useRef, useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Webcam from 'react-webcam';
import { ChevronRight, ChevronLeft, X as CloseIcon, Camera } from 'lucide-react';

interface FormInputs {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  password: string;
  majorId: number;
  gradeId: number;
}

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [identityPhoto, setIdentityPhoto] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();

  const { control, handleSubmit, watch } = useForm<FormInputs>();
  const nationalCode = watch('nationalCode');

  const videoConstraints = {
    width: 400,
    height: 300,
    facingMode: 'user',
  };

  // دریافت رشته‌ها و پایه‌ها از API های نکست
  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const res = await fetch('/api/majors');
        const data = await res.json();
        setMajors(data);
      } catch (error) {
        console.error('خطا در دریافت رشته‌ها:', error);
      }
    };

    const fetchGrades = async () => {
      try {
        const res = await fetch('/api/grades');
        const data = await res.json();
        setGrades(data);
      } catch (error) {
        console.error('خطا در دریافت پایه‌ها:', error);
      }
    };

    fetchMajors();
    fetchGrades();
  }, []);

  // فعال کردن دوربین
  const startCamera = () => {
    setCameraActive(true);
  };

  // گرفتن عکس از کامپوننت Webcam
  const capturePhoto = () => {
    if (!nationalCode) {
      setMessage("لطفاً ابتدا کد ملی خود را وارد کنید.");
      setSeverity('error');
      setOpen(true);
      return;
    }
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIdentityPhoto(imageSrc);
        setCameraActive(false);
        // ارسال تصویر به سرور جهت تأیید
        handleCapturedImageUpload(imageSrc);
      } else {
        setMessage("امکان گرفتن عکس وجود ندارد.");
        setSeverity('error');
        setOpen(true);
      }
    }
  };

  // ارسال تصویر گرفته شده و کد ملی به روت /upload
  const handleCapturedImageUpload = async (imageData: string) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          nationalCode: nationalCode,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setMessage(result.message || "تصویر با موفقیت تأیید شد!");
        setSeverity('success');
      } else {
        setMessage(result.message || "خطا در تأیید تصویر.");
        setSeverity('error');
        setIdentityPhoto(null);
      }
    } catch (error) {
      console.error("Error sending image:", error);
      setMessage("خطا در ارتباط با سرور.");
      setSeverity('error');
      setIdentityPhoto(null);
    } finally {
      setLoading(false);
      setOpen(true);
    }
  };

  // ارسال فرم نهایی ثبت‌نام همراه با تصویر تأیید شده
    // ارسال فرم نهایی ثبت‌نام همراه با تصویر تأیید شده
    const onSubmit = async (data: FormInputs) => {
      if (!identityPhoto) {
        setMessage("لطفاً ابتدا تصویر شناسایی خود را بگیرید و آپلود کنید.");
        setSeverity('error');
        setOpen(true);
        return;
      }
  
      // در اینجا نقش به صورت ثابت برابر 1 (مثلاً ادمین) در نظر گرفته شده است
      const formData = { ...data, roleId: 1, identityPhoto };
  
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:3001/users/add-user', formData);
        
        // بررسی دقیق‌تر وضعیت پاسخ
        if (response.status >= 200 && response.status < 300) {
          console.log('Registration successful:', response.data);
          setMessage('ثبت‌نام با موفقیت انجام شد!');
          setSeverity('success');
          setOpen(true);
          
          // تاخیر کوتاه‌تر برای انتقال به صفحه لاگین
          setTimeout(() => {
            try {
              router.push('/login');
            } catch (routeError) {
              console.error('Error navigating to login page:', routeError);
              // اگر هدایت با روش push مشکل داشت، از روش replace استفاده کنیم
              window.location.href = '/login';
            }
          }, 2000);
        } else {
          console.error('Server responded with non-success status:', response.status, response.data);
          setMessage(response.data?.message || 'عملیات ثبت‌نام با خطا مواجه شد.');
          setSeverity('error');
          setOpen(true);
        }
      } catch (error: any) {
        console.error('Registration error:', error);
        // نمایش پیام خطای دقیق‌تر
        const errorMessage = error.response?.data?.message || error.message || 'خطا در ارسال داده‌ها';
        setMessage(errorMessage);
        setSeverity('error');
        setOpen(true);
      } finally {
        setLoading(false);
      }
    };

  const handleNextStep = () => {
    if (step === 1 && !identityPhoto) {
      setMessage("لطفاً ابتدا تصویر شناسایی خود را بگیرید و آپلود کنید.");
      setSeverity('error');
      setOpen(true);
      return;
    }
    if (step < 2) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStepIndicator = () => (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          mb: 2,
        }}
      >
        {[1, 2].map((number) => (
          <Box
            key={number}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: number <= step ? 'primary.main' : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: number <= step ? 'white' : 'text.secondary',
              zIndex: 1,
              transition: 'all 0.3s ease',
            }}
          >
            {number}
          </Box>
        ))}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 2,
            bgcolor: 'grey.300',
            transform: 'translateY(-50%)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 0,
            height: 2,
            bgcolor: 'primary.main',
            transform: 'translateY(-50%)',
            zIndex: 0,
            width: `${(step - 1) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        />
      </Box>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          mt: 1,
        }}
      >
        {step === 1 ? 'تایید هویت' : 'اطلاعات شخصی'}
      </Typography>
    </Box>
  );

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            ثبت‌نام
          </Typography>

          {renderStepIndicator()}

          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="nationalCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="کد ملی"
                    required
                    variant="outlined"
                    sx={{ direction: 'rtl' }}
                  />
                )}
              />

              <Typography variant="body1" sx={{ textAlign: 'center', mb: 2 }}>
                لطفاً تصویر شناسایی خود را بگیرید و آپلود کنید
              </Typography>

              {cameraActive ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={capturePhoto}
                    sx={{ width: '100%' }}
                    startIcon={<Camera />}
                  >
                    عکس بگیر
                  </Button>
                </Box>
              ) : (
                <>
                  {identityPhoto ? (
                    <Box sx={{ position: 'relative', width: '100%', aspectRatio: '3/4', mb: 2 }}>
                      <img
                        src={identityPhoto}
                        alt="تصویر شناسایی"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                      <IconButton
                        onClick={() => setIdentityPhoto(null)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                        }}
                      >
                        <CloseIcon size={16} />
                      </IconButton>
                      <Button
                        variant="outlined"
                        onClick={startCamera}
                        startIcon={<Camera />}
                        sx={{ width: '100%', mt: 2 }}
                      >
                        باز کردن دوربین مجدد
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={startCamera}
                      startIcon={<Camera />}
                      sx={{ py: 5, borderStyle: 'dashed' }}
                    >
                      باز کردن دوربین
                    </Button>
                  )}
                </>
              )}
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام و نام خانوادگی"
                    variant="outlined"
                    sx={{ direction: 'rtl' }}
                  />
                )}
              />
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="شماره تماس"
                    variant="outlined"
                    sx={{ direction: 'rtl' }}
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
                    fullWidth
                    label="رمز عبور"
                    type="password"
                    variant="outlined"
                    sx={{ direction: 'rtl' }}
                  />
                )}
              />

              {/* فیلد انتخاب رشته */}
<Controller
  name="majorId"
  control={control}
  defaultValue={0}
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="انتخاب رشته"
      SelectProps={{
        native: true,
      }}
      variant="outlined"
      sx={{ direction: 'rtl' }}
      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
      value={field.value}
    >
      <option value={0}>انتخاب رشته</option>
      {majors.map((major) => (
        <option key={major.id} value={major.id}>
          {major.name}
        </option>
      ))}
    </TextField>
  )}
/>

{/* فیلد انتخاب پایه */}
<Controller
  name="gradeId"
  control={control}
  defaultValue={0}
  render={({ field }) => (
    <TextField
      {...field}
      select
      fullWidth
      label="انتخاب پایه"
      SelectProps={{
        native: true,
      }}
      variant="outlined"
      sx={{ direction: 'rtl' }}
      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
      value={field.value}
    >
      <option value={0}>انتخاب پایه</option>
      {grades.map((grade) => (
        <option key={grade.id} value={grade.id}>
          {grade.name}
        </option>
      ))}
    </TextField>
  )}
/>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {step > 1 && (
              <Button
                variant="outlined"
                onClick={handlePrevStep}
                startIcon={<ChevronRight />}
                sx={{ flex: 1 }}
              >
                مرحله قبل
              </Button>
            )}

            {step < 2 ? (
              <Button
                variant="contained"
                onClick={handleNextStep}
                endIcon={<ChevronLeft />}
                sx={{ flex: 1 }}
              >
                مرحله بعد
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'ثبت‌نام'
                )}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={severity}
          action={
            <IconButton size="small" color="inherit" onClick={() => setOpen(false)}>
              <CloseIcon size={16} />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </Snackbar>

      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: 2,
            }}
          >
            <CircularProgress size={24} />
            <Typography>در حال پردازش...</Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default RegisterForm;
