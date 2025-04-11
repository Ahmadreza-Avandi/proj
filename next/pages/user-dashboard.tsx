// pages/user-dashboard.tsx
import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const UserDashboard: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // چک کردن اگر کاربر است یا خیر
    const role = localStorage.getItem('role');
    if (role !== 'user') {
      router.replace('/login');
    }
  }, [router]);

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" component="h1">
          داشبورد کاربر
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          به داشبورد کاربر خوش آمدید! در اینجا می‌توانید اطلاعات شخصی و فعالیت‌های خود را مشاهده کنید.
        </Typography>
        {/* افزودن محتوای اضافی مانند پروفایل کاربر، فعالیت‌های اخیر و سایر اطلاعات */}
      </Box>
    </Container>
  );
};

export default UserDashboard;
