import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Box,
  styled,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns-jalali';
import { Clock, AlertCircle, MapPin } from 'lucide-react';
import { Theme } from '@mui/material/styles';

interface User {
  id: number;
  fullName: string;
  nationalCode: string;
  checkin_time: string;
  location: string;
  imageUrl: string;
}

const StyledTableContainer = styled(TableContainer)(({ theme }: { theme: Theme }) => ({
  maxHeight: '70vh',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  '&::-webkit-scrollbar': {
    width: '0.4em',
    height: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }: { theme: Theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textAlign: 'center',
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }: { theme: Theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.2s ease',
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }: { theme: Theme }) => ({
  width: 50,
  height: 50,
  border: `2px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[2],
  cursor: 'pointer',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const LoadingOverlay = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: theme.spacing(2),
}));

const InfoContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const LocationText = styled(Typography)(({ theme }: { theme: Theme }) => ({
  maxWidth: '200px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/last_seen');
        if (!response.ok) throw new Error('خطا در دریافت داده‌ها');

        const data = await response.json();

        const processedUsers = data.map((user: any) => ({
          id: user.id,
          fullName: user.fullName,
          nationalCode: user.nationalCode,
          checkin_time: user.checkin_time,
          location: user.location,
          imageUrl: `https://photo-attendance-system.storage.c2.liara.space/user_register/${
            user.nationalCode
          }.jpg?ts=${Date.now()}`,
        }));

        setUsers(processedUsers);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('خطا در دریافت اطلاعات کاربران');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleImageError = (nationalCode: string) => {
    setFailedImages(prev => new Set(prev.add(nationalCode)));
  };

  if (loading) {
    return (
      <LoadingOverlay>
        <CircularProgress size={40} />
        <Typography variant="h6">در حال بارگذاری...</Typography>
      </LoadingOverlay>
    );
  }

  if (error) {
    return (
      <LoadingOverlay>
        <AlertCircle size={40} color="error" />
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </LoadingOverlay>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <StyledTableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>تصویر</StyledTableCell>
              <StyledTableCell>نام و نام خانوادگی</StyledTableCell>
              <StyledTableCell>کد ملی</StyledTableCell>
              <StyledTableCell>آخرین مکان دیده شده</StyledTableCell>
              <StyledTableCell>زمان ورود</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    <StyledAvatar
                      src={failedImages.has(user.nationalCode) ? '/default-avatar.jpg' : user.imageUrl}
                      alt={user.fullName}
                      onError={() => handleImageError(user.nationalCode)}
                    />
                  </Box>
                </TableCell>

                <TableCell align="center">{user.fullName}</TableCell>
                <TableCell align="center">{user.nationalCode}</TableCell>

                <TableCell align="center">
                  <InfoContainer>
                    <MapPin size={16} />
                    <LocationText variant="body1">
                      {user.location || 'اطلاعات موقعیت موجود نیست'}
                    </LocationText>
                  </InfoContainer>
                </TableCell>

                <TableCell align="center">
                  <InfoContainer>
                    <Clock size={16} />
                    {format(new Date(user.checkin_time), 'HH:mm:ss - yyyy/MM/dd')}
                  </InfoContainer>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default App;