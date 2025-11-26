import { useCallback, useMemo, useState } from 'react';
import { inventoryService } from '../services';
import {
  STATUS_FILTERS,
  UI_TEXT,
  getStockStatus,
  getStatusDisplay,
  getStockPercentage,
  filterInventory,
} from '../utils';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';

export const useInventory = () => {
  const [inventory, setInventory] = useState(() => inventoryService.fetchInventory());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(UI_TEXT.STATUS_ALL);
  const isLoading = false;

  // Get stock status for an item
  const getItemStockStatus = useCallback((item) => {
    return getStockStatus(item.currentStock, item.minStock);
  }, []);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return filterInventory(inventory, searchTerm, statusFilter, getStockStatus);
  }, [inventory, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const inStock = inventory.filter(item => getItemStockStatus(item) === 'healthy').length;
    const lowStock = inventory.filter(item => getItemStockStatus(item) === 'low').length;
    const outOfStock = inventory.filter(item => getItemStockStatus(item) === 'out').length;

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory, getItemStockStatus]);

  // Get status display with icon component
  const getStatusDisplayWithIcon = useCallback((status) => {
    const display = getStatusDisplay(status);
    const iconMap = {
      AlertTriangle,
      CheckCircle,
      Package,
    };
    return {
      ...display,
      Icon: iconMap[display.iconName] || Package,
    };
  }, []);

  // Get stock percentage for an item
  const getItemStockPercentage = useCallback((item) => {
    return getStockPercentage(item.currentStock, item.maxStock);
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
  }, []);

  // Refresh inventory
  const refreshInventory = useCallback(() => {
    setInventory(inventoryService.fetchInventory());
  }, []);

  return {
    // Data
    inventory,
    filteredInventory,
    isLoading,

    // Filters
    searchTerm,
    statusFilter,
    statusFilters: STATUS_FILTERS,

    // Statistics
    stats,

    // Helpers
    getItemStockStatus,
    getStatusDisplayWithIcon,
    getItemStockPercentage,

    // Actions
    handleSearchChange,
    handleStatusFilterChange,
    refreshInventory,
  };
};

export default useInventory;

