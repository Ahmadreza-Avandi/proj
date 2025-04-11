"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Statistics = () => {
  const theme = useTheme();

  // Sample data - replace with actual data from your backend
  const monthlyAttendance = [
    { month: 'فروردین', حضور: 95 },
    { month: 'اردیبهشت', حضور: 92 },
    { month: 'خرداد', حضور: 98 },
    { month: 'تیر', حضور: 90 },
    { month: 'مرداد', حضور: 85 },
    { month: 'شهریور', حضور: 88 },
  ];

  const classDistribution = [
    { name: 'کلاس 101', value: 30 },
    { name: 'کلاس 102', value: 25 },
    { name: 'کلاس 103', value: 28 },
    { name: 'کلاس 104', value: 22 },
  ];

  const performanceData = [
    { month: 'فروردین', عملکرد: 85 },
    { month: 'اردیبهشت', عملکرد: 75 },
    { month: 'خرداد', عملکرد: 90 },
    { month: 'تیر', عملکرد: 95 },
    { month: 'مرداد', عملکرد: 88 },
    { month: 'شهریور', عملکرد: 92 },
  ];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
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
        آمار کلی سیستم
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">کل دانش‌آموزان</Typography>
                  <Typography variant="h3">105</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.secondary.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">تعداد کلاس‌ها</Typography>
                  <Typography variant="h3">4</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.success.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">میانگین حضور</Typography>
                  <Typography variant="h3">91%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: theme.palette.warning.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">عملکرد کلی</Typography>
                  <Typography variant="h3">87%</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Monthly Attendance Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'right' }}>
                روند حضور ماهانه
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <AreaChart data={monthlyAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="حضور"
                      fill={theme.palette.primary.main}
                      stroke={theme.palette.primary.dark}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Class Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'right' }}>
                توزیع دانش‌آموزان در کلاس‌ها
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Trend */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'right' }}>
                روند عملکرد
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="عملکرد"
                      stroke={theme.palette.success.main}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Statistics;