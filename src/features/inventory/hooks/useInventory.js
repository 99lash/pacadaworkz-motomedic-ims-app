import { useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  setSearchTerm,
  setStatusFilter,
  updateInventoryItem,
} from '../inventorySlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useInventory = () => {
  const dispatch = useDispatch();
  
  // Redux State
  const {
    inventory,
    searchTerm,
    statusFilter,
    statusFilters,
    isLoading,
    error,
    lastFetched
  } = useSelector((state) => state.inventory);

  const refreshInventory = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    if (!forceRefresh && lastFetched && (now - lastFetched < CACHE_DURATION)) {
      return;
    }

    dispatch(fetchInventoryStart());
    try {
      const data = await fetchInventory();
      dispatch(fetchInventorySuccess(data));
    } catch (err) {
      dispatch(fetchInventoryFailure(err.message || 'Failed to fetch inventory'));
    }
  }, [dispatch, lastFetched]);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  // Get stock status for an item
  const getItemStockStatus = useCallback((item) => {
    return getStockStatus(item.currentStock, item.minStock);
  }, []);

  // Filter inventory
  // Note: We compute this here instead of storing in Redux to keep state minimal, 
  // but since we persist filters in Redux, this calculation is consistent.
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
    dispatch(setSearchTerm(value));
  }, [dispatch]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value) => {
    dispatch(setStatusFilter(value));
  }, [dispatch]);

  const handleAdjustStock = useCallback(async (itemId, newStock) => {
    try {
      const updatedItem = await updateInventoryStock(itemId, newStock);
      dispatch(updateInventoryItem(updatedItem));
    } catch (err) {
      console.error('Failed to update stock:', err);
      // Ideally dispatch an error action or show toast
    }
  }, [dispatch]);

  return {
    // Data
    inventory,
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
    refreshInventory: () => refreshInventory(true),
    handleAdjustStock,
  };
};

export default useInventory;

