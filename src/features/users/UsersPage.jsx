import React from 'react';
import { useUsers } from './hooks';
import {
  UserHeader,
  UserStatsCards,
  UserTable,
  UserFormDialog,
  UserDeleteDialog,
} from './components';

import { Pagination } from '../../shared/components/ui/pagination';

const UsersPage = () => {
  const {
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
  } = useUsers({ initialPageSize: 10 });

  return (
    <div className="p-6 space-y-6">
      <UserHeader onAddClick={openCreateDialog} />
      <UserStatsCards stats={stats} />

      {isLoading && users.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {isLoading && users.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            <UserTable
              users={users}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          </div>

          {totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              startItem={paginationInfo.startItem}
              endItem={paginationInfo.endItem}
              hasPrevPage={hasPrevPage}
              hasNextPage={hasNextPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector={true}
              showItemCount={true}
              showFirstLast={totalPages > 5}
              isLoading={isLoading}
            />
          )}
        </div>
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

