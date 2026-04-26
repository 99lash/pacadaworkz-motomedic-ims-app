/**
 * CategoryHeader Component
 * 
 * Page header with add button.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryHeader displays page title with actions
 */
const CategoryHeader = ({
  onAddClick,
}) => {
  return (
    <header className="space-y-4">
      {/* Page Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {UI_TEXT.PAGE_TITLE}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage product categories for your inventory
          </p>
        </div>
        
        <Button 
          onClick={onAddClick} 
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{UI_TEXT.BTN_ADD_CATEGORY}</span>
        </Button>
      </div>
    </header>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryHeader.propTypes = {
  /** Callback when add button is clicked */
  onAddClick: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategoryHeader);

