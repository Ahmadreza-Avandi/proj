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

const NewLocationPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    representative: '',
    grade: '',
    major: '',
  });

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
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

  const submitNewLocation = async () => {
    try {
      const response = await fetch('http://localhost:3001/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('مکان جدید با موفقیت ثبت شد');
        setSeverity('success');
        setOpen(true);
        setFormData({ title: '', representative: '', grade: '', major: '' });
      } else {
        setMessage('خطا در ثبت مکان جدید');
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
    submitNewLocation();
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
      <h1>ایجاد مکان جدید</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="عنوان"
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
              label="نماینده"
              name="representative"
              value={formData.representative}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>رشته</InputLabel>
              <Select
                label="رشته"
                name="major"
                value={formData.major}
                onChange={handleSelectChange}
              >
                <MenuItem value="ماشین ابزار">ماشین ابزار</MenuItem>
                <MenuItem value="مکاترونیک">مکاترونیک</MenuItem>
                <MenuItem value="شبکه و نرم افزار">شبکه و نرم افزار</MenuItem>
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

export default NewLocationPage;
