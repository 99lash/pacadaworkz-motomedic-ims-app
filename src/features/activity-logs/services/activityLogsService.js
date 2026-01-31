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
  const response = await apiClient.get('/v1/activity-logs', { params });
  
  // Backend resource doesn't include ID, so we generate one for the frontend key
  const logs = response.data.data.map((log, index) => ({
    ...log,
    id: log.id || `log-${Date.now()}-${index}`,
  }));

  return {
    ...response.data,
    data: logs,
  };
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const activityLogsService = {
  fetchActivityLogs,
};

export default activityLogsService;

