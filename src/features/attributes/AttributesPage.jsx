/**
 * AttributesPage Component
 * 
 * Main page component for managing product attributes.
 * Features:
 * - List all attributes
 * - Create and edit attributes
 * - Delete attributes with confirmation
 * - Responsive design with dark mode support
 * - Accessible and user-friendly interface
 */

import React from 'react';
import { Card, CardContent } from '../../shared/components/ui/card';
import { useAttributes } from './hooks';
import {
  AttributeHeader,
  AttributeTable,
  AttributeFormDialog,
  AttributeDeleteDialog,
  AttributeEmptyState,
  AttributeSearchBar,
} from './components';
import { Pagination } from '../../shared/components/ui/pagination';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const AttributesPage = () => {
  // ---------------------------------------------------------------------------
  // HOOK - All state and handlers
  // ---------------------------------------------------------------------------
  const {
    // Data
    attributes,
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
    attributeToDelete,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  } = useAttributes({ initialPageSize: 10 });

  // ---------------------------------------------------------------------------
  // RENDER - Loading State
  // ---------------------------------------------------------------------------
  if (isLoading && attributes.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <AttributeHeader onAddClick={openCreateDialog} />
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground dark:text-gray-400">
                Loading attributes...
              </div>
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
      <AttributeHeader onAddClick={openCreateDialog} />

      {/* Search Bar */}
      <AttributeSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {/* Attributes Table or Empty State */}
      <div className="space-y-4">
        <Card>
          <CardContent className="p-0 relative">
            {isLoading && attributes.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            {attributes.length > 0 ? (
              <AttributeTable
                attributes={attributes}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
              />
            ) : (
              <AttributeEmptyState onAddClick={openCreateDialog} />
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
      </div>

      {/* Form Dialog */}

      <AttributeFormDialog
        isOpen={isFormOpen}
        mode={formMode}
        formData={formData}
        formErrors={formErrors}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
      />

      {/* Delete Dialog */}
      {attributeToDelete && (
        <AttributeDeleteDialog
          attribute={attributeToDelete}
          isOpen={isDeleteOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default AttributesPage;

