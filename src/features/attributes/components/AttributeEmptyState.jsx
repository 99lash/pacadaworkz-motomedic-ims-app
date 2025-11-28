/**
 * AttributeEmptyState Component
 * 
 * Displays empty state when no attributes are found.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AttributeEmptyState displays when no attributes exist
 */
const AttributeEmptyState = ({ onAddClick }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Tag className="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {UI_TEXT.EMPTY_TITLE}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {UI_TEXT.EMPTY_DESCRIPTION}
      </p>
      <Button onClick={onAddClick} className="flex items-center gap-2">
        <Tag className="h-4 w-4" aria-hidden="true" />
        <span>{UI_TEXT.EMPTY_ACTION}</span>
      </Button>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

AttributeEmptyState.propTypes = {
  /** Callback when add button is clicked */
  onAddClick: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(AttributeEmptyState);

