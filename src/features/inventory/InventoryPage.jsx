import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { useInventory } from './hooks';
import {
  InventoryHeader,
  InventoryStatsCards,
  InventoryFilters,
  InventoryTable,
} from './components';
import { UI_TEXT } from './utils';

const InventoryPage = () => {
  const {
    // Data
    filteredInventory,
    isLoading,

    // Filters
    searchTerm,
    statusFilter,
    statusFilters,

    // Statistics
    stats,

    // Helpers
    getItemStockStatus,
    getStatusDisplayWithIcon,

    // Actions
    handleSearchChange,
    handleStatusFilterChange,
  } = useInventory();

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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 dark:text-gray-400">Loading inventory...</div>
            </div>
          ) : (
            <InventoryTable
              inventory={filteredInventory}
              getItemStockStatus={getItemStockStatus}
              getStatusDisplayWithIcon={getStatusDisplayWithIcon}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;

