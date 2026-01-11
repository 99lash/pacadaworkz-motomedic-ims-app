import { useCallback, useMemo, useState, useEffect } from 'react';
import { fetchInventory, updateInventoryStock } from '../services';
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
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(UI_TEXT.STATUS_ALL);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

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

  const handleAdjustStock = useCallback(async (itemId, newStock) => {
    try {
      const updatedItem = await updateInventoryStock(itemId, newStock);
      setInventory(prevInventory => 
        prevInventory.map(item => 
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
    } catch (err) {
      console.error('Failed to update stock:', err);
      // Here you could set an error state to show in the UI
    }
  }, []);

  return {
    // Data
    inventory,
    filteredInventory,
    isLoading,
    error,

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
    handleAdjustStock,
  };
};

export default useInventory;

