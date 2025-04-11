import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
  SnackbarCloseReason,
} from '@mui/material';

interface FormData {
  title: string;
  className: string;
  teacher: string;
  dayAndPeriod: string;
  grade: string;
}

const NewLessonPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    className: '',
    teacher: '',
    dayAndPeriod: '',
    grade: '',
  });

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const submitNewLesson = async () => {
    try {
      const response = await fetch('http://localhost:3001/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('کلاس جدید با موفقیت ثبت شد');
        setSeverity('success');
        setOpen(true);
        setFormData({ title: '', className: '', teacher: '', dayAndPeriod: '', grade: '' });
      } else {
        setMessage('خطا در ثبت کلاس جدید');
        setSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      setMessage('خطا در ارتباط با سرور');
      setSeverity('error');
      setOpen(true);
      console.error('خطا در ارتباط با سرور:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewLesson();
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="center">
          {/* عنوان کلاس */}
          <Grid item xs={12}>
            <h1 style={{ textAlign: 'center' }}>ایجاد کلاس جدید</h1>
          </Grid>
          {/* ورودی عنوان */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="عنوان کلاس"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          {/* دکمه ثبت */}
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ padding: '12px 24px', fontSize: '16px' }}
            >
              ثبت
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewLessonPage;
