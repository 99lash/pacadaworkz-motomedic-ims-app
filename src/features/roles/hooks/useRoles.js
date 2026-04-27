import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  fetchRolesAndPermissions,
  createRole as createRoleThunk,
  updateRole as updateRoleThunk,
  deleteRole as deleteRoleThunk,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedRole,
  setRoleToDelete,
} from '../rolesSlice';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  PERMISSION_MODULES,
  UI_TEXT,
  validateRoleForm,
} from '../utils';

export const useRoles = () => {
  const dispatch = useDispatch();
  const {
    roles,
    allPermissions,
    isLoading,
    isFormOpen,
    isDeleteOpen,
    formMode,
    selectedRole,
    roleToDelete,
  } = useSelector((state) => state.roles);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchRolesAndPermissions());
  }, [dispatch]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    dispatch(setSelectedRole(null));
  }, [dispatch]);

  const openCreateDialog = useCallback(() => {
    dispatch(setFormMode('create'));
    resetForm();
    dispatch(setFormOpen(true));
  }, [dispatch, resetForm]);

  /**
   * Helper to convert API permission objects to UI module-based format
   */
  const mapApiPermissionsToUi = useCallback((apiPermissions) => {
    const modules = {};
    apiPermissions.forEach((perm) => {
      const moduleName = perm.module.toLowerCase().replace(/ /g, '_');
      // Try to extract action by removing module name from the permission name
      let action = perm.name.toLowerCase();
      const moduleSuffix = `_${moduleName}`;
      if (action.endsWith(moduleSuffix)) {
        action = action.slice(0, -moduleSuffix.length);
      } else {
        action = action.split('_')[0];
      }
      
      if (!modules[moduleName]) {
        modules[moduleName] = [];
      }
      if (!modules[moduleName].includes(action)) {
        modules[moduleName].push(action);
      }
    });

    return Object.entries(modules).map(([module, actions]) => ({
      module,
      actions,
    }));
  }, []);

  /**
   * Helper to convert UI module-based format to API permission IDs
   */
  const mapUiPermissionsToIds = useCallback((uiPermissions) => {
    const ids = [];
    uiPermissions.forEach((uiPerm) => {
      uiPerm.actions.forEach((action) => {
        const apiPerm = allPermissions.find((p) => {
          const pModule = p.module.toLowerCase().replace(/ /g, '_');
          const pName = p.name.toLowerCase();
          
          return pModule === uiPerm.module && (
            pName === `${action}_${uiPerm.module}` || 
            pName.startsWith(action)
          );
        });
        if (apiPerm) {
          ids.push(apiPerm.id);
        }
      });
    });
    return ids;
  }, [allPermissions]);

  const openEditDialog = useCallback((role) => {
    dispatch(setFormMode('edit'));
    dispatch(setSelectedRole(role));
    
    setFormData({
      name: role.role || role.name,
      description: role.description,
      permissions: mapApiPermissionsToUi(role.permissions || []),
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    dispatch(setFormOpen(true));
  }, [dispatch, mapApiPermissionsToUi]);

  const closeFormDialog = useCallback(() => {
    dispatch(setFormOpen(false));
    resetForm();
  }, [dispatch, resetForm]);

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

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateRoleForm(formData, roles, selectedRole?.id);
    if (!isValid) {
      setFormErrors(errors);
      return false;
    }

    const permissionIds = mapUiPermissionsToIds(formData.permissions);
    const roleData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      if (formMode === 'edit') {
        await dispatch(updateRoleThunk({ id: selectedRole.id, roleData, permissionIds })).unwrap();
        toast.success(UI_TEXT.TOAST_UPDATE);
      } else {
        await dispatch(createRoleThunk({ roleData, permissionIds })).unwrap();
        toast.success(UI_TEXT.TOAST_CREATE);
      }
      return true;
    } catch (error) {
      toast.error(error || 'Something went wrong');
      return false;
    }
  }, [formData, roles, selectedRole, formMode, dispatch, mapUiPermissionsToIds]);

  const openDeleteDialog = useCallback((role) => {
    // API now provides users_count directly
    const userCount = role.users_count || 0;

    if (userCount > 0) {
      toast.error(UI_TEXT.TOAST_DELETE_BLOCKED.replace('{count}', userCount));
      return;
    }
    dispatch(setRoleToDelete(role));
    dispatch(setDeleteOpen(true));
  }, [dispatch]);

  const closeDeleteDialog = useCallback(() => {
    dispatch(setRoleToDelete(null));
    dispatch(setDeleteOpen(false));
  }, [dispatch]);

  const handleDelete = useCallback(async () => {
    if (!roleToDelete) return false;
    try {
      await dispatch(deleteRoleThunk(roleToDelete.id)).unwrap();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    } catch (error) {
      toast.error(error || 'Failed to delete role');
      return false;
    }
  }, [roleToDelete, dispatch]);

  const getUserCount = useCallback(
    (role) => role.users_count || 0,
    []
  );

  return {
    // data
    roles,
    allPermissions,
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
