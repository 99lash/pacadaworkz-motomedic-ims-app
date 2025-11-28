/**
 * Activity Logs Helper Functions
 * Utility functions for filtering, formatting, and processing activity logs
 */

/**
 * Filters activity logs based on search term and module filter
 * @param {Array} logs - Array of activity logs
 * @param {string} searchTerm - Search term to filter by
 * @param {string} filterModule - Module filter value
 * @returns {Array} Filtered logs
 */
export const filterLogs = (logs, searchTerm, filterModule) => {
  return logs.filter((log) => {
    const matchesSearch = 
      !searchTerm?.trim() ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModule = !filterModule || log.module === filterModule;
    
    return matchesSearch && matchesModule;
  });
};

/**
 * Gets unique modules from logs array
 * @param {Array} logs - Array of activity logs
 * @returns {Array} Array of unique module names
 */
export const getUniqueModules = (logs) => {
  return Array.from(new Set(logs.map((log) => log.module).filter(Boolean))).sort();
};

/**
 * Formats timestamp to locale string
 * @param {string|number} timestamp - Timestamp value
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString();
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return timestamp;
  }
};

/**
 * Filters logs by user role
 * Staff users only see their own logs, admins see all logs
 * @param {Array} logs - Array of all logs
 * @param {Object} user - User object with id and role
 * @returns {Array} Filtered logs based on user role
 */
export const filterLogsByUserRole = (logs, user) => {
  if (!user) return [];
  
  if (user.role === 'staff') {
    return logs.filter((log) => log.userId === user.id);
  }
  
  return logs;
};

