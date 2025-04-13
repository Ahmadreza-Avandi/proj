import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const AttendancePage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: '100%' }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          صفحه حضور و غیاب
        </Typography>
        <Typography variant="body1" textAlign="center">
          این صفحه در حال بروزرسانی است.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AttendancePage;