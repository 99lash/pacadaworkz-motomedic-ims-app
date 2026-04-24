import { useCallback, useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  STATUS_FILTERS,
  UI_TEXT,
  getStockStatus,
  getStatusDisplay,
  getStockPercentage,
} from '../utils';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';
import {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  setSearchTerm,
  setStatusFilter,
  setCurrentPage,
  setPageSize,
  updateInventoryItem,
} from '../inventorySlice';
import { fetchInventoryPaginated, updateInventoryStock } from '../services';

export const useInventory = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);
  
  // Redux State
  const {
    inventory,
    totalItems,
    searchTerm,
    statusFilter,
    statusFilters,
    isLoading,
    error,
    lastFetched,
    currentPage,
    pageSize,
  } = useSelector((state) => state.inventory);

  // Pagination hook
  const pagination = usePagination({
    initialPage: currentPage,
    initialPageSize: pageSize,
    totalItems,
  });

  const {
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    goToPage,
    changePageSize,
  } = pagination;

  const loadInventory = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    dispatch(fetchInventoryStart());
    try {
      const result = await fetchInventoryPaginated({
        page: currentPage,
        pageSize,
        search: searchTerm,
        // status: statusFilter, // Add if backend supports
      });

      if (result.success) {
        dispatch(fetchInventorySuccess({
          inventory: result.data,
          totalItems: result.pagination.totalItems
        }));
      }
    } catch (err) {
      dispatch(fetchInventoryFailure(err.message || 'Failed to fetch inventory'));
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const handlePageChange = useCallback((page) => {
    dispatch(setCurrentPage(page));
    goToPage(page);
  }, [dispatch, goToPage]);

  const handlePageSizeChange = useCallback((size) => {
    dispatch(setPageSize(size));
    changePageSize(size);
  }, [dispatch, changePageSize]);

  // Get stock status for an item
  const getItemStockStatus = useCallback((item) => {
    return getStockStatus(item.currentStock, item.minStock);
  }, []);

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

  // Calculate statistics (Note: this might be based on current page only or all items)
  // For now, keeping it consistent with current implementation but it might need adjustment for all items
  const stats = useMemo(() => {
    const total = totalItems;
    // These specific counts might need a separate API call for all items if pagination is used
    const inStock = inventory.filter(item => getItemStockStatus(item) === 'healthy').length;
    const lowStock = inventory.filter(item => getItemStockStatus(item) === 'low').length;
    const outOfStock = inventory.filter(item => getItemStockStatus(item) === 'out').length;

    return {
      totalItems: total,
      inStock,
      lowStock,
      outOfStock,
    };
  }, [inventory, totalItems, getItemStockStatus]);

  // Handle search change
  const handleSearchChange = useCallback((value) => {
    dispatch(setSearchTerm(value));
    dispatch(setCurrentPage(1));
    goToPage(1);
  }, [dispatch, goToPage]);

  // Handle status filter change
  const handleStatusFilterChange = useCallback((value) => {
    dispatch(setStatusFilter(value));
    dispatch(setCurrentPage(1));
    goToPage(1);
  }, [dispatch, goToPage]);

  const handleAdjustStock = useCallback(async (itemId, newStock) => {
    try {
      const updatedItem = await updateInventoryStock(itemId, newStock);
      dispatch(updateInventoryItem(updatedItem));
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  }, [dispatch]);

  return {
    // Data
    inventory,
    totalItems,
    isLoading,
    error,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

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
    refreshInventory: loadInventory,
    handleAdjustStock,
  };
};

export default useInventory;
