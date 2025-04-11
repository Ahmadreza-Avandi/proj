 
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, useTheme, CircularProgress } from '@mui/material';

const DVRStreamView: React.FC = () => {
  const theme = useTheme();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLImageElement>(null);

  const checkStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/status');
      const { online } = await res.json();
      setIsOnline(online);

      // اگر دوربین آنلاین است، بروزرسانی تصویر
      if (videoRef.current && online) {
        videoRef.current.src = `http://localhost:5000/video_feed?t=${Date.now()}`;
      }
    } catch (error) {
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // بررسی وضعیت هر 2 ثانیه
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      bgcolor: theme.palette.background.default
    }}>
      <Paper elevation={6} sx={{
        p: 3,
        width: '95%',
        maxWidth: 800,
        bgcolor: theme.palette.background.paper
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
          دوربین زنده
          <span style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            marginLeft: 10,
            backgroundColor: isOnline ? '#4CAF50' : '#F44336',
            boxShadow: theme.shadows[2]
          }} />
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            component="img"
            ref={videoRef}
            src={`http://localhost:5000/video_feed?t=${Date.now()}`}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '70vh',
              borderRadius: 2,
              border: `2px solid ${isOnline ? theme.palette.success.main : theme.palette.error.main}`,
              opacity: isOnline ? 1 : 0.6,
              filter: isOnline ? 'none' : 'grayscale(80%)',
              transition: 'all 0.3s ease'
            }}
            alt="تصویر زنده دوربین"
            onError={() => {
              setIsOnline(false);
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default DVRStreamView;


