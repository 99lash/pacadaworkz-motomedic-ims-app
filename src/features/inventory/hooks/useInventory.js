import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const [inventory, setInventory] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(UI_TEXT.STATUS_ALL);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inventory data
  const fetchInventoryData = useCallback(async (page = 1, search = searchTerm) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await inventoryService.fetchInventory({
        page,
        pageSize: pagination.pageSize,
        search,
      });

      if (result.success) {
        setInventory(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.error || 'Failed to fetch inventory');
        setInventory([]);
        setPagination({
          page: 1,
          pageSize: pagination.pageSize,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [pagination.pageSize, searchTerm]);

  // Initial data fetch
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Get stock status for an item (simplified since backend doesn't provide min/max stock)
  const getItemStockStatus = useCallback((item) => {
    // Since backend doesn't provide min/max stock levels,
    // we'll use a simple status based on quantity
    if (item.quantity === 0) return 'out';
    if (item.quantity < 10) return 'low'; // Arbitrary threshold
    return 'healthy';
  }, []);

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return filterInventory(inventory, searchTerm, statusFilter, getStockStatus);
  }, [inventory, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalItems = pagination.totalItems;
    const inStock = inventory.filter(item => getItemStockStatus(item) === 'healthy').length;
    const lowStock = inventory.filter(item => getItemStockStatus(item) === 'low').length;
    const outOfStock = inventory.filter(item => getItemStockStatus(item) === 'out').length;

    return {
      totalItems,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory, pagination.totalItems, getItemStockStatus]);

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
    // Debounce search - fetch after a short delay
    const timeoutId = setTimeout(() => {
      fetchInventoryData(1, value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchInventoryData]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value) => {
    setStatusFilter(value);
    // Filter is applied client-side since backend doesn't support status filtering
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    fetchInventoryData(page, searchTerm);
  }, [fetchInventoryData, searchTerm]);

  // Refresh inventory
  const refreshInventory = useCallback(() => {
    fetchInventoryData(pagination.page, searchTerm);
  }, [fetchInventoryData, pagination.page, searchTerm]);

  return {
    // Data
    inventory,
    filteredInventory,
    isLoading,
    error,
    pagination,

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
    handlePageChange,
    refreshInventory,
  };
};

export default useInventory;

