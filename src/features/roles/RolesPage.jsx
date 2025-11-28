import React from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../auth';
import { useRoles } from './hooks';
import {
  RoleHeader,
  RoleInfoBanner,
  RoleGrid,
  RoleFormDialog,
  RoleDeleteDialog,
} from './components';
import { PERMISSION_MODULES } from './utils';

const RolesPage = () => {
  const { user } = useAuth();
  const {
    roles,
    isLoading,
    formData,
    formErrors,
    formMode,
    isFormOpen,
    hasPermission,
    isDeleteOpen,
    roleToDelete,
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
  } = useRoles();

  const normalizedRole = user?.role?.toLowerCase();
  const isAuthorized = normalizedRole === 'admin' || normalizedRole === 'superadmin';

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center max-w-sm">
          <Shield className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Access denied
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You need elevated permissions to manage roles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <RoleHeader onAddClick={openCreateDialog} />
      <RoleInfoBanner />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`role-skeleton-${index}`}
              className="h-40 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <RoleGrid
          roles={roles}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          getUserCount={getUserCount}
          onAddClick={openCreateDialog}
        />
      )}

      <RoleFormDialog
        isOpen={isFormOpen}
        mode={formMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
        permissionModules={PERMISSION_MODULES}
        onPermissionToggle={handlePermissionToggle}
        onSelectAll={handleSelectAll}
        hasPermission={hasPermission}
      />

      {roleToDelete && (
        <RoleDeleteDialog
          role={roleToDelete}
          isOpen={isDeleteOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default RolesPage;

