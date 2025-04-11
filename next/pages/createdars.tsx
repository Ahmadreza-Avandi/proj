import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  SelectChangeEvent,
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
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
        setMessage('درس جدید با موفقیت ثبت شد');
        setSeverity('success');
        setOpen(true);
        setFormData({ title: '', className: '', teacher: '', dayAndPeriod: '', grade: '' });
      } else {
        setMessage('خطا در ثبت درس جدید');
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
      <h1>ایجاد درس جدید</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="عنوان درس"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="کلاس برگزار کننده"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="دبیر مربوطه"
              name="teacher"
              value={formData.teacher}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="روز و زنگ برگزاری"
              name="dayAndPeriod"
              value={formData.dayAndPeriod}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '14px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>پایه</InputLabel>
              <Select
                label="پایه"
                name="grade"
                value={formData.grade}
                onChange={handleSelectChange}
              >
                <MenuItem value="دهم">دهم</MenuItem>
                <MenuItem value="یازدهم">یازدهم</MenuItem>
                <MenuItem value="دوازدهم">دوازدهم</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
