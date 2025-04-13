import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit2, Trash2, Shield } from 'lucide-react';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  permissions: Record<string, boolean> | string;
}

const RoleTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [roles, setRoles] = useState<Role[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogRole, setDialogRole] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Role[]>('http://localhost:3001/users/role');
        const filteredRoles = response.data.map((role: Role) => {
          if (typeof role.permissions === 'string') {
            role.permissions = JSON.parse(role.permissions);
          }
          return role;
        }).filter((role: Role) => role.name);
        setRoles(filteredRoles);
        setError(null);
      } catch (err) {
        setError('خطا در دریافت اطلاعات از سرور');
        showAlert('خطا در دریافت اطلاعات از سرور', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const handleEditClick = (role: Role) => {
    setEditedRoleName(role.name);
    setDialogRole(role);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3001/users/role/${id}`);
      setRoles(roles.filter(role => role.id !== id));
      showAlert('نقش با موفقیت حذف شد', 'success');
    } catch (error) {
      showAlert('خطا در حذف نقش', 'error');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogRole(null);
  };

  const handleUpdateRole = async () => {
    if (dialogRole) {
      try {
        await axios.patch(`http://localhost:3001/users/role/${dialogRole.id}`, {
          name: editedRoleName,
          permissions: dialogRole.permissions,
        });
        setRoles(roles.map(role => (role.id === dialogRole.id ? { ...role, name: editedRoleName } : role)));
        handleCloseDialog();
        showAlert('نقش با موفقیت به‌روزرسانی شد', 'success');
      } catch (error) {
        showAlert('خطا در به‌روزرسانی نقش', 'error');
      }
    }
  };

  const renderPermissions = (permissions: Record<string, boolean>) => {
    const accessiblePages = Object.entries(permissions).filter(([_, hasAccess]) => hasAccess);
    return accessiblePages.map(([page]) => (
      <Chip
        key={page}
        label={page}
        size="small"
        color="primary"
        sx={{ m: 0.5 }}
      />
    ));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const MobileView = () => (
    <Box sx={{ p: 2, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
      {roles.length > 0 ? (
        roles.map((role) => (
          <Card 
            key={role.id} 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {role.name}
                </Typography>
                
                <Box sx={{ mt: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    دسترسی‌ها:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderPermissions(role.permissions as Record<string, boolean>)}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEditClick(role)}
                  startIcon={<Edit2 size={18} />}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  ویرایش
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleDeleteClick(role.id)}
                  startIcon={<Trash2 size={18} />}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                  }}
                >
                  حذف
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography align="center" color="text.secondary">
          هیچ نقشی یافت نشد
        </Typography>
      )}
    </Box>
  );

  const DesktopView = () => (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'calc(100vh - 180px)',
        overflow: 'auto',
        width: '100%',
      }}
    >
      <Table stickyHeader sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell 
              width="25%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              نام نقش
            </TableCell>
            <TableCell 
              width="50%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              دسترسی‌ها
            </TableCell>
            <TableCell 
              width="25%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              عملیات
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.length > 0 ? (
            roles.map((role) => (
              <TableRow
                key={role.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell width="25%">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    {role.name}
                  </div>
                </TableCell>
                <TableCell width="50%">
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderPermissions(role.permissions as Record<string, boolean>)}
                  </Box>
                </TableCell>
                <TableCell width="25%">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditClick(role)}
                      startIcon={<Edit2 size={18} />}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                      }}
                    >
                      ویرایش
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteClick(role.id)}
                      startIcon={<Trash2 size={18} />}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                      }}
                    >
                      حذف
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography color="text.secondary">
                  هیچ نقشی یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ px: 0.5, height: '100%' }}>
      {isMobile ? <MobileView /> : <DesktopView />}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          className: "rounded-lg"
        }}
      >
        <DialogTitle className="bg-gray-50 border-b">
          <Typography variant="h6">ویرایش نقش</Typography>
        </DialogTitle>
        <DialogContent className="mt-4">
          <DialogContentText className="mb-4">
            لطفاً نام جدید نقش را وارد کنید.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="نام نقش"
            type="text"
            fullWidth
            variant="outlined"
            value={editedRoleName}
            onChange={(e) => setEditedRoleName(e.target.value)}
            className="rtl-input"
          />
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
          >
            انصراف
          </Button>
          <Button
            onClick={handleUpdateRole}
            variant="contained"
            color="primary"
          >
            ذخیره تغییرات
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleTable;