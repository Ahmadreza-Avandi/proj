import React from 'react';
import { 
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  Grow,
} from '@mui/material';
import { useRouter } from 'next/router';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  count, 
  path, 
  delay 
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  count?: number;
  path: string;
  delay: number;
}) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Grow in={true} style={{ transformOrigin: '0 0 0' }} timeout={1000 + delay}>
      <Card 
        sx={{
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <CardActionArea 
          onClick={() => router.push(path)}
          sx={{ height: '100%', p: 1 }}
        >
          <CardContent>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                color: 'primary.main'
              }}
            >
              <Icon sx={{ fontSize: 40, mr: 2 }} />
              {count !== undefined && (
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    ml: 'auto',
                    fontWeight: 'bold',
                    color: 'text.primary'
                  }}
                >
                  {count}
                </Typography>
              )}
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                mb: 1,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                minHeight: '40px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grow>
  );
};

const Home = () => {
  const dashboardItems = [
    {
      title: 'حاضرین و غایبین',
      description: 'مدیریت و مشاهده وضعیت حضور و غیاب دانش آموزان',
      icon: PeopleOutlineIcon,
      path: '/attendance',
    },
    {
      title: 'کاربران',
      description: 'مدیریت کاربران و دسترسی های سیستم',
      icon: PersonAddIcon,
      path: '/viewusers',
    },
    {
      title: 'کلاس ها',
      description: 'مدیریت کلاس ها و برنامه های درسی',
      icon: SchoolIcon,
      path: '/',
    },
    {
      title: 'دوربین آنلاین',
      description: 'مشاهده دوربین های مدار بسته کلاس ها',
      icon: CameraAltIcon,
      path: '/onlinecam/class1',
    },
    {
      title: 'اماکن',
      description: 'مدیریت و مشاهده مکان های مختلف مدرسه',
      icon: LocationOnIcon,
      path: '/viewplace',
    },
    {
      title: 'گزارش حضور و غیاب',
      description: 'گزارش های آماری از وضعیت حضور و غیاب',
      icon: AssignmentIcon,
      path: '/reports',
    },
    {
      title: 'برنامه زمانی',
      description: 'مدیریت زمان بندی کلاس ها و برنامه ها',
      icon: AccessTimeIcon,
      path: '/',
    },
    {
      title: 'آمار کلی',
      description: 'نمودارها و آمار کلی سیستم',
      icon: TrendingUpIcon,
      path: '/Statistics',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: 'text.primary',
          textAlign: 'right'
        }}
      >
        داشبورد مدیریت
      </Typography>
      
      <Grid container spacing={3}>
        {dashboardItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.title}>
            <DashboardCard {...item} delay={index * 100} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;