/**
 * useActivityLogs Hook
 * 
 * Custom hook that encapsulates all activity logs-related state management
 * and business logic. Separates concerns from UI components.
 * 
 * Features:
 * - Data fetching and filtering
 * - Search functionality
 * - Module filtering
 * - Role-based access control
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { activityLogsService } from '../services';
import { filterLogs, getUniqueModules } from '../utils';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Activity logs management hook
 * @param {Object} user - User object with id and role
 * @returns {Object} Activity logs state and handlers
 */
export const useActivityLogs = (user, { initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [logs, setLogs] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('');
  
  const isInitialLoad = useRef(true);
  const isFetchingLogsRef = useRef(false);

  // Pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize,
    totalItems,
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    goToPage,
    changePageSize,
  } = pagination;

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  const loadLogs = useCallback(async () => {
    if (isFetchingLogsRef.current) return;
    isFetchingLogsRef.current = true;
    try {
      setIsLoading(true);
      const response = await activityLogsService.fetchActivityLogs({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm,
        module: filterModule,
      });
      
      if (response?.success) {
        setLogs(response.data || []);
        setTotalItems(response.pagination.totalItems);
      }
    } catch (error) {
      console.error('Error loading activity logs:', error);
      setLogs([]);
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingLogsRef.current = false;
    }
  }, [currentPage, pageSize, searchTerm, filterModule]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  // Get unique modules from logs
  const modules = useMemo(() => {
    return getUniqueModules(logs);
  }, [logs]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    goToPage(1);
  }, [goToPage]);

  const handleModuleFilterChange = useCallback((value) => {
    setFilterModule(value);
    goToPage(1);
  }, [goToPage]);

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

  const refreshLogs = useCallback(async () => {
    await loadLogs();
  }, [loadLogs]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Data
    logs,
    totalItems,
    isLoading,

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
    filterModule,
    modules,

    // Handlers
    handleSearchChange,
    handleModuleFilterChange,
    refreshLogs,
  };
};

export default useActivityLogs;
