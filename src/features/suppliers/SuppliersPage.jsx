import React from 'react';
import { useSuppliers } from './hooks';
import {
  SupplierHeader,
  SupplierTable,
  SupplierFormDialog,
  SupplierDeleteDialog,
  SupplierEmptyState,
} from './components';

const SuppliersPage = () => {
  const {
    // Data
    suppliers,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
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
  } = useSuppliers();

  return (
    <div className="p-6 space-y-6">
      <SupplierHeader onAddClick={openCreateDialog} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading suppliers...</div>
        </div>
      ) : suppliers.length === 0 ? (
        <SupplierEmptyState onAddClick={openCreateDialog} />
      ) : (
        <SupplierTable
          suppliers={suppliers}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />
      )}

      <SupplierFormDialog
        isOpen={isFormOpen}
        mode={formMode}
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

