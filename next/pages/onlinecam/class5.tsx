import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';

const DVRStreamView: React.FC = () => {
  const streamUrl = "http://your-dvr-address/path-to-stream.m3u8"; // لینک استریم HLS
  const theme = useTheme(); // استفاده از تم برای تطبیق با حالت دارک مود

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100vh',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
        padding: 2,
        paddingTop: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          textAlign: 'center',
          width: '100%',
          maxWidth: 600,
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        }}
      >
        <Typography variant="h5" gutterBottom>
          DVR Camera Viewer 5
        </Typography>
        <video
          controls
          autoPlay
          style={{
            width: '100%',
            borderRadius: '8px',
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <source src={streamUrl} type="application/x-mpegURL" />
          Your browser does not support the video tag.
        </video>
      </Paper>
    </Box>
  );
};

export default DVRStreamView;
