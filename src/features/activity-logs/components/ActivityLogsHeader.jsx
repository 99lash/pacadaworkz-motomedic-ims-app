/**
 * ActivityLogsHeader Component
 * 
 * Page header with title and subtitle based on user role.
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
 * ActivityLogsHeader displays page title and subtitle
 */
const ActivityLogsHeader = ({ userRole }) => {
  const subtitle = userRole === 'staff' 
    ? UI_TEXT.PAGE_SUBTITLE_STAFF 
    : UI_TEXT.PAGE_SUBTITLE_ADMIN;

  return (
    <header>
      <div className="flex items-center gap-3 mb-2">
        <Activity className="h-6 w-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {UI_TEXT.PAGE_TITLE}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground dark:text-gray-400">
        {subtitle}
      </p>
    </header>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ActivityLogsHeader.propTypes = {
  /** User role to determine subtitle */
  userRole: PropTypes.string,
};

ActivityLogsHeader.defaultProps = {
  userRole: 'staff',
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ActivityLogsHeader);

