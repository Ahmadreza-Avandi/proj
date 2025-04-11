import React, { useState, useEffect, useMemo } from 'react';
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
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  FormControl,
} from '@mui/material';
import { Edit2, Trash2, Save, X, Search } from 'lucide-react';
import axios from 'axios';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: string | Permission[];
}

interface ClassType {
  id: number;
  name: string;
  major: string;
  grade: string;
}

interface User {
  id: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  roleId: number;
  role: Role;
  className?: string;
  majorName?: string;
  gradeName?: string;
  classId?: number;
}

const UsersTable: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedRole, setSelectedRole] = useState<number | ''>('');
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({ open: true, message, severity });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classesResponse, rolesResponse, usersResponse] = await Promise.all([
        axios.get<ClassType[]>('/api/classes'),
        axios.get<Role[]>('/api/roles'),
        axios.get<User[]>('/api/user.view', {
          params: {
            classId: selectedClass || undefined,
            roleId: selectedRole || undefined,
          },
        }),
      ]);
      setClasses(classesResponse.data);
      setRoles(rolesResponse.data);
      setUsers(usersResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('خطا در دریافت اطلاعات از سرور');
      showAlert('خطا در دریافت اطلاعات از سرور', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedRole]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nationalCode.includes(searchQuery)
    );
  }, [users, searchQuery]);

  const toggleEditMode = (id: number) => {
    setEditMode(prev => ({ ...prev, [id]: !prev[id] }));
    if (editMode[id]) {
      setEditedUser({});
    }
  };

  const handleEditChange = (field: keyof User, value: string | number) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (id: number) => {
    try {
      await axios.put(`/api/users/${id}`, {
        ...editedUser,
        classId: editedUser.classId || null,
      });
      toggleEditMode(id);
      setEditedUser({});
      fetchData();
      showAlert('اطلاعات کاربر با موفقیت به‌روزرسانی شد', 'success');
    } catch (err) {
      console.error('Error updating user:', err);
      showAlert('خطا در به‌روزرسانی اطلاعات کاربر', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      showAlert('کاربر با موفقیت حذف شد', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showAlert('خطا در حذف کاربر', 'error');
    }
  };

  const renderPermissions = (permissions: string | Permission[]) => {
    let parsedPermissions: any;
    if (typeof permissions === 'string') {
      try {
        parsedPermissions = JSON.parse(permissions);
      } catch (error) {
        return <Typography color="error">خطا در نمایش مجوزها</Typography>;
      }
    } else {
      parsedPermissions = permissions;
    }

    if (Array.isArray(parsedPermissions)) {
      return parsedPermissions.map((perm: Permission) => (
        <Chip key={perm.id} label={perm.name} size="small" color="primary" sx={{ m: 0.5 }} />
      ));
    } else if (typeof parsedPermissions === 'object' && parsedPermissions !== null) {
      return Object.entries(parsedPermissions).map(([key, value]) => (
        <Chip key={key} label={`${key}: ${value ? 'دارد' : 'ندارد'}`} size="small" color={value ? 'primary' : 'default'} sx={{ m: 0.5 }} />
      ));
    }
    return <Typography color="text.secondary">بدون مجوز</Typography>;
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

  const ClassFilter = () => (
    <FormControl sx={{ minWidth: 200 }}>
      <Select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value === '' ? '' : Number(e.target.value))}
        displayEmpty
        size="small"
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="">همه کلاس‌ها</MenuItem>
        {classes.map(cls => (
          <MenuItem key={cls.id} value={cls.id}>
            {cls.name} ({cls.grade} - {cls.major})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const RoleFilter = () => (
    <FormControl sx={{ minWidth: 200 }}>
      <Select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value === '' ? '' : Number(e.target.value))}
        displayEmpty
        size="small"
        sx={{ borderRadius: 2 }}
      >
        <MenuItem value="">همه نقش‌ها</MenuItem>
        {roles.map(role => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const SearchBar = () => (
    <Box sx={{
      mb: 3,
      px: 2,
      display: 'flex',
      gap: 2,
      flexDirection: { xs: 'column', sm: 'row' }
    }}>
      <ClassFilter />
      <RoleFilter />
      <TextField
        fullWidth
        placeholder="جستجو بر اساس نام، نقش یا کد ملی..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'background.paper',
          },
        }}
      />
    </Box>
  );

  const commonButtonStyles = {
    borderRadius: 1.5,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
  };

  const MobileView = () => (
    <Box sx={{ p: 2, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
      {filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
          <Card
            key={user.id}
            sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {editMode[user.id] ? (
                    <TextField
                      fullWidth
                      value={editedUser.fullName ?? user.fullName}
                      onChange={(e) => handleEditChange('fullName', e.target.value)}
                      size="small"
                    />
                  ) : (
                    user.fullName
                  )}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {editMode[user.id] ? (
                    <>
                      <TextField
                        label="کد ملی"
                        fullWidth
                        value={editedUser.nationalCode ?? user.nationalCode}
                        onChange={(e) => handleEditChange('nationalCode', e.target.value)}
                        size="small"
                      />
                      <TextField
                        label="شماره تلفن"
                        fullWidth
                        value={editedUser.phoneNumber ?? user.phoneNumber}
                        onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                        size="small"
                      />
                      <Select
                        fullWidth
                        value={editedUser.roleId ?? user.roleId}
                        onChange={(e) =>
                          handleEditChange('roleId', Number(e.target.value))
                        }
                        size="small"
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Select
                        fullWidth
                        value={editedUser.classId ?? user.classId ?? ''}
                        onChange={(e) =>
                          handleEditChange(
                            'classId',
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        size="small"
                      >
                        <MenuItem value="">بدون کلاس</MenuItem>
                        {classes.map(cls => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name} ({cls.grade} - {cls.major})
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        کد ملی: {user.nationalCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        شماره تلفن: {user.phoneNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        نقش: {user.role.name}
                      </Typography>
                      {user.className && (
                        <Typography variant="body2" color="text.secondary">
                          کلاس: {user.className} ({user.gradeName} - {user.majorName})
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
                <Box sx={{ mt: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    مجوزها:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {renderPermissions(user.role.permissions)}
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2.5 }}>
                {editMode[user.id] ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditSubmit(user.id)}
                      startIcon={<Save size={18} />}
                      size="small"
                      sx={commonButtonStyles}
                    >
                      ذخیره
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => toggleEditMode(user.id)}
                      startIcon={<X size={18} />}
                      size="small"
                      sx={{ borderRadius: 1.5, textTransform: 'none' }}
                    >
                      لغو
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleEditMode(user.id)}
                      startIcon={<Edit2 size={18} />}
                      size="small"
                      sx={commonButtonStyles}
                    >
                      ویرایش
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      startIcon={<Trash2 size={18} />}
                      size="small"
                      sx={commonButtonStyles}
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
          هیچ داده‌ای یافت نشد
        </Typography>
      )}
    </Box>
  );
  
  const DesktopView = () => (
    <Box sx={{ height: 'calc(100vh - 180px)', overflow: 'hidden' }}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Table stickyHeader aria-label="users table">
          <TableHead>
            <TableRow>
              {['نام کامل', 'کد ملی', 'شماره تلفن', 'نقش', 'کلاس', 'مجوزها', 'عملیات'].map(
                header => (
                  <TableCell
                    key={header}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      fontWeight: 'bold',
                      minWidth: header === 'مجوزها' ? 250 : 150,
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <TableRow
                  key={user.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell>
                    {editMode[user.id] ? (
                      <TextField
                        fullWidth
                        value={editedUser.fullName ?? user.fullName}
                        onChange={(e) => handleEditChange('fullName', e.target.value)}
                        size="small"
                      />
                    ) : (
                      user.fullName
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <TextField
                        fullWidth
                        value={editedUser.nationalCode ?? user.nationalCode}
                        onChange={(e) => handleEditChange('nationalCode', e.target.value)}
                        size="small"
                      />
                    ) : (
                      user.nationalCode
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <TextField
                        fullWidth
                        value={editedUser.phoneNumber ?? user.phoneNumber}
                        onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                        size="small"
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <Select
                        fullWidth
                        value={editedUser.roleId ?? user.roleId}
                        onChange={(e) =>
                          handleEditChange('roleId', Number(e.target.value))
                        }
                        size="small"
                      >
                        {roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      user.role.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[user.id] ? (
                      <Select
                        fullWidth
                        value={editedUser.classId ?? user.classId ?? ''}
                        onChange={(e) =>
                          handleEditChange(
                            'classId',
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        size="small"
                      >
                        <MenuItem value="">بدون کلاس</MenuItem>
                        {classes.map(cls => (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.name} ({cls.grade} - {cls.major})
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      user.className
                        ? `${user.className} (${user.gradeName} - ${user.majorName})`
                        : '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {renderPermissions(user.role.permissions)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {editMode[user.id] ? (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEditSubmit(user.id)}
                            startIcon={<Save size={18} />}
                            size="small"
                            sx={commonButtonStyles}
                          >
                            ذخیره
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => toggleEditMode(user.id)}
                            startIcon={<X size={18} />}
                            size="small"
                            sx={{ borderRadius: 1.5, textTransform: 'none' }}
                          >
                            لغو
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => toggleEditMode(user.id)}
                            startIcon={<Edit2 size={18} />}
                            size="small"
                            sx={commonButtonStyles}
                          >
                            ویرایش
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(user.id)}
                            startIcon={<Trash2 size={18} />}
                            size="small"
                            sx={commonButtonStyles}
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
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary">هیچ داده‌ای یافت نشد</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
  

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <SearchBar />
      {isMobile ? <MobileView /> : <DesktopView />}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled" sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersTable;
