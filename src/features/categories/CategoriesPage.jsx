/**
 * CategoriesPage Component
 * 
 * Main page component for managing product categories.
 * Orchestrates all category-related UI components and state.
 * 
 * Features:
 * - CRUD operations for categories
 * - Search and filtering
 * - Loading and error states
 * - Accessible and responsive design
 * 
 * @module features/categories/CategoriesPage
 */

import React from 'react';
import { Card, CardContent } from '../../shared/components/ui/card';
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

/**
 * CategoriesPage - Main page for category management
 * 
 * This component follows the Container/Presentational pattern:
 * - Container logic is handled by useCategories hook
 * - Presentational components handle rendering
 */
const CategoriesPage = () => {
  // ---------------------------------------------------------------------------
  // HOOK - All state and handlers
  // ---------------------------------------------------------------------------
  const {
    // Data
    filteredCategories,
    
    // Search
    searchTerm,
    setSearchTerm,
    
    // Loading states
    isLoading,
    isSaving,
    isDeleting,
    
    // Error
    error,
    
    // Dialog states
    isAddDialogOpen,
    isEditDialogOpen,
    editingCategory,
    
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
  } = useCategories();

  // ---------------------------------------------------------------------------
  // RENDER - Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <CategoryHeader onAddClick={openAddDialog} />
        <CategorySearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          className="mb-6"
        />
        <CategoryLoadingState rows={5} />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER - Error State
  // ---------------------------------------------------------------------------
  if (error) {
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
      {/* Page Header with Breadcrumb and Add Button */}
      <CategoryHeader onAddClick={openAddDialog} />

      {/* Search Bar */}
      <CategorySearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Categories Table or Empty State */}
      <Card>
        <CardContent className="p-0">
          {filteredCategories.length > 0 ? (
            <CategoryTable
              categories={filteredCategories}
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

