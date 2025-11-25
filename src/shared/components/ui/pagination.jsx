/**
 * Pagination Component
 * 
 * A reusable pagination UI component with:
 * - Page numbers with ellipsis for large page counts
 * - Previous/Next buttons
 * - First/Last page buttons
 * - Items per page selector
 * - Showing X-Y of Z display
 * - Full accessibility support
 */

import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './button';
import { PAGE_SIZE_OPTIONS } from '../../hooks/usePagination';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generates page numbers array with ellipsis
 * Example: [1, '...', 4, 5, 6, '...', 10]
 */
const getPageNumbers = (currentPage, totalPages, maxVisible = 7) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const halfVisible = Math.floor((maxVisible - 3) / 2); // Reserve 3 spots: first, last, current
  
  // Always show first page
  pages.push(1);

  // Calculate start and end of visible range
  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);

  // Adjust if we're near the beginning
  if (currentPage <= halfVisible + 2) {
    end = Math.min(totalPages - 1, maxVisible - 2);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible - 1) {
    start = Math.max(2, totalPages - maxVisible + 3);
  }

  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push('...');
  }

  // Add visible page numbers
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // Add ellipsis before last page if needed
  if (end < totalPages - 1) {
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Page number button
 */
const PageButton = memo(({ page, isActive, onClick, disabled }) => (
  <Button
    variant={isActive ? 'default' : 'outline'}
    size="icon"
    onClick={() => onClick(page)}
    disabled={disabled}
    className="h-9 w-9"
    aria-label={`Go to page ${page}`}
    aria-current={isActive ? 'page' : undefined}
  >
    {page}
  </Button>
));

PageButton.displayName = 'PageButton';
PageButton.propTypes = {
  page: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

/**
 * Ellipsis indicator
 */
const Ellipsis = memo(() => (
  <span 
    className="px-2 text-muted-foreground dark:text-gray-500 select-none"
    aria-hidden="true"
  >
    ...
  </span>
));

Ellipsis.displayName = 'Ellipsis';

/**
 * Page size selector
 */
const PageSizeSelector = memo(({ pageSize, onChange, options = PAGE_SIZE_OPTIONS }) => (
  <div className="flex items-center gap-2">
    <label 
      htmlFor="page-size-select"
      className="text-sm text-muted-foreground dark:text-gray-400 whitespace-nowrap"
    >
      Items per page:
    </label>
    <select
      id="page-size-select"
      value={pageSize}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
      aria-label="Select number of items per page"
    >
      {(options || PAGE_SIZE_OPTIONS).map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
));

PageSizeSelector.displayName = 'PageSizeSelector';
PageSizeSelector.propTypes = {
  pageSize: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.number),
};
PageSizeSelector.defaultProps = {
  options: PAGE_SIZE_OPTIONS,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Pagination component
 */
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startItem,
  endItem,
  hasPrevPage,
  hasNextPage,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector,
  showItemCount,
  showFirstLast,
  pageSizeOptions,
  isLoading,
  className,
}) => {
  // Generate page numbers with ellipsis
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  // Don't render if there's no data or only one page
  if (totalItems === 0) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-700 dark:text-gray-300 ${className}`}
    >
      {/* Left side: Item count and page size */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Item count display */}
        {showItemCount && (
          <p className="text-sm text-muted-foreground dark:text-gray-400" aria-live="polite">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        )}

        {/* Page size selector */}
        {showPageSizeSelector && (
          <PageSizeSelector
            pageSize={pageSize}
            onChange={onPageSizeChange}
            options={pageSizeOptions}
          />
        )}
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={!hasPrevPage || isLoading}
            className="h-9 w-9"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}

        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || isLoading}
          className="h-9 w-9"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, index) =>
            page === '...' ? (
              <Ellipsis key={`ellipsis-${index}`} />
            ) : (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={onPageChange}
                disabled={isLoading}
              />
            )
          )}
        </div>

        {/* Mobile: Current page indicator */}
        <div className="sm:hidden px-3 text-sm text-muted-foreground dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="h-9 w-9"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Last page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage || isLoading}
            className="h-9 w-9"
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </nav>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

Pagination.propTypes = {
  /** Current active page */
  currentPage: PropTypes.number.isRequired,
  
  /** Total number of pages */
  totalPages: PropTypes.number.isRequired,
  
  /** Total number of items */
  totalItems: PropTypes.number.isRequired,
  
  /** Items per page */
  pageSize: PropTypes.number.isRequired,
  
  /** First item number on current page */
  startItem: PropTypes.number.isRequired,
  
  /** Last item number on current page */
  endItem: PropTypes.number.isRequired,
  
  /** Whether there's a previous page */
  hasPrevPage: PropTypes.bool.isRequired,
  
  /** Whether there's a next page */
  hasNextPage: PropTypes.bool.isRequired,
  
  /** Callback when page changes */
  onPageChange: PropTypes.func.isRequired,
  
  /** Callback when page size changes */
  onPageSizeChange: PropTypes.func,
  
  /** Whether to show page size selector */
  showPageSizeSelector: PropTypes.bool,
  
  /** Whether to show item count */
  showItemCount: PropTypes.bool,
  
  /** Whether to show first/last page buttons */
  showFirstLast: PropTypes.bool,
  
  /** Available page size options */
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  
  /** Whether pagination is in loading state */
  isLoading: PropTypes.bool,
  
  /** Additional CSS classes */
  className: PropTypes.string,
};

Pagination.defaultProps = {
  onPageSizeChange: () => {},
  showPageSizeSelector: true,
  showItemCount: true,
  showFirstLast: true,
  pageSizeOptions: PAGE_SIZE_OPTIONS,
  isLoading: false,
  className: '',
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(Pagination);
export { Pagination };

