import React from 'react';
import { useUsers } from './hooks';
import {
  UserHeader,
  UserStatsCards,
  UserTable,
  UserFormDialog,
  UserDeleteDialog,
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

    </div>
  );
};

export default UsersPage;

