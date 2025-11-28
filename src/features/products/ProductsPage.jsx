import React from 'react';
import { Card, CardContent } from '../../shared/components/ui/card';
import { Pagination } from '../../shared/components/ui/pagination';
import { useProducts } from './hooks';
import {
  ProductHeader,
  ProductFilters,
  ProductTable,
  ProductEmptyState,
  ProductLoadingState,
  ProductFormDialog,
} from './components';

const ProductsPage = () => {
  const {
    // Data
    products,
    totalItems,

    // Filters
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    filterOptions,
    setSearchTerm,
    handleCategoryFilterChange,
    handleBrandFilterChange,
    handleStatusFilterChange,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Dialog & form
    isFormDialogOpen,
    isEditing,
    formData,
    formErrors,
    handleFormFieldChange,
    handleAttributesChange,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleSubmitProduct,

    // Mutations
    handleDeleteProduct,
    handleExportProducts,

    // States
    isLoading,
    isSaving,
    isDeleting,
    isExporting,
    error,
  } = useProducts({ initialPageSize: 10 });

  return (
    <>
      {isLoading && products.length === 0 ? (
        <div className="p-6 space-y-6">
          <ProductHeader
            onAddClick={openCreateDialog}
            onExportClick={handleExportProducts}
            isExportDisabled
          />
          <ProductLoadingState />
        </div>
      ) : error && products.length === 0 ? (
        <div className="p-6 space-y-6">
          <ProductHeader
            onAddClick={openCreateDialog}
            onExportClick={handleExportProducts}
            isExportDisabled={isExporting}
          />
          <Card>
            <CardContent className="py-12">
              <div className="text-center" role="alert">
                <p className="text-destructive font-medium mb-2">
                  {error || 'Failed to load products'}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="text-primary hover:underline text-sm"
                >
                  Try again
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          <ProductHeader
            onAddClick={openCreateDialog}
            onExportClick={handleExportProducts}
            isExportDisabled={isExporting || totalItems === 0}
            totalProducts={totalItems}
          />

          <ProductFilters
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            categoryOptions={filterOptions.categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryFilterChange}
            brandOptions={filterOptions.brands}
            selectedBrand={selectedBrand}
            onBrandChange={handleBrandFilterChange}
            statusOptions={filterOptions.statuses}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusFilterChange}
          />

          <Card>
            <CardContent className="p-0 relative">
              {isLoading && products.length > 0 && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  <span className="sr-only">Loading products</span>
                </div>
              )}

              {products.length > 0 ? (
                <ProductTable
                  products={products}
                  onEdit={openEditDialog}
                  onDelete={handleDeleteProduct}
                  isDeleting={isDeleting}
                />
              ) : (
                <ProductEmptyState
                  hasSearchTerm={Boolean(searchTerm.trim())}
                  onAddClick={openCreateDialog}
                />
              )}
            </CardContent>
          </Card>

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
              showFirstLast={totalPages > 5}
              isLoading={isLoading}
            />
          )}
        </div>
      )}

      {/* Always render dialog outside conditional branches to ensure single instance */}
      <ProductFormDialog
        isOpen={isFormDialogOpen}
        onClose={closeFormDialog}
        onSubmit={handleSubmitProduct}
        formData={formData}
        formErrors={formErrors}
        onFieldChange={handleFormFieldChange}
        onAttributesChange={handleAttributesChange}
        isEditing={isEditing}
        isSaving={isSaving}
        categoryOptions={filterOptions.categories}
        brandOptions={filterOptions.brands}
      />
    </>
  );
};

export default ProductsPage;

