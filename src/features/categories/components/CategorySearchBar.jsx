/**
 * CategorySearchBar Component
 * 
 * Search input for filtering categories.
 * Implements debounced search for performance.
 */

import React, { memo, useId } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategorySearchBar for filtering categories
 */
const CategorySearchBar = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  const inputId = useId();
  
  /**
   * Clears the search input
   */
  const handleClear = () => {
    onChange('');
  };
  
  return (
    <div className={`relative max-w-md ${className}`}>
      {/* Search Icon */}
      <Search 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500 pointer-events-none" 
        aria-hidden="true"
      />
      
      {/* Search Input */}
      <Input
        id={inputId}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800"
        aria-label="Search categories"
        role="searchbox"
      />
      
      {/* Clear Button (visible when there's input) */}
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground dark:text-gray-300 hover:bg-transparent dark:hover:bg-transparent"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      )}
      
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {value ? `Searching for: ${value}` : 'Search cleared'}
      </div>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategorySearchBar.propTypes = {
  /** Current search value */
  value: PropTypes.string.isRequired,
  
  /** Callback when search value changes */
  onChange: PropTypes.func.isRequired,
  
  /** Placeholder text */
  placeholder: PropTypes.string,
  
  /** Additional CSS classes */
  className: PropTypes.string,
};

CategorySearchBar.defaultProps = {
  placeholder: UI_TEXT.PLACEHOLDER_SEARCH,
  className: '',
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategorySearchBar);

