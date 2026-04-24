import React from 'react';
import { useSuppliers } from './hooks';
import {
  SupplierHeader,
  SupplierTable,
  SupplierFormDialog,
  SupplierDeleteDialog,
  SupplierEmptyState,
  SupplierSearchBar,
} from './components';

import { Pagination } from '../../shared/components/ui/pagination';

const SuppliersPage = () => {
  const {
    // Data
    suppliers,
    totalItems,
    isLoading,

    // Search
    searchTerm,
    setSearchTerm,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Form state
    formData,
    formErrors,
    isEditing,
    isSaving,
    isFormOpen,

    // Delete state
    isDeleteOpen,
    supplierToDelete,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  } = useSuppliers({ initialPageSize: 10 });

  return (
    <div className="p-6 space-y-6">
      <SupplierHeader onAddClick={openCreateDialog} />

      <SupplierSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading && suppliers.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading suppliers...</div>
        </div>
      ) : suppliers.length === 0 ? (
        <SupplierEmptyState onAddClick={openCreateDialog} />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {isLoading && suppliers.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            <SupplierTable
              suppliers={suppliers}
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


      <SupplierFormDialog
        isOpen={isFormOpen}
        isEditing={isEditing}
        isSaving={isSaving}
        formData={formData}
        formErrors={formErrors}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
      />

      {supplierToDelete && (
        <SupplierDeleteDialog
          supplier={supplierToDelete}
          isOpen={isDeleteOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default SuppliersPage;

