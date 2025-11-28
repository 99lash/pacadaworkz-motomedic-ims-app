/**
 * Activity Logs Service
 * Handles all data operations for the activity logs feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

import { STORAGE_KEYS } from '../utils';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const readFromStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return fallback;
  }
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all activity logs from storage
 * @returns {Array} Activity logs array
 */
export const fetchActivityLogs = () => {
  return readFromStorage(STORAGE_KEYS.ACTIVITY_LOGS, []);
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const activityLogsService = {
  fetchActivityLogs,
};

export default activityLogsService;

