/**
 * ActivityLogsTable Component
 * 
 * Displays activity logs in a table format with proper formatting.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { Badge } from '../../../shared/components/ui/badge';
import { formatTimestamp } from '../utils';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActivityLogsTable displays activity logs in a table
 */
const ActivityLogsTable = ({ logs }) => {
  if (logs.length === 0) {
    return null; // Empty state is handled by parent
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.COLUMN_TIMESTAMP}
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.COLUMN_USER}
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.COLUMN_MODULE}
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.COLUMN_ACTION}
            </TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.COLUMN_DETAILS}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                {formatTimestamp(log.timestamp)}
              </TableCell>
              <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                {log.user || 'Unknown'}
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                >
                  {log.module || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {log.action || 'N/A'}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {log.details || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ActivityLogsTable.propTypes = {
  /** Array of activity logs to display */
  logs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      user: PropTypes.string,
      module: PropTypes.string,
      action: PropTypes.string,
      details: PropTypes.string,
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ActivityLogsTable);

