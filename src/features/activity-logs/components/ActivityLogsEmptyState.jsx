/**
 * ActivityLogsEmptyState Component
 * 
 * Displays empty state when no activity logs are found.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActivityLogsEmptyState displays when no logs are found
 */
const ActivityLogsEmptyState = ({ hasFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <Activity 
        className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" 
        aria-hidden="true"
      />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {UI_TEXT.EMPTY_STATE_TITLE}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
        {hasFilters 
          ? UI_TEXT.EMPTY_STATE_DESCRIPTION
          : 'No activity logs have been recorded yet.'}
      </p>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ActivityLogsEmptyState.propTypes = {
  /** Whether filters are currently applied */
  hasFilters: PropTypes.bool,
};

ActivityLogsEmptyState.defaultProps = {
  hasFilters: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ActivityLogsEmptyState);

