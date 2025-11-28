/**
 * Activity Logs Feature Constants
 * Centralized configuration values for the activity logs module
 */

// =============================================================================
// UI CONSTANTS
// =============================================================================
export const UI_TEXT = {
  // Page
  PAGE_TITLE: 'Activity Logs',
  PAGE_SUBTITLE_STAFF: 'View your activity history',
  PAGE_SUBTITLE_ADMIN: 'View all system activities',
  
  // Filters
  SEARCH_PLACEHOLDER: 'Search logs...',
  FILTER_ALL_MODULES: 'All Modules',
  
  // Table Headers
  COLUMN_TIMESTAMP: 'Timestamp',
  COLUMN_USER: 'User',
  COLUMN_MODULE: 'Module',
  COLUMN_ACTION: 'Action',
  COLUMN_DETAILS: 'Details',
  
  // Summary
  SUMMARY_SHOWING: 'Showing',
  SUMMARY_OF: 'of',
  SUMMARY_LOGS: 'logs',
  
  // Empty State
  EMPTY_STATE_TITLE: 'No activity logs found',
  EMPTY_STATE_DESCRIPTION: 'No activity logs match your search criteria.',
};

// =============================================================================
// STORAGE KEYS
// =============================================================================
export const STORAGE_KEYS = {
  ACTIVITY_LOGS: 'motomedic_activity_logs',
};

// =============================================================================
// FILTER CONFIGURATION
// =============================================================================
export const FILTER_CONFIG = {
  DEBOUNCE_DELAY: 300, // milliseconds
};

