"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AttendanceReports = () => {
  const theme = useTheme();
  const [selectedClass, setSelectedClass] = React.useState('all');
  const [selectedMonth, setSelectedMonth] = React.useState('current');

  // Sample data - replace with actual data from your backend
  const monthlyData = [
    { name: 'شنبه', حاضر: 42, غایب: 3 },
    { name: 'یکشنبه', حاضر: 40, غایب: 5 },
    { name: 'دوشنبه', حاضر: 45, غایب: 0 },
    { name: 'سه شنبه', حاضر: 39, غایب: 6 },
    { name: 'چهارشنبه', حاضر: 41, غایب: 4 },
    { name: 'پنج شنبه', حاضر: 38, غایب: 7 },
  ];

  const attendanceDetails = [
    {
      student: 'علی محمدی',
      class: 'کلاس 101',
      status: 'حاضر',
      date: '1402/12/15',
    },
    {
      student: 'رضا احمدی',
      class: 'کلاس 102',
      status: 'غایب',
      date: '1402/12/15',
    },
    // Add more sample data as needed
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '100vh' }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          textAlign: 'right',
        }}
      >
        گزارش حضور و غیاب
      </Typography>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>کلاس</InputLabel>
                <Select
                  value={selectedClass}
                  label="کلاس"
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <MenuItem value="all">همه کلاس‌ها</MenuItem>
                  <MenuItem value="101">کلاس 101</MenuItem>
                  <MenuItem value="102">کلاس 102</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>ماه</InputLabel>
                <Select
                  value={selectedMonth}
                  label="ماه"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <MenuItem value="current">ماه جاری</MenuItem>
                  <MenuItem value="last">ماه گذشته</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'right' }}>
                نمودار حضور و غیاب هفتگی
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="حاضر" fill={theme.palette.primary.main} />
                    <Bar dataKey="غایب" fill={theme.palette.error.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">کل دانش‌آموزان</Typography>
                  <Typography variant="h3">45</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">حاضرین امروز</Typography>
                  <Typography variant="h3">42</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: theme.palette.error.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">غایبین امروز</Typography>
                  <Typography variant="h3">3</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Detailed Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'right' }}>
                جزئیات حضور و غیاب
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">نام دانش‌آموز</TableCell>
                      <TableCell align="right">کلاس</TableCell>
                      <TableCell align="right">وضعیت</TableCell>
                      <TableCell align="right">تاریخ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceDetails.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell align="right">{row.student}</TableCell>
                        <TableCell align="right">{row.class}</TableCell>
                        <TableCell align="right">{row.status}</TableCell>
                        <TableCell align="right">{row.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttendanceReports;