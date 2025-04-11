import '@/styles/globals.css';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import axios from 'axios';

function MyApp({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await axios.get('/api/validate-token', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { valid, user } = response.data;

          if (valid) {
            setIsAuthenticated(true);
            setUserRole(user.role);

            if (router.pathname === '/login') {
              if (user.role === 'ADMIN') {
                router.replace('/admin-dashboard');
              } else if (user.role === 'USER') {
                router.replace('/user-dashboard');
              }
            }
          } else {
            localStorage.removeItem('access_token');
            setIsAuthenticated(false);
            router.push('/login');
          }
        } catch (error) {
          console.error('Error during authentication check:', error);
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
          router.push('/login');
        }
      } else {
        setIsAuthenticated(false);

        // اجازه دسترسی به صفحه register2 بدون نیاز به ورود
        if (router.pathname !== '/register2') {
          router.push('/login');
        }
      }
      setLoading(false);
    };

    if (router.pathname !== '/login') {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [router.pathname]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#304967',
      },
      secondary: {
        main: '#FF5722',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
        secondary: darkMode ? '#cccccc' : '#333333',
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e1e1e' : '#304967',
            color: darkMode ? '#ffffff' : '#ffffff',
          },
        },
      },
    },
  });

  if (loading) {
    return null;
  }

  if (!isAuthenticated && router.pathname !== '/login' && router.pathname !== '/register2') {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isAuthenticated ? (
        <Layout darkMode={darkMode} setDarkMode={setDarkMode} userRole={userRole}>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
