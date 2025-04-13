import React from 'react';
import {
  Typography,
  Box,
  styled,
  CircularProgress,
} from '@mui/material';
import { Theme } from '@mui/material/styles';

const LoadingOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: theme.spacing(2),
}));

const App: React.FC = () => {
  return (
    <LoadingOverlay>
      <CircularProgress size={60} />
      <Typography variant="h4" sx={{ mt: 4, fontWeight: 'bold' }}>
        درحال بروز رسانی است
      </Typography>
    </LoadingOverlay>
  );
};

export default App;
