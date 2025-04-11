import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  MenuItem, Select, FormControl, InputLabel, IconButton,
  Snackbar, Alert, CircularProgress, Card, CardContent,
  Grid, useTheme, useMediaQuery, Chip, SelectChangeEvent,
  Stack, Skeleton, Divider, Tooltip
} from '@mui/material';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { 
  Check as CheckIcon, 
  Close as CloseIcon, 
  Today as TodayIcon,
  FilterList as FilterListIcon,
  School as SchoolIcon,
  Book as BookIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

// تایپ‌های مورد نیاز
interface Class {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
}

interface AttendanceRecord {
  id: number;
  userId: number;
  nationalCode: string;
  fullName: string;
  className: string;
  checkin_time: string;
  jalali_date: string;
  created_at: string;
  status: 'present' | 'absent';
  subjectId?: number;
  subjectName?: string;
  subjects_attended?: string; // برای نمایش همه درس‌ها
  photo?: string;
  present_count: number;
  total_subjects: number;
}

type AttendanceFilter = 'present' | 'absent';

// تعریف تایپ برای snackbar
interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const AttendancePage = () => {
  // استیت‌های مورد نیاز
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateObject>(new DateObject({ calendar: persian, locale: persian_fa }));
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('present');
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState<boolean>(false);
  const [isMarkingAllAttendance, setIsMarkingAllAttendance] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);

  // مدیا کوئری برای رسپانسیو
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // اضافه کردن css برای دیت‌پیکر
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .rmdp-container {
        direction: rtl;
        width: 100%;
      }
      .date-picker-input {
        width: 100%;
        text-align: center;
        font-family: inherit;
      }
      .rmdp-day, .rmdp-week-day {
        font-family: inherit;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // بررسی دیتابیس برای وجود ستون subjectId
  useEffect(() => {
    fetch('/api/add-subject-column', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        console.log('Database structure check:', data);
      })
      .catch(error => {
        console.error('Error checking database structure:', error);
      });
  }, []);

  // بارگذاری کلاس‌ها
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/classes');
        if (!response.ok) {
          throw new Error('خطا در دریافت کلاس‌ها');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('خطا در دریافت کلاس‌ها');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // تنظیم تاریخ فرمت‌بندی شده هنگام تغییر تاریخ
  useEffect(() => {
    if (selectedDate) {
      // تبدیل تاریخ به فرمت YYYY/MM/DD
      let jalaliDate = selectedDate.format('YYYY/MM/DD');
      
      // تبدیل اعداد فارسی به انگلیسی اگر لازم باشد
      jalaliDate = jalaliDate.replace(/[۰-۹]/g, (d) => 
        String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
      );
      
      setFormattedDate(jalaliDate);
      
      // اگر کلاس انتخاب شده باشد، اطلاعات را بارگذاری کنید
      if (selectedClass) {
        setTimeout(() => handleFetchAttendance(), 100);
      }
    }
  }, [selectedDate]);

  // دریافت اطلاعات حضور برای کلاس و تاریخ انتخاب‌شده
  const handleFetchAttendance = async (paramFilter?: AttendanceFilter) => {
    try {
      // Check if a class and date are selected
      if (!selectedClass || !formattedDate) {
        setSnackbar({
          open: true,
          message: 'لطفاً کلاس و تاریخ را انتخاب کنید',
          severity: 'warning'
        });
          return;
        }
        
      setIsLoadingAttendance(true);
      setError(null);
      
      // Create the URL with the necessary parameters
      let url = `/api/attendance?classId=${selectedClass.id}&date=${formattedDate}`;

      // Add the filter parameter if it's present
      const filter = paramFilter || attendanceFilter;
      if (filter) {
        url += `&attendanceFilter=${filter}`;
      }

      // Add subject ID if selected
        if (selectedSubject) {
        url += `&subjectId=${selectedSubject.id}`;
      }

      console.log('Fetching attendance with URL:', url);
  
      const response = await fetch(url);
      const responseData = await response.json();

      if (!response.ok) {
        console.error('Server error response:', responseData);
        throw new Error(responseData.message || `خطا در دریافت اطلاعات: ${response.status}`);
      }
      
      // Check if data has the expected structure
      if (responseData && responseData.students) {
        // اضافه کردن URL عکس به داده‌های دانش‌آموزان
        setAttendanceData(responseData.students.map((student: any) => ({
          ...student,
          photo: `https://photo-attendance-system.storage.c2.liara.space/user_register/${student.nationalCode}.jpg?ts=${Date.now()}`
        })));
        
        if (responseData.subjects && responseData.subjects.length > 0) {
          setSubjects(responseData.subjects);
          setDayOfWeek(responseData.dayOfWeek);
        } else {
          setSubjects([]);
          setSelectedSubject(null);
          setDayOfWeek(null);
        }
        
        // If no students found, show a message
        if (responseData.students.length === 0) {
          setSnackbar({
            open: true,
            message: 'دانش آموزی در این فیلتر یافت نشد',
            severity: 'info'
          });
        } else {
          // Clear any previous "no students found" message
          if (snackbar.open && snackbar.message === 'دانش آموزی در این فیلتر یافت نشد') {
            setSnackbar({
              open: false,
              message: '',
              severity: 'success'
            });
          }
        }
      } else {
        // Handle error in data structure
        setAttendanceData([]);
        setSnackbar({
          open: true,
          message: 'ساختار داده‌های دریافتی نامعتبر است',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError(error instanceof Error ? error.message : 'خطا در دریافت اطلاعات حضور و غیاب');
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'خطا در دریافت اطلاعات حضور و غیاب',
        severity: 'error'
      });
      setAttendanceData([]);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  // تغییر وضعیت حضور
  const handleToggleStatus = async (student: AttendanceRecord) => {
    try {
      const newStatus = student.status === 'present' ? 'absent' : 'present';
      
      // اطلاعات مورد نیاز برای ارسال به API
      const data = {
        id: student.id,
        status: newStatus,
        userId: student.userId,
        nationalCode: student.nationalCode,
        fullName: student.fullName,
        className: student.className,
        jalali_date: formattedDate,
        dayOfWeek: dayOfWeek,
        subjectId: selectedSubject?.id || null
      };
      
      console.log("Sending data to update attendance:", data);
      
      const response = await fetch('/api/attendance', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'خطا در بروزرسانی وضعیت حضور');
      }
      
      const responseData = await response.json();
      console.log("Response from server:", responseData);
      
      // آپدیت لیست دانش‌آموزان با وضعیت جدید
      setAttendanceData(prev =>
        prev.map(item =>
          item.nationalCode === student.nationalCode 
            ? { 
                ...item, 
                status: newStatus, 
                id: responseData.id 
              } 
            : item
        )
      );
      
      // بارگذاری مجدد داده‌ها بعد از تغییر وضعیت (اختیاری)
      setTimeout(() => handleFetchAttendance(), 500);
      
      setSnackbar({
        open: true,
        message: `وضعیت حضور ${student.fullName} به ${newStatus === 'present' ? 'حاضر' : 'غایب'} تغییر کرد`,
        severity: 'success'
      });
    } catch (err: unknown) {
      console.error('Error toggling attendance status:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'خطا در بروزرسانی وضعیت حضور',
        severity: 'error'
      });
    }
  };

  // تغییر کلاس انتخاب شده
  const handleClassChange = (event: SelectChangeEvent<string>) => {
    const selectedClassId = event.target.value;
    const classObj = classes.find(c => c.id.toString() === selectedClassId);
    setSelectedClass(classObj || null);
    setSelectedSubject(null);
    setAttendanceData([]);
    
    // اگر تاریخ انتخاب شده باشد، اطلاعات را بارگذاری کنید
    if (formattedDate && classObj) {
      setTimeout(() => handleFetchAttendance(), 0);
    }
  };

  // تغییر درس انتخاب شده
  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    const selectedSubjectId = event.target.value;
    if (selectedSubjectId === '') {
      setSelectedSubject(null);
    } else {
      const subjectObj = subjects.find(s => s.id.toString() === selectedSubjectId);
      setSelectedSubject(subjectObj || null);
    }
    
    // بارگذاری مجدد با درس جدید
    setTimeout(() => handleFetchAttendance(), 0);
  };

  // تغییر فیلتر حضور
  const handleFilterChange = (filter: AttendanceFilter) => {
    setAttendanceFilter(filter);
    handleFetchAttendance(filter);
  };

  // بستن snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // تنظیم تاریخ جاری
  const handleTodayClick = () => {
    const today = new DateObject({ calendar: persian, locale: persian_fa });
    setSelectedDate(today);
  };

  const datePickerChangeHandler = (date: DateObject) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // ثبت حضور همه دانش‌آموزان کلاس
  const handleMarkAllPresent = async () => {
    if (!selectedClass || !formattedDate) {
      setSnackbar({
        open: true,
        message: 'لطفاً کلاس و تاریخ را انتخاب کنید',
        severity: 'warning'
      });
      return;
    }

    try {
      setIsMarkingAllAttendance(true);

      // دریافت لیست همه دانش‌آموزان کلاس
      const response = await fetch(`/api/students-by-class?classId=${selectedClass.id}`);
      if (!response.ok) {
        throw new Error('خطا در دریافت لیست دانش‌آموزان');
      }

      const students = await response.json();
      
      // برای هر دانش‌آموز، حضور را ثبت می‌کنیم
      for (const student of students) {
        const data = {
          id: 0, // برای ایجاد رکورد جدید
          status: 'present',
          userId: student.id,
          nationalCode: student.nationalCode,
          fullName: student.fullName,
          classId: selectedClass.id,
          className: selectedClass.name,
          jalali_date: formattedDate,
          dayOfWeek: dayOfWeek,
          subjectId: selectedSubject?.id || null
        };

        await fetch('/api/attendance', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }

      // بارگذاری مجدد داده‌ها
      handleFetchAttendance();

      setSnackbar({
        open: true,
        message: 'حضور همه دانش‌آموزان با موفقیت ثبت شد',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error marking all students present:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'خطا در ثبت حضور گروهی',
        severity: 'error'
      });
    } finally {
      setIsMarkingAllAttendance(false);
    }
  };

  return (
    <Box px={isMobile ? 1 : 3} py={2}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ color: 'primary.main', mr: 1 }} />
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel id="class-select-label">کلاس</InputLabel>
                <Select
                  labelId="class-select-label"
                  id="class-select"
                  value={selectedClass ? selectedClass.id.toString() : ''}
                  label="کلاس"
                  onChange={handleClassChange}
                >
                  {loading ? (
                    <MenuItem value="" disabled>
                      <CircularProgress size={20} />
                      در حال بارگذاری...
                    </MenuItem>
                  ) : classes.length > 0 ? (
                    classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      هیچ کلاسی یافت نشد
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TodayIcon sx={{ color: 'primary.main' }} />
              <Box sx={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={selectedDate}
                  onChange={datePickerChangeHandler}
                  format="YYYY/MM/DD"
                  calendarPosition="bottom-right"
                  inputClass="date-picker-input"
                  containerStyle={{
                    width: '100%',
                  }}
                  style={{
                    height: isMobile ? '46px' : '56px',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: isMobile ? '12px 10px' : '16.5px 14px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    fontFamily: 'inherit',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                  }}
                />
              </Box>
              <Tooltip title="امروز">
                <IconButton 
                  onClick={handleTodayClick} 
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                >
                  <TodayIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <BookIcon sx={{ color: 'primary.main', mr: 2 }} />
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel id="subject-select-label">درس {dayOfWeek ? `(${dayOfWeek})` : ''}</InputLabel>
                <Select
                  labelId="subject-select-label"
                  id="subject-select"
                  value={selectedSubject ? selectedSubject.id.toString() : ''}
                  label={`درس ${dayOfWeek ? `(${dayOfWeek})` : ''}`}
                  onChange={handleSubjectChange}
                  disabled={!subjects.length}
                >
                  <MenuItem value="">
                    <em>همه دروس</em>
                  </MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id.toString()}>
                      {subject.name} ({subject.startTime.substring(0, 5)}-{subject.endTime.substring(0, 5)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 1 }}>
              <Chip 
                icon={<FilterListIcon />} 
                label="فیلتر" 
                variant="outlined" 
                color="primary" 
                size={isMobile ? "small" : "medium"}
              />
            </Divider>
          </Grid>

          <Grid item xs={12}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ width: '100%' }}
            >
              <Button
                variant={attendanceFilter === 'present' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleFilterChange('present')}
                startIcon={<CheckIcon />}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 2 }}
              >
                حاضرین
              </Button>
              <Button
                variant={attendanceFilter === 'absent' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleFilterChange('absent')}
                startIcon={<CloseIcon />}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 2 }}
              >
                غایبین
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleMarkAllPresent}
                disabled={isMarkingAllAttendance || !selectedClass || !formattedDate}
                startIcon={isMarkingAllAttendance ? <CircularProgress size={20} /> : <CheckIcon />}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
                sx={{ borderRadius: 2 }}
              >
                ثبت حضور همه
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        boxShadow: theme.shadows[2],
        '& .MuiTableContainer-root': {
          overflowX: 'auto',
          maxHeight: isMobile ? 'calc(100vh - 290px)' : 'calc(100vh - 320px)'
        }
      }}>
        <TableContainer>
          <Table stickyHeader size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>تصویر</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>نام</TableCell>
                {!isMobile && (
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>کد ملی</TableCell>
                )}
                {!isTablet && (
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>کلاس</TableCell>
                )}
                {!selectedSubject && (
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>درس‌ها</TableCell>
                )}
                {selectedSubject && (
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>درس</TableCell>
                )}
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>ساعت حضور</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>وضعیت</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: isMobile ? '0.8rem' : '1rem' }}>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingAttendance ? (
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={40} height={40} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                    {!isMobile && (
                      <TableCell align="center">
                        <Skeleton variant="text" width="100%" />
                      </TableCell>
                    )}
                    {!isTablet && (
                      <TableCell align="center">
                        <Skeleton variant="text" width="100%" />
                      </TableCell>
                    )}
                    {!selectedSubject && (
                      <TableCell align="center">
                        <Skeleton variant="text" width="100%" />
                      </TableCell>
                    )}
                    {selectedSubject && (
                      <TableCell align="center">
                        <Skeleton variant="text" width="100%" />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={80} height={32} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="circular" width={40} height={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : attendanceData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={selectedSubject ? (isMobile ? 6 : isTablet ? 7 : 8) : (isMobile ? 6 : isTablet ? 7 : 8)} align="center">
                    {selectedClass && formattedDate ? 
                      "دانش آموزی در این کلاس با فیلتر انتخاب شده یافت نشد" : 
                      "لطفا یک کلاس و تاریخ انتخاب کنید"
                    }
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData.map((student) => (
                  <TableRow 
                    key={student.nationalCode} 
                    sx={{ 
                      backgroundColor: student.status === 'present' ? 'rgba(76, 175, 80, 0.05)' : 'rgba(244, 67, 54, 0.05)',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: student.status === 'present' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      }
                    }}
                  >
                    <TableCell align="center">
                      <Box 
                        component="img" 
                        src={student.photo || "/no-avatar.png"} 
                        alt={student.fullName}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = "/no-avatar.png";
                        }}
                        sx={{ 
                          width: isMobile ? 32 : 40, 
                          height: isMobile ? 32 : 40, 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #ddd'
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                      {student.fullName}
                    </TableCell>
                    {!isMobile && (
                      <TableCell align="center">{student.nationalCode}</TableCell>
                    )}
                    {!isTablet && (
                      <TableCell align="center">{student.className}</TableCell>
                    )}
                    {!selectedSubject && (
                      <TableCell align="center" sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', maxWidth: 300, whiteSpace: 'normal' }}>
                        <div dangerouslySetInnerHTML={{ 
                          __html: student.subjects_attended?.replace(/\|/g, '<br/>').replace(/✓/g, '<span style="color:green">✓</span>').replace(/✗/g, '<span style="color:red">✗</span>') || '-' 
                        }} />
                      </TableCell>
                    )}
                    {selectedSubject && (
                      <TableCell align="center" sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                        {student.subjectName || selectedSubject.name}
                      </TableCell>
                    )}
                    <TableCell align="center" sx={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        {student.checkin_time || '-'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={
                          selectedSubject 
                            ? (student.status === 'present' ? 'حاضر' : 'غایب')
                            : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                ? 'حاضر' 
                                : 'غایب')
                        } 
                        color={
                          selectedSubject 
                            ? (student.status === 'present' ? 'success' : 'error')
                            : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                ? 'success' 
                                : 'error')
                        }
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                        icon={
                          selectedSubject 
                            ? (student.status === 'present' ? <CheckIcon fontSize="small" /> : <CloseIcon fontSize="small" />)
                            : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                ? <CheckIcon fontSize="small" /> 
                                : <CloseIcon fontSize="small" />)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        color={
                          selectedSubject 
                            ? (student.status === 'present' ? 'error' : 'success')
                            : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                ? 'error' 
                                : 'success')
                        }
                        onClick={() => handleToggleStatus(student)}
                        size="small"
                        sx={{ 
                          border: `1px solid ${
                            selectedSubject 
                              ? (student.status === 'present' ? theme.palette.error.main : theme.palette.success.main)
                              : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                  ? theme.palette.error.main 
                                  : theme.palette.success.main)
                          }`,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 
                              selectedSubject 
                                ? (student.status === 'present' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)')
                                : (student.present_count === student.total_subjects && student.total_subjects > 0 
                                    ? 'rgba(244, 67, 54, 0.1)' 
                                    : 'rgba(76, 175, 80, 0.1)')
                          }
                        }}
                      >
                        {
                          selectedSubject 
                            ? (student.status === 'present' ? <CloseIcon fontSize="small" /> : <CheckIcon fontSize="small" />)
                            : (student.present_count === student.total_subjects && student.total_subjects > 0
                                ? <CloseIcon fontSize="small" /> 
                                : <CheckIcon fontSize="small" />)
                        }
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {attendanceData.length > 0 && (
          <Box sx={{ 
            p: isMobile ? 1 : 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: `1px solid ${theme.palette.divider}`,
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 0
          }}>
            <Typography variant="body2" color="text.secondary">
              تعداد: {attendanceData.length} دانش آموز
            </Typography>
            <Typography variant="body2" color="text.secondary" align={isMobile ? 'left' : 'right'}>
              {attendanceFilter === 'present' ? 'حاضرین' : 'غایبین'}: {attendanceData.length} نفر
            </Typography>
          </Box>
        )}
      </Paper>
    
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendancePage;
