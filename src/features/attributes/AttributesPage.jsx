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
} from './components';

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
    isLoading,

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
  } = useAttributes();

  // ---------------------------------------------------------------------------
  // RENDER - Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
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

      {/* Attributes Table or Empty State */}
      <Card>
        <CardContent className="p-0">
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

