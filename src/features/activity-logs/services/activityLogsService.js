/**
 * Activity Logs Service
 * Handles all data operations for the activity logs feature
 */

import apiClient from '../../../shared/services/apiClient';

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all activity logs from API
 * @param {Object} params - Query parameters (search, user_id, page, etc.)
 * @returns {Promise<Object>} API response containing data and meta
 */
export const fetchActivityLogs = async (params = {}) => {
  const response = await apiClient.get('/v1/activity-logs', { 
    params: {
      ...params,
      per_page: params.pageSize,
      page: params.page,
    }
  });
  
  // Backend resource doesn't include ID, so we generate one for the frontend key
  const logs = response.data.data.map((log, index) => ({
    ...log,
    id: log.id || `log-${Date.now()}-${index}`,
  }));

  const meta = response.data.meta;

  return {
    ...response.data,
    data: logs,
    pagination: {
      page: meta?.current_page || params.page || 1,
      pageSize: meta?.per_page || params.pageSize || 20,
      totalItems: meta?.total || 0,
      totalPages: meta?.last_page || 0,
      hasNextPage: (meta?.current_page || 1) < (meta?.last_page || 0),
      hasPrevPage: (meta?.current_page || 1) > 1,
    },
  };
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const activityLogsService = {
  fetchActivityLogs,
};

export default activityLogsService;

