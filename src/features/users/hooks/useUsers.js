import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateUserForm,
} from '../utils';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      const result = await userService.fetchUsers();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error(result.error || 'Failed to load users');
        setUsers([]);
      }
      setIsLoading(false);
    };

    loadUsers();
  }, []);

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
      password: '',
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

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateUserForm(formData, users, selectedUser?.id);
    if (!isValid) {
      setFormErrors(errors);
      return false;
    }

    if (formMode === 'create') {
      const result = await userService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });
      if (result.success) {
        const usersResult = await userService.fetchUsers();
        if (usersResult.success) {
          setUsers(usersResult.data);
        }
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_CREATE);
      } else {
        toast.error(result.error || 'Failed to create user');
      }
    } else {
      const result = await userService.updateUser(selectedUser.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      });
      if (result.success) {
        const usersResult = await userService.fetchUsers();
        if (usersResult.success) {
          setUsers(usersResult.data);
        }
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      } else {
        toast.error(result.error || 'Failed to update user');
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

  const handleDelete = useCallback(async () => {
    if (!userToDelete) return false;
    const result = await userService.deleteUser(userToDelete.id);
    if (result.success) {
      const usersResult = await userService.fetchUsers();
      if (usersResult.success) {
        setUsers(usersResult.data);
      }
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
    return false;
  }, [userToDelete, closeDeleteDialog]);


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

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
};

export default useUsers;

