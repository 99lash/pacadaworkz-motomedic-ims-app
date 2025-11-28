/**
 * ActivityLogsPage Component
 * 
 * Main page component for viewing activity logs.
 * Features:
 * - Role-based access control (staff see only their logs, admins see all)
 * - Search functionality
 * - Module filtering
 * - Responsive design with dark mode support
 * - Accessible and user-friendly interface
 */

import React from 'react';
import { useAuth } from '../auth';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/components/ui/card';
import { useActivityLogs } from './hooks';
import {
  ActivityLogsHeader,
  ActivityLogsFilters,
  ActivityLogsTable,
  ActivityLogsEmptyState,
  ActivityLogsSummary,
} from './components';
import { UI_TEXT } from './utils';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const ActivityLogsPage = () => {
  // ---------------------------------------------------------------------------
  // AUTH - Get current user
  // ---------------------------------------------------------------------------
  const { user } = useAuth();

  // ---------------------------------------------------------------------------
  // HOOK - All state and handlers
  // ---------------------------------------------------------------------------
  const {
    // Data
    logs,
    filteredLogs,
    isLoading,

    // Filters
    searchTerm,
    filterModule,
    modules,

    // Handlers
    handleSearchChange,
    handleModuleFilterChange,
  } = useActivityLogs(user);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------
  const hasFilters = Boolean(searchTerm || filterModule);

  // ---------------------------------------------------------------------------
  // RENDER - Loading State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <ActivityLogsHeader userRole={user?.role} />
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground dark:text-gray-400">
                Loading activity logs...
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER - Main Content
  // ---------------------------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <ActivityLogsHeader userRole={user?.role} />

      {/* Filters */}
      <ActivityLogsFilters
        searchTerm={searchTerm}
        filterModule={filterModule}
        modules={modules}
        onSearchChange={handleSearchChange}
        onModuleFilterChange={handleModuleFilterChange}
      />

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length > 0 ? (
            <ActivityLogsTable logs={filteredLogs} />
          ) : (
            <ActivityLogsEmptyState hasFilters={hasFilters} />
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {logs.length > 0 && (
        <ActivityLogsSummary 
          filteredCount={filteredLogs.length} 
          totalCount={logs.length} 
        />
      )}
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default ActivityLogsPage;

