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

import { Pagination } from '../../shared/components/ui/pagination';

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
    totalItems,
    isLoading,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Filters
    searchTerm,
    filterModule,
    modules,

    // Handlers
    handleSearchChange,
    handleModuleFilterChange,
  } = useActivityLogs(user, { initialPageSize: 10 });

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------
  const hasFilters = Boolean(searchTerm || filterModule);

  // ---------------------------------------------------------------------------
  // RENDER - Loading State
  // ---------------------------------------------------------------------------
  if (isLoading && logs.length === 0) {
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
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            {isLoading && logs.length > 0 && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
            {logs.length > 0 ? (
              <ActivityLogsTable logs={logs} />
            ) : (
              <ActivityLogsEmptyState hasFilters={hasFilters} />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            startItem={paginationInfo.startItem}
            endItem={paginationInfo.endItem}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            showPageSizeSelector={true}
            showItemCount={true}
            showFirstLast={totalPages > 5}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Summary */}
      {logs.length > 0 && (
        <ActivityLogsSummary 
          filteredCount={logs.length} 
          totalCount={totalItems} 
        />
      )}
    </div>
  );
};


// =============================================================================
// EXPORT
// =============================================================================

export default ActivityLogsPage;

