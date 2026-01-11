import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { useInventory } from './hooks';
import {
  InventoryHeader,
  InventoryStatsCards,
  InventoryFilters,
  InventoryTable,
  AdjustStockModal,
} from './components';
import { UI_TEXT } from './utils';

const InventoryPage = () => {
  const {
    // Data
    filteredInventory,
    isLoading,
    error,

    // Filters
    searchTerm,
    statusFilter,
    statusFilters,

    // Statistics
    stats,

    // Helpers
    getItemStockStatus,
    getStatusDisplayWithIcon,
    getItemStockPercentage,

    // Actions
    handleSearchChange,
    handleStatusFilterChange,
    handleAdjustStock,
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleSaveStock = async (itemId, newStock) => {
    await handleAdjustStock(itemId, newStock);
    handleCloseModal();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error loading inventory: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <InventoryHeader />

      <InventoryStatsCards stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">{UI_TEXT.TABLE_TITLE}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InventoryFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            statusFilters={statusFilters}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
          />

          {isLoading && !filteredInventory.length ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Loading inventory...</div>
            </div>
          ) : (
            <InventoryTable
              inventory={filteredInventory}
              getItemStockStatus={getItemStockStatus}
              getStatusDisplayWithIcon={getStatusDisplayWithIcon}
              getItemStockPercentage={getItemStockPercentage}
              onAdjustStock={handleOpenModal}
            />
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <AdjustStockModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveStock}
        />
      )}
    </div>
  );
};

export default InventoryPage;

