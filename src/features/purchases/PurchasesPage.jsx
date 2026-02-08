import React from 'react';
import { usePurchases } from './hooks';
import {
  PurchaseHeader,
  PurchaseTable,
  PurchaseFormDialog,
  PurchaseReceiveDialog,
  PurchaseDeleteDialog,
  PurchaseDetailsDialog,
  PurchaseEmptyState,
} from './components';

const PurchasesPage = () => {
  const {
    // Data
    purchaseOrders,
    suppliers,
    products,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,

    // Delete state
    isDeleteOpen,
    purchaseOrderToDelete,

    // Receive state
    isReceiveOpen,
    purchaseOrderToReceive,

    // Details state
    isDetailsOpen,
    selectedPurchaseOrder,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmit,
    openReceiveDialog,
    closeReceiveDialog,
    openDetailsDialog,
    closeDetailsDialog,
    handleMarkAsReceived,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    getStatusBadge,
  } = usePurchases();

  return (
    <div className="p-6 space-y-6">
      <PurchaseHeader onAddClick={openCreateDialog} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading purchase orders...</div>
        </div>
      ) : purchaseOrders.length === 0 ? (
        <PurchaseEmptyState onAddClick={openCreateDialog} />
      ) : (
        <PurchaseTable
          purchaseOrders={purchaseOrders}
          onMarkAsReceived={openReceiveDialog}
          onViewDetails={openDetailsDialog}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          getStatusBadge={getStatusBadge}
        />
      )}

      <PurchaseFormDialog
        isOpen={isFormOpen}
        formData={formData}
        formErrors={formErrors}
        formMode={formMode}
        suppliers={suppliers}
        products={products}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onItemChange={handleItemChange}
      />

      <PurchaseReceiveDialog
        isOpen={isReceiveOpen}
        purchaseOrder={purchaseOrderToReceive}
        onClose={closeReceiveDialog}
        onConfirm={handleMarkAsReceived}
      />

      <PurchaseDetailsDialog
        isOpen={isDetailsOpen}
        purchaseOrder={selectedPurchaseOrder}
        onClose={closeDetailsDialog}
        getStatusBadge={getStatusBadge}
      />

      <PurchaseDeleteDialog
        isOpen={isDeleteOpen}
        purchaseOrder={purchaseOrderToDelete}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PurchasesPage;

