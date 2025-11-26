import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { userService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  PERMISSION_MODULES,
  PERMISSION_ACTIONS,
  validateUserForm,
} from '../utils';

export const useUsers = () => {
  const [users, setUsers] = useState(() => userService.fetchUsers());
  const isLoading = false;

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userForPermissions, setUserForPermissions] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [searchTerm, setSearchTerm] = useState('');

  // Permissions state
  const [permissions, setPermissions] = useState({});

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedUser(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((user) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      permissions: user.permissions || {},
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsFormOpen(true);
  }, []);

  const closeFormDialog = useCallback(() => {
    setIsFormOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const handleSubmit = useCallback(() => {
    const { isValid, errors } = validateUserForm(formData, users, selectedUser?.id);
    if (!isValid) {
      setFormErrors(errors);
      return false;
    }

    if (formMode === 'create') {
      const newUser = userService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions || {},
      });
      setUsers(userService.fetchUsers());
      closeFormDialog();
      toast.success(UI_TEXT.TOAST_CREATE);
    } else {
      const updated = userService.updateUser(selectedUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions || {},
      });
      if (updated) {
        setUsers(userService.fetchUsers());
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      }
    }
    return true;
  }, [formData, users, selectedUser, formMode, closeFormDialog]);

  const openDeleteDialog = useCallback((user) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setUserToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!userToDelete) return false;
    const success = userService.deleteUser(userToDelete.id);
    if (success) {
      setUsers(userService.fetchUsers());
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    }
    return false;
  }, [userToDelete, closeDeleteDialog]);

  const openPermissionsDialog = useCallback((user) => {
    setUserForPermissions(user);
    setPermissions(user.permissions || {});
    setIsPermissionsOpen(true);
  }, []);

  const closePermissionsDialog = useCallback(() => {
    setUserForPermissions(null);
    setPermissions({});
    setIsPermissionsOpen(false);
  }, []);

  const handlePermissionToggle = useCallback((module, action) => {
    setPermissions((prev) => {
      const modulePerms = prev[module] || {};
      return {
        ...prev,
        [module]: {
          ...modulePerms,
          [action]: !modulePerms[action],
        },
      };
    });
  }, []);

  const handleSavePermissions = useCallback(() => {
    if (!userForPermissions) return false;
    const updated = userService.updateUserPermissions(userForPermissions.id, permissions);
    if (updated) {
      setUsers(userService.fetchUsers());
      closePermissionsDialog();
      toast.success(UI_TEXT.TOAST_PERMISSIONS_UPDATE);
      return true;
    }
    return false;
  }, [userForPermissions, permissions, closePermissionsDialog]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'Active').length,
    admins: users.filter((u) => u.role === 'Admin').length,
  };

  return {
    // Data
    users: filteredUsers,
    allUsers: users,
    stats,
    isLoading,

    // Search
    searchTerm,
    setSearchTerm,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedUser,

    // Delete state
    isDeleteOpen,
    userToDelete,

    // Permissions state
    isPermissionsOpen,
    userForPermissions,
    permissions,
    permissionModules: PERMISSION_MODULES,
    permissionActions: PERMISSION_ACTIONS,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    openPermissionsDialog,
    closePermissionsDialog,
    handlePermissionToggle,
    handleSavePermissions,
  };
};

export default useUsers;

