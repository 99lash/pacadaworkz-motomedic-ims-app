import React from 'react';
import { useUsers } from './hooks';
import {
  UserHeader,
  UserStatsCards,
  UserTable,
  UserFormDialog,
  UserDeleteDialog,
  UserPermissionsDialog,
} from './components';

const UsersPage = () => {
  const {
    // Data
    users,
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
    permissionModules,
    permissionActions,

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
  } = useUsers();

  return (
    <div className="p-6 space-y-6">
      <UserHeader onAddClick={openCreateDialog} />
      <UserStatsCards stats={stats} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
        </div>
      ) : (
        <UserTable
          users={users}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onPermissions={openPermissionsDialog}
        />
      )}

      <UserFormDialog
        isOpen={isFormOpen}
        mode={formMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
      />

      {userToDelete && (
        <UserDeleteDialog
          user={userToDelete}
          isOpen={isDeleteOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
        />
      )}

      {userForPermissions && (
        <UserPermissionsDialog
          user={userForPermissions}
          isOpen={isPermissionsOpen}
          permissions={permissions}
          permissionModules={permissionModules}
          permissionActions={permissionActions}
          onClose={closePermissionsDialog}
          onPermissionToggle={handlePermissionToggle}
          onSave={handleSavePermissions}
        />
      )}
    </div>
  );
};

export default UsersPage;

