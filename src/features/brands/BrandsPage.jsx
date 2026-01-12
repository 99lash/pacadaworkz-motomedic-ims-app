import React from 'react';
import { useBrands } from './hooks';
import {
  BrandHeader,
  BrandTable,
  BrandFormDialog,
  BrandDeleteDialog,
  BrandEmptyState,
  Pagination,
} from './components';

const BrandsPage = () => {
  const {
    // Data
    brands,
    isLoading,
    pagination,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedBrand,

    // Delete state
    isDeleteOpen,
    brandToDelete,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    handlePageChange,
  } = useBrands();

  return (
    <div className="p-6 space-y-6">
      <BrandHeader onAddClick={openCreateDialog} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading brands...</div>
        </div>
      ) : brands.length === 0 ? (
        <BrandEmptyState onAddClick={openCreateDialog} />
      ) : (
        <>
          <BrandTable
            brands={brands}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}

      <BrandFormDialog
        isOpen={isFormOpen}
        mode={formMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
      />

      {brandToDelete && (
        <BrandDeleteDialog
          brand={brandToDelete}
          isOpen={isDeleteOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default BrandsPage;
