import React from 'react';
import { useBrands } from './hooks';
import {
  BrandHeader,
  BrandTable,
  BrandFormDialog,
  BrandDeleteDialog,
  BrandEmptyState,
  BrandSearchBar,
} from './components';
import { Pagination } from '../../shared/components/ui/pagination';

const BrandsPage = () => {
  const {
    // Data
    brands,
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
    formMode,
    isFormOpen,

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
  } = useBrands({ initialPageSize: 10 });

  return (
    <div className="p-6 space-y-6">
      <BrandHeader onAddClick={openCreateDialog} />

      <BrandSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading && brands.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading brands...</div>
        </div>
      ) : brands.length === 0 ? (
        <BrandEmptyState onAddClick={openCreateDialog} />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {isLoading && brands.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            <BrandTable
              brands={brands}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          </div>
          
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
        </div>
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