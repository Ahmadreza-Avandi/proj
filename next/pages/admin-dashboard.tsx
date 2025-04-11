// pages/admin-dashboard.tsx
import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AdminDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // چک کردن اگر کاربر ادمین است یا خیر
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1">
          داشبورد ادمین
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          به داشبورد ادمین خوش آمدید! در اینجا می‌توانید به تنظیمات و داده‌های سیستم دسترسی داشته باشید.
        </Typography>
        {/* افزودن محتوای اضافی مانند نمودارها، جداول و سایر اطلاعات */}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
