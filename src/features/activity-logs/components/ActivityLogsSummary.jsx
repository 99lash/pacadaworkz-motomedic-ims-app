/**
 * ActivityLogsSummary Component
 * 
 * Displays summary information about filtered and total logs.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActivityLogsSummary displays log count summary
 */
const ActivityLogsSummary = ({ filteredCount, totalCount }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {UI_TEXT.SUMMARY_SHOWING}{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {filteredCount}
          </span>{' '}
          {UI_TEXT.SUMMARY_OF}{' '}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {totalCount}
          </span>{' '}
          {UI_TEXT.SUMMARY_LOGS}
        </p>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ActivityLogsSummary.propTypes = {
  /** Number of filtered logs */
  filteredCount: PropTypes.number.isRequired,
  /** Total number of logs */
  totalCount: PropTypes.number.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ActivityLogsSummary);

