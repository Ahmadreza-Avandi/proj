import React, { useState, ChangeEvent } from 'react';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

interface FormInputs {
  firstName: string;
  lastName: string;
  nationalCode: string;
  studentId: string;
  file: FileList;
}

const NewPersonForm: React.FC = () => {
  const { handleSubmit, control, setError, reset } = useForm<FormInputs>();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();

      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]);
      }

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('nationalCode', data.nationalCode);
      formData.append('studentId', data.studentId);

      const response = await axios.post('/api/new-person', formData);

      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        reset();
        setFileName('');
      } else {
        console.error('Failed to save data:', response.statusText);
        setError('firstName', { message: 'Failed to save data' });
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      setError('firstName', { message: 'Failed to save data' });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        padding: { xs: 2, sm: 3 },
        marginTop: { xs: 4, sm: 8 },
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, sm: 3 },
            maxWidth: '100%',
            width: { xs: '100%', sm: '400px' },
            boxSizing: 'border-box',
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              marginBottom: { xs: 2, sm: 3 },
              textAlign: 'center',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
            }}
          >
            صفحه شخص جدید
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: { xs: 2, sm: 3 } }}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: { xs: 2, sm: 3 } }}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام خانوادگی"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: { xs: 2, sm: 3 } }}>
              <Controller
                name="nationalCode"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="کد ملی"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: { xs: 2, sm: 3 } }}>
              <Controller
                name="studentId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="شماره دانش‌آموزی"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: { xs: 2, sm: 3 } }}>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileChange(e);
                    }}
                    style={{ display: 'block', width: '100%' }}
                    accept="image/*"
                  />
                )}
              />
              <Typography
                variant="body2"
                sx={{ marginTop: 1, textAlign: 'center', fontSize: { xs: '0.9rem', sm: '1rem' } }}
              >
                آپلود عکس: {fileName || 'هیچ فایلی انتخاب نشده است'}
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                fontSize: { xs: '0.8rem', sm: '1rem' },
                padding: { xs: '10px 0', sm: '14px 0' },
              }}
            >
              ثبت
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewPersonForm;