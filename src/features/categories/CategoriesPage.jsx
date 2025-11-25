/**
 * CategoriesPage Component
 * 
 * Main page component for managing product categories.
 * Features:
 * - Paginated data display
 * - Server-side search
 * - CRUD operations
 * - Loading and error states
 * - Accessible and responsive design
 */

import React from 'react';
import { Card, CardContent } from '../../shared/components/ui/card';
import { Pagination } from '../../shared/components/ui/pagination';
import { useCategories } from './hooks';
import {
  CategoryHeader,
  CategorySearchBar,
  CategoryTable,
  CategoryEmptyState,
  CategoryLoadingState,
  CategoryFormDialog,
} from './components';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const CategoriesPage = () => {
  // ---------------------------------------------------------------------------
  // HOOK - All state and handlers
  // ---------------------------------------------------------------------------
  const {
    // Data
    categories,
    totalItems,

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

    // Loading states
    isLoading,
    isSaving,
    isDeleting,

    // Error
    error,

    // Dialog states
    isAddDialogOpen,
    isEditDialogOpen,

    // Form
    formData,
    formErrors,
    handleFormChange,

    // Dialog handlers
    openAddDialog,
    closeAddDialog,
    closeEditDialog,
    openEditDialog,

    // CRUD handlers
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  } = useCategories({ initialPageSize: 10 });

  // ---------------------------------------------------------------------------
  // RENDER - Loading State (only on initial load)
  // ---------------------------------------------------------------------------
  if (isLoading && categories.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <CategoryHeader onAddClick={openAddDialog} />
        <CategorySearchBar
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <CategoryLoadingState rows={5} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER - Error State
  // ---------------------------------------------------------------------------
  if (error && categories.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <CategoryHeader onAddClick={openAddDialog} />
        <Card>
          <CardContent className="py-12">
            <div className="text-center" role="alert">
              <p className="text-destructive font-medium mb-2">
                Failed to load categories
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER - Main Content
  // ---------------------------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <CategoryHeader onAddClick={openAddDialog} />

      {/* Search Bar */}
      <CategorySearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Categories Table or Empty State */}
      <Card>
        <CardContent className="p-0">
          {/* Loading overlay for subsequent loads */}
          {isLoading && categories.length > 0 && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {categories.length > 0 ? (
            <CategoryTable
              categories={categories}
              onEdit={openEditDialog}
              onDelete={handleDeleteCategory}
              isDeleting={isDeleting}
            />
          ) : (
            <CategoryEmptyState
              hasSearchTerm={!!searchTerm.trim()}
              onAddClick={openAddDialog}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
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

      {/* Add Category Dialog */}
      <CategoryFormDialog
        isOpen={isAddDialogOpen}
        onClose={closeAddDialog}
        onSubmit={handleAddCategory}
        formData={formData}
        formErrors={formErrors}
        onFieldChange={handleFormChange}
        isEditing={false}
        isSaving={isSaving}
      />

      {/* Edit Category Dialog */}
      <CategoryFormDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        onSubmit={handleEditCategory}
        formData={formData}
        formErrors={formErrors}
        onFieldChange={handleFormChange}
        isEditing={true}
        isSaving={isSaving}
      />
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default CategoriesPage;
