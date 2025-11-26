import React from 'react';
import { usePurchases } from './hooks';
import {
  PurchaseHeader,
  PurchaseTable,
  PurchaseFormDialog,
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
    isFormOpen,

    // Actions
    openCreateDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmit,
    handleMarkAsReceived,
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
          onMarkAsReceived={handleMarkAsReceived}
          getStatusBadge={getStatusBadge}
        />
      )}

      <PurchaseFormDialog
        isOpen={isFormOpen}
        formData={formData}
        formErrors={formErrors}
        suppliers={suppliers}
        products={products}
        onClose={closeFormDialog}
        onSubmit={handleSubmit}
        onFieldChange={handleFormFieldChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
        onItemChange={handleItemChange}
      />
    </div>
  );
};

export default PurchasesPage;

