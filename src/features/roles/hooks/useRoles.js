import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { roleService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  PERMISSION_MODULES,
  UI_TEXT,
  validateRoleForm,
} from '../utils';

export const useRoles = () => {
  const [roles, setRoles] = useState(() => roleService.fetchRoles());
  const [users] = useState(() => roleService.fetchUsers());
  const isLoading = false;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedRole, setSelectedRole] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedRole(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((role) => {
    setFormMode('edit');
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
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

  const handlePermissionToggle = useCallback((module, action) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      const index = permissions.findIndex((perm) => perm.module === module);

      if (index >= 0) {
        const updatedActions = permissions[index].actions.includes(action)
          ? permissions[index].actions.filter((act) => act !== action)
          : [...permissions[index].actions, action];

        if (updatedActions.length === 0) {
          permissions.splice(index, 1);
        } else {
          permissions[index] = { ...permissions[index], actions: updatedActions };
        }
      } else {
        permissions.push({ module, actions: [action] });
      }

      return { ...prev, permissions };
    });
  }, []);

  const handleSelectAll = useCallback((module) => {
    const moduleConfig = PERMISSION_MODULES.find((item) => item.module === module);
    if (!moduleConfig) return;

    const allActions = moduleConfig.actions.map((action) => action.action);

    setFormData((prev) => {
      const permissions = [...prev.permissions];
      const index = permissions.findIndex((perm) => perm.module === module);
      const hasAll = index >= 0 && allActions.every((act) => permissions[index].actions.includes(act));

      if (hasAll) {
        if (index >= 0) permissions.splice(index, 1);
      } else if (index >= 0) {
        permissions[index] = { module, actions: allActions };
      } else {
        permissions.push({ module, actions: allActions });
      }

      return { ...prev, permissions };
    });
  }, []);

  const hasPermission = useCallback(
    (module, action) => {
      const permission = formData.permissions.find((perm) => perm.module === module);
      return permission ? permission.actions.includes(action) : false;
    },
    [formData.permissions]
  );

  const handleSubmit = useCallback(() => {
    const { isValid, errors } = validateRoleForm(formData, roles, selectedRole?.id);
    if (!isValid) {
      setFormErrors(errors);
      return false;
    }

    const payload = {
      id: selectedRole?.id ?? roleService.generateRoleId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      permissions: formData.permissions,
      createdAt: selectedRole?.createdAt ?? new Date().toISOString(),
    };

    const updated =
      formMode === 'edit'
        ? roles.map((role) => (role.id === payload.id ? payload : role))
        : [...roles, payload];

    roleService.saveRoles(updated);
    setRoles(updated);
    closeFormDialog();
    toast.success(formMode === 'edit' ? UI_TEXT.TOAST_UPDATE : UI_TEXT.TOAST_CREATE);
    return true;
  }, [formData, roles, selectedRole, formMode, closeFormDialog]);

  const openDeleteDialog = useCallback((role) => {
    const assignedUsers = users.filter((user) => user.role?.toLowerCase() === role.name.toLowerCase());
    if (assignedUsers.length > 0) {
      toast.error(UI_TEXT.TOAST_DELETE_BLOCKED.replace('{count}', assignedUsers.length));
      return;
    }
    setRoleToDelete(role);
    setIsDeleteOpen(true);
  }, [users]);

  const closeDeleteDialog = useCallback(() => {
    setRoleToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!roleToDelete) return false;
    const updated = roles.filter((role) => role.id !== roleToDelete.id);
    roleService.saveRoles(updated);
    setRoles(updated);
    closeDeleteDialog();
    toast.success(UI_TEXT.TOAST_DELETE);
    return true;
  }, [roleToDelete, roles, closeDeleteDialog]);

  const getUserCount = useCallback(
    (roleName) => users.filter((user) => user.role?.toLowerCase() === roleName.toLowerCase()).length,
    [users]
  );

  const permissionSummary = useMemo(() => PERMISSION_MODULES, []);

  return {
    // data
    roles,
    users,
    permissionSummary,
    isLoading,

    // form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    hasPermission,

    // delete state
    isDeleteOpen,
    roleToDelete,

    // actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handlePermissionToggle,
    handleSelectAll,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    getUserCount,
  };
};

export default useRoles;

