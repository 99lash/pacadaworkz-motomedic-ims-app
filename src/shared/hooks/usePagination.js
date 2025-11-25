/**
 * usePagination Hook
 * 
 * A reusable hook for managing pagination state.
 * Can be used across different features (categories, products, users, etc.)
 * 
 * Features:
 * - Page navigation (next, prev, go to page)
 * - Items per page selection
 * - Calculated metadata (total pages, has next/prev, etc.)
 * - URL-friendly (can sync with query params)
 */

import { useState, useMemo, useCallback } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Pagination state management hook
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.initialPage - Starting page (default: 1)
 * @param {number} options.initialPageSize - Items per page (default: 20)
 * @param {number} options.totalItems - Total number of items
 * @returns {Object} Pagination state and handlers
 * 
 * @example
 * const { 
 *   currentPage, 
 *   pageSize, 
 *   totalPages,
 *   goToPage,
 *   nextPage,
 *   prevPage 
 * } = usePagination({ totalItems: 156 });
 */
export const usePagination = ({
  initialPage = DEFAULT_PAGE,
  initialPageSize = DEFAULT_PAGE_SIZE,
  totalItems = 0,
} = {}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES (Memoized)
  // ---------------------------------------------------------------------------
  
  /**
   * Total number of pages
   */
  const totalPages = useMemo(() => {
    if (totalItems <= 0) return 1;
    return Math.ceil(totalItems / pageSize);
  }, [totalItems, pageSize]);

  /**
   * Whether there's a previous page
   */
  const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

  /**
   * Whether there's a next page
   */
  const hasNextPage = useMemo(() => currentPage < totalPages, [currentPage, totalPages]);

  /**
   * Start index of current page items (0-based)
   */
  const startIndex = useMemo(() => (currentPage - 1) * pageSize, [currentPage, pageSize]);

  /**
   * End index of current page items (0-based, exclusive)
   */
  const endIndex = useMemo(() => {
    const end = startIndex + pageSize;
    return end > totalItems ? totalItems : end;
  }, [startIndex, pageSize, totalItems]);

  /**
   * Pagination info for display
   */
  const paginationInfo = useMemo(() => ({
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startItem: totalItems > 0 ? startIndex + 1 : 0,
    endItem: endIndex,
    hasPrevPage,
    hasNextPage,
  }), [currentPage, pageSize, totalPages, totalItems, startIndex, endIndex, hasPrevPage, hasNextPage]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Go to a specific page
   */
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  /**
   * Go to previous page
   */
  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  /**
   * Go to first page
   */
  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * Go to last page
   */
  const lastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  /**
   * Change page size (resets to page 1)
   */
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  /**
   * Reset pagination to initial state
   */
  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  // ---------------------------------------------------------------------------
  // RETURN VALUE
  // ---------------------------------------------------------------------------
  return {
    // State
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    
    // Computed
    hasPrevPage,
    hasNextPage,
    startIndex,
    endIndex,
    paginationInfo,
    
    // Handlers
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
    reset,
    
    // For API calls
    offset: startIndex,
    limit: pageSize,
  };
};

export default usePagination;

