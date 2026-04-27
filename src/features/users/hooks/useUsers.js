import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { userService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateUserForm,
} from '../utils';

import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

export const useUsers = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const [users, setUsers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
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
  
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  const isInitialLoad = useRef(true);
  const isFetchingUsersRef = useRef(false);

  // Pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize,
    totalItems,
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    goToPage,
    changePageSize,
  } = pagination;

  // Debounced search - trims and only triggers if content changed
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch !== debouncedSearchTerm) {
        setDebouncedSearchTerm(trimmedSearch);
        if (!isInitialLoad.current) {
          goToPage(1);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm, goToPage]);

  // Fetch users with pagination
  const loadUsers = useCallback(async () => {
    if (isFetchingUsersRef.current) return;
    isFetchingUsersRef.current = true;
    setIsLoading(true);
    try {
      const result = await userService.fetchUsersPaginated({
        page: currentPage,
        pageSize: pageSize,
        search: debouncedSearchTerm,
      });
      if (result.success) {
        setUsers(result.data);
        setTotalItems(result.pagination.totalItems);
      } else {
        toast.error(result.error || 'Failed to load users');
        setUsers([]);
      }
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingUsersRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

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
        await loadUsers();
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
        await loadUsers();
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      } else {
        toast.error(result.error || 'Failed to update user');
      }
    }
    return true;
  }, [formData, users, selectedUser, formMode, closeFormDialog, loadUsers]);

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
      await loadUsers();
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    } else {
      toast.error(result.error || 'Failed to delete user');
    }
    return false;
  }, [userToDelete, closeDeleteDialog, loadUsers]);


  const stats = {
    total: totalItems,
    active: users.filter((u) => u.status === 'Active').length,
    admins: users.filter((u) => u.role === 'Admin').length,
  };

  return {
    // Data
    users,
    totalItems,
    stats,
    isLoading,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

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
