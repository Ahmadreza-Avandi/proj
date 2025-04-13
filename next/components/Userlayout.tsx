import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
  CircularProgress,
  Backdrop,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Fade,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

const drawerWidth = 240;
const secAppbarHeight = 64;

const ToolbarOffset = styled('div')(({ theme }: { theme: Theme }) => ({
  minHeight: secAppbarHeight,
  backgroundColor: 'transparent',
  position: 'relative',
  zIndex: 1,
}));

interface MainContentProps {
  drawerOpen: boolean;
}

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  userRole: string | null;
}

interface MenuItem {
  text: string;
  id: number;
  icon: JSX.Element;
  path: string | false;
  sublists?: SubMenuItem[];
}

interface SubMenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

const MainContent = styled('div', {
  shouldForwardProp: (prop: string) => prop !== 'drawerOpen',
})<MainContentProps>(({ theme, drawerOpen }: { theme: Theme, drawerOpen: boolean }) => ({
  zIndex: '3',
  width: '100%',
  marginRight: -drawerWidth,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

const PageContent = styled('div')(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  height: 'fit-content',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const StyledDrawer = styled(Drawer)(({ theme }: { theme: Theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderLeft: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
  },
}));

const ProfileMenu: React.FC<{ userRole: string | null }> = ({ userRole }) => {
  const getRoleDisplay = (role: string | null): string => {
    return 'کاربر';
  };

  return (
    <Box sx={{ 
      padding: 2,
      minWidth: 200,
      borderBottom: '1px solid',
      borderColor: 'divider',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <AccountCircleIcon />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="medium">
          {getRoleDisplay(userRole)}
        </Typography>
      </Box>
    </Box>
  );
};

export function UserLayout({ children, darkMode, setDarkMode, userRole }: LayoutProps) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawer = () => setDrawerOpen(!drawerOpen);

  const navigate = (path: string) => router.push(path);

  const handleMenuToggle = (id: number) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMenuClick = (item: MenuItem) => {
    if (typeof item.path === 'string') {
      navigate(item.path);
    } else {
      handleMenuToggle(item.id);
    }
  };

  // Simplified menu items for regular users
  const menuItems: MenuItem[] = [
    {
      text: 'داشبورد',
      id: 1,
      icon: <DashboardIcon />,
      path: '/user-dashboard',
    },
    {
      text: 'حاضرین/غایبین',
      id: 2,
      icon: <PeopleOutlineIcon />,
      path: false,
      sublists: [
        {
          text: 'مشاهده حاضری ها',
          icon: <PersonOutlineIcon />,
          path: '/attendance',
        },
      ],
    },
  ];

  const toggleTheme = () => {
    setLoading(true);
    setTimeout(() => {
      setDarkMode(!darkMode);
      setLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.replace('/').then(() => {
      window.location.href = '/';
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileNavigation = (path: string) => {
    handleMenuClose();
    router.push(path);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row-reverse',
      height: '100vh',
      bgcolor: 'background.default',
      overflow: 'hidden',
    }}>
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <AppBar
        elevation={0}
        sx={{
          backgroundColor: darkMode ? '#1a1a1a' : '#304967',
          backdropFilter: 'blur(8px)',
          transition: 'background-color 0.3s ease',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              display: 'inline-block',
              margin: 1,
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            هنرستان جوار نفت
          </Typography>
          
          <IconButton
            color="inherit"
            onClick={handleDrawer}
            sx={{ 
              margin: 0.2,
              transition: 'transform 0.2s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={darkMode ? 'حالت روشن' : 'حالت تاریک'}>
              <IconButton
                color="inherit"
                onClick={toggleTheme}
                sx={{
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="پروفایل">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="خروج">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <ExitToAppIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            TransitionComponent={Fade}
            sx={{
              '& .MuiPaper-root': {
                borderRadius: 2,
                minWidth: 180,
                boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              },
            }}
          >
            <ProfileMenu userRole={userRole} />
            <MenuItem 
              onClick={() => handleProfileNavigation('/profile')}
              sx={{
                py: 1.5,
                px: 2,
                '&:hover': { backgroundColor: 'action.hover' },
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <Typography>مشخصات کاربری</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <MainContent drawerOpen={drawerOpen}>
        <ToolbarOffset />
        <PageContent>{children}</PageContent>
      </MainContent>

      <StyledDrawer
        variant="persistent"
        anchor="right"
        open={drawerOpen}
      >
        <ToolbarOffset />
        <List
          component="nav"
          sx={{
            '& .MuiListItemButton-root': {
              textAlign: 'right',
              borderRadius: 1,
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'translateX(-4px)',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
            },
          }}
        >
          {menuItems.map((item) => (
            <React.Fragment key={item.id}>
              <ListItemButton 
                onClick={() => handleMenuClick(item)}
                selected={router.pathname === item.path}
              >
                <ListItemIcon>
                  {React.cloneElement(item.icon, {
                    sx: { 
                      color: darkMode ? '#b0bec5' : '#607d8b',
                      transition: 'color 0.2s ease',
                    }
                  })}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.sublists && (
                  openMenuId === item.id ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
              {item.sublists && (
                <Collapse in={openMenuId === item.id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.sublists.map((subItem, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ pl: 4 }}
                        onClick={() => navigate(subItem.path)}
                        selected={router.pathname === subItem.path}
                      >
                        <ListItemIcon>
                          {React.cloneElement(subItem.icon, {
                            sx: { 
                              color: darkMode ? '#b0bec5' : '#607d8b',
                              transition: 'color 0.2s ease',
                            }
                          })}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </StyledDrawer>
    </Box>
  );
}

export default UserLayout;
