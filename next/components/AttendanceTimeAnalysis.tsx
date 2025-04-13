import { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent,
  Grid, Chip, Divider, Alert
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface TimeAnalysisProps {
  classId: number;
  subjectId: number;
  jalaliDate: string;
}

interface Student {
  id: number;
  nationalCode: string;
  fullName: string;
  checkin_time: string;
  time_status: 'در زمان' | 'زودتر' | 'دیرتر' | 'default';
}

interface Subject {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface Stats {
  subjectInfo: Subject;
  totalStudents: number;
  onTime: number;
  early: number;
  late: number;
}

const AttendanceTimeAnalysis = ({ classId, subjectId, jalaliDate }: TimeAnalysisProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!classId || !subjectId || !jalaliDate) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/compare-attendance-with-class-time?classId=${classId}&subjectId=${subjectId}&jalaliDate=${jalaliDate}`
        );

        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات');
        }

        const data = await response.json();
        
        setSubject(data.subject);
        setStudents(data.attendance);
        setStats(data.stats);
      } catch (err) {
        console.error('Error fetching attendance time analysis:', err);
        setError(err instanceof Error ? err.message : 'خطای ناشناخته');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, subjectId, jalaliDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'در زمان':
        return 'success';
      case 'زودتر':
        return 'info';
      case 'دیرتر':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'در زمان':
        return <CheckIcon fontSize="small" />;
      case 'زودتر':
        return <WarningIcon fontSize="small" />;
      case 'دیرتر':
        return <ErrorIcon fontSize="small" />;
      default:
        return undefined;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!subject || !stats) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        لطفاً کلاس، درس و تاریخ را انتخاب کنید.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
          تحلیل زمان‌های حضور
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  اطلاعات درس
                </Typography>
                <Typography variant="h6" component="div">
                  {subject.name}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>
                    ساعت شروع: {subject.startTime.substring(0, 5)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography>
                    ساعت پایان: {subject.endTime.substring(0, 5)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  آمار حضور
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{stats.totalStudents}</Typography>
                    <Typography variant="body2">تعداد کل</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">{stats.onTime}</Typography>
                    <Typography variant="body2">به موقع</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main">{stats.early}</Typography>
                    <Typography variant="body2">زودتر</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">{stats.late}</Typography>
                    <Typography variant="body2">دیرتر</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>نام و نام خانوادگی</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>کد ملی</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>ساعت ورود</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>وضعیت</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.fullName}</TableCell>
                  <TableCell align="center">{student.nationalCode}</TableCell>
                  <TableCell align="center">{student.checkin_time.substring(0, 5)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={student.time_status}
                      color={getStatusColor(student.time_status) as any}
                      variant="outlined"
                      size="small"
                      icon={getStatusIcon(student.time_status)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  هیچ دانش‌آموزی در این درس حضور ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceTimeAnalysis; 