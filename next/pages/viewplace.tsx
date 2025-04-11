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
  Select,
  MenuItem,
  Paper,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Edit2, Trash2, Save, X, MapPin, User, GraduationCap, BookOpen } from 'lucide-react';

interface Location {
  id: number;
  title: string;
  representative: string;
  grade: string;
  major: string;
}

const grades = ['دهم', 'یازدهم', 'دوازدهم'];
const majors = ['ماشین ابزار', 'مکاترونیک', 'شبکه و نرم‌افزار'];

const LocationsTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [locations, setLocations] = useState<Location[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [locationToSave, setLocationToSave] = useState<number | null>(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/locations');
      if (!response.ok) {
        throw new Error('خطا در دریافت مکان‌ها');
      }
      const data = await response.json();
      setLocations(data);
      setError(null);
    } catch (error) {
      setError('خطا در دریافت اطلاعات از سرور');
      showAlert('خطا در دریافت اطلاعات از سرور', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({
      open: true,
      message,
      severity,
    });
  };

  const toggleEditMode = (id: number) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (field: keyof Location, value: string, id: number) => {
    setLocations(prev =>
      prev.map(loc => (loc.id === id ? { ...loc, [field]: value } : loc))
    );
  };

  const handleDeleteOpen = (id: number) => {
    setLocationToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setLocationToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleSaveOpen = (id: number) => {
    setLocationToSave(id);
    setOpenSaveDialog(true);
  };

  const handleSaveClose = () => {
    setLocationToSave(null);
    setOpenSaveDialog(false);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        const response = await fetch(
          `http://localhost:3001/locations/${locationToDelete}`,
          { method: 'DELETE' }
        );
        if (!response.ok) {
          throw new Error('خطا در حذف مکان');
        }
        setLocations(locations.filter(loc => loc.id !== locationToDelete));
        showAlert('مکان با موفقیت حذف شد', 'success');
      } catch (error) {
        showAlert('خطا در حذف مکان', 'error');
      }
      handleDeleteClose();
    }
  };

  const confirmSave = async () => {
    if (locationToSave !== null) {
      const updatedLocation = locations.find(loc => loc.id === locationToSave);
      if (updatedLocation) {
        try {
          const response = await fetch(
            `http://localhost:3001/locations/${locationToSave}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedLocation),
            }
          );
          if (!response.ok) {
            throw new Error('خطا در به‌روزرسانی مکان');
          }
          toggleEditMode(locationToSave);
          showAlert('مکان با موفقیت به‌روزرسانی شد', 'success');
        } catch (error) {
          showAlert('خطا در به‌روزرسانی مکان', 'error');
        }
      }
      handleSaveClose();
    }
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
    <Box 
      sx={{ 
        height: 'calc(100vh - 180px)',
        overflowY: 'auto',
      }}
    >
      {locations.length > 0 ? (
        locations.map((location) => (
          <Card 
            key={location.id} 
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
                  <MapPin className="w-5 h-5 text-primary" />
                  {editMode[location.id] ? (
                    <TextField
                      value={location.title}
                      onChange={(e) => handleInputChange('title', e.target.value, location.id)}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    location.title
                  )}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {editMode[location.id] ? (
                    <>
                      <TextField
                        label="نماینده"
                        value={location.representative}
                        onChange={(e) => handleInputChange('representative', e.target.value, location.id)}
                        fullWidth
                        size="small"
                      />
                      <Select
                        value={location.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value as string, location.id)}
                        fullWidth
                        size="small"
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        value={location.major}
                        onChange={(e) => handleInputChange('major', e.target.value as string, location.id)}
                        fullWidth
                        size="small"
                      >
                        {majors.map((major) => (
                          <MenuItem key={major} value={major}>
                            {major}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <User size={18} className="text-gray-500" />
                        <Typography variant="body2" color="text.secondary">
                          {location.representative}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <GraduationCap size={18} className="text-gray-500" />
                        <Typography variant="body2" color="text.secondary">
                          {location.grade}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookOpen size={18} className="text-gray-500" />
                        <Typography variant="body2" color="text.secondary">
                          {location.major}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
                {editMode[location.id] ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveOpen(location.id)}
                      startIcon={<Save size={18} />}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                      }}
                    >
                      ذخیره
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => toggleEditMode(location.id)}
                      startIcon={<X size={18} />}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      لغو
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleEditMode(location.id)}
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
                      onClick={() => handleDeleteOpen(location.id)}
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
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography align="center" color="text.secondary">
          هیچ مکانی یافت نشد
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
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell 
              width="20%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              عنوان
            </TableCell>
            <TableCell 
              width="20%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              نماینده
            </TableCell>
            <TableCell 
              width="20%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              پایه
            </TableCell>
            <TableCell 
              width="20%"
              sx={{ 
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              رشته
            </TableCell>
            <TableCell 
              width="20%"
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
          {locations.length > 0 ? (
            locations.map((location) => (
              <TableRow
                key={location.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell width="20%">
                  {editMode[location.id] ? (
                    <TextField
                      value={location.title}
                      onChange={(e) => handleInputChange('title', e.target.value, location.id)}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {location.title}
                    </div>
                  )}
                </TableCell>
                <TableCell width="20%">
                  {editMode[location.id] ? (
                    <TextField
                      value={location.representative}
                      onChange={(e) => handleInputChange('representative', e.target.value, location.id)}
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {location.representative}
                    </div>
                  )}
                </TableCell>
                <TableCell width="20%">
                  {editMode[location.id] ? (
                    <Select
                      value={location.grade}
                      onChange={(e) => handleInputChange('grade', e.target.value as string, location.id)}
                      fullWidth
                      size="small"
                    >
                      {grades.map((grade) => (
                        <MenuItem key={grade} value={grade}>
                          {grade}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      {location.grade}
                    </div>
                  )}
                </TableCell>
                <TableCell width="20%">
                  {editMode[location.id] ? (
                    <Select
                      value={location.major}
                      onChange={(e) => handleInputChange('major', e.target.value as string, location.id)}
                      fullWidth
                      size="small"
                    >
                      {majors.map((major) => (
                        <MenuItem key={major} value={major}>
                          {major}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      {location.major}
                    </div>
                  )}
                </TableCell>
                <TableCell width="20%">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {editMode[location.id] ? (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSaveOpen(location.id)}
                          startIcon={<Save size={18} />}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': { boxShadow: 'none' },
                          }}
                        >
                          ذخیره
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => toggleEditMode(location.id)}
                          startIcon={<X size={18} />}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                          }}
                        >
                          لغو
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => toggleEditMode(location.id)}
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
                          onClick={() => handleDeleteOpen(location.id)}
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
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary">
                  هیچ مکانی یافت نشد
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        px: 0.5,
      }}
    >
      {isMobile ? <MobileView /> : <DesktopView />}

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        maxWidth="sm"
        PaperProps={{
          className: "rounded-lg"
        }}
      >
        <DialogTitle className="bg-gray-50 border-b">
          <Typography variant="h6">تایید حذف</Typography>
        </DialogTitle>
        <DialogContent className="mt-4">
          <DialogContentText>
            آیا از حذف این مکان اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={handleDeleteClose} variant="outlined" color="inherit">
            انصراف
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSaveDialog}
        onClose={handleSaveClose}
        maxWidth="sm"
        PaperProps={{
          className: "rounded-lg"
        }}
      >
        <DialogTitle className="bg-gray-50 border-b">
          <Typography variant="h6">تایید ذخیره‌سازی</Typography>
        </DialogTitle>
        <DialogContent className="mt-4">
          <DialogContentText>
            آیا از ذخیره تغییرات اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 border-t">
          <Button onClick={handleSaveClose} variant="outlined" color="inherit">
            انصراف
          </Button>
          <Button onClick={confirmSave} variant="contained" color="primary">
            ذخیره
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

export default LocationsTable;