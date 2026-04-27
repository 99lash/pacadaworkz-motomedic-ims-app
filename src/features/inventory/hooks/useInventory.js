import { useCallback, useMemo, useEffect, useRef, useState } from 'react';
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
import { fetchInventory, fetchInventoryPaginated, updateInventoryStock } from '../services';

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

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

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

  // Handle Search Debounce - Trims and only updates if content changed
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedValue = searchTerm.trim();
      if (trimmedValue !== debouncedSearchTerm) {
        setDebouncedSearchTerm(trimmedValue);
        dispatch(setCurrentPage(1));
        goToPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm, dispatch, goToPage]);

  const getItemStockStatus = useCallback((item) => {
    return getStockStatus(item.currentStock, item.minStock);
  }, []);

  const loadInventory = useCallback(async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    dispatch(fetchInventoryStart());
    try {
      // Use Paginated API with the debounced search term
      const result = await fetchInventoryPaginated({
        page: currentPage,
        pageSize,
        search: debouncedSearchTerm,
        // Backend should handle the status filter if possible, otherwise we can filter the paginated results
      });

      if (result.success) {
        let items = result.data;

        // If backend doesn't support status filtering yet, we filter the current page
        // Ideally, this should be moved to the backend for perfect accuracy
        if (statusFilter && statusFilter !== UI_TEXT.STATUS_ALL) {
          items = items.filter(item => {
            const itemStatus = getItemStockStatus(item);
            switch (statusFilter) {
              case UI_TEXT.STATUS_IN_STOCK: return itemStatus === 'healthy';
              case UI_TEXT.STATUS_LOW_STOCK: return itemStatus === 'low';
              case UI_TEXT.STATUS_CRITICAL: return itemStatus === 'critical';
              case UI_TEXT.STATUS_OUT_OF_STOCK: return itemStatus === 'out';
              default: return true;
            }
          });
        }

        dispatch(fetchInventorySuccess({
          inventory: items,
          totalItems: result.pagination.totalItems
        }));
      }
    } catch (err) {
      dispatch(fetchInventoryFailure(err.message || 'Failed to fetch inventory'));
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, statusFilter, getItemStockStatus]);

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

  // Calculate statistics (Currently based on fetched inventory for this page)
  // For total accuracy across all pages, backend should provide these stats
  const stats = useMemo(() => {
    const total = totalItems;
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
