/**
 * CategoryEmptyState Component
 * 
 * Displays a helpful empty state when no categories exist or match search.
 * Follows HCI principles with clear guidance and actionable CTAs.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Tags, SearchX } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryEmptyState shows when no categories are available
 */
const CategoryEmptyState = ({
  hasSearchTerm,
  onAddClick,
}) => {
  const Icon = hasSearchTerm ? SearchX : Tags;
  const message = hasSearchTerm
    ? UI_TEXT.MSG_NO_SEARCH_RESULTS
    : UI_TEXT.MSG_ADD_FIRST;
  
  return (
    <div 
      className="text-center py-12 px-4"
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-muted p-4">
          <Icon 
            className="h-12 w-12 text-muted-foreground" 
            aria-hidden="true"
          />
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">
        {UI_TEXT.MSG_NO_CATEGORIES}
      </h3>
      
      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {/* CTA Button (only when not searching) */}
      {!hasSearchTerm && (
        <Button onClick={onAddClick}>
          {UI_TEXT.BTN_ADD_CATEGORY}
        </Button>
      )}
      
      {/* Helpful hint when searching */}
      {hasSearchTerm && (
        <p className="text-sm text-muted-foreground">
          Try adjusting your search terms or{' '}
          <button
            type="button"
            onClick={onAddClick}
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            add a new category
          </button>
        </p>
      )}
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryEmptyState.propTypes = {
  /** Whether there's an active search term */
  hasSearchTerm: PropTypes.bool,
  
  /** Callback when add button is clicked */
  onAddClick: PropTypes.func.isRequired,
};

CategoryEmptyState.defaultProps = {
  hasSearchTerm: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategoryEmptyState);

