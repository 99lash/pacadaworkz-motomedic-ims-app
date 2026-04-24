import React from 'react';
import { usePurchases } from './hooks';
import {
  PurchaseHeader,
  PurchaseTable,
  PurchaseSearchBar,
  PurchaseFormDialog,
  PurchaseReceiveDialog,
  PurchaseDeleteDialog,
  PurchaseDetailsDialog,
  PurchaseEmptyState,
} from './components';
import { Pagination } from '../../shared/components/ui/pagination';

const PurchasesPage = () => {
  const {
    // Data
    purchaseOrders,
    totalItems,
    suppliers,
    products,
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
  } = usePurchases({ initialPageSize: 10 });

  return (
    <div className="p-6 space-y-6">
      <PurchaseHeader onAddClick={openCreateDialog} />

      <PurchaseSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {isLoading && purchaseOrders.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading purchase orders...</div>
        </div>
      ) : purchaseOrders.length === 0 ? (
        <PurchaseEmptyState onAddClick={openCreateDialog} />
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {isLoading && purchaseOrders.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            <PurchaseTable
              purchaseOrders={purchaseOrders}
              onMarkAsReceived={openReceiveDialog}
              onViewDetails={openDetailsDialog}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
              getStatusBadge={getStatusBadge}
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

