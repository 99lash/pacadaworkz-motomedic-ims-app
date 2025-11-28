/**
 * Settings Feature Constants
 * Centralized configuration values for the settings module
 */

// =============================================================================
// UI CONSTANTS
// =============================================================================
export const UI_TEXT = {
  // Page
  PAGE_TITLE: 'Settings',
  PAGE_SUBTITLE: 'Manage your account and preferences',
  
  // Tabs
  TAB_PROFILE: 'Profile',
  TAB_SECURITY: 'Security',
  TAB_PREFERENCES: 'Preferences',
  TAB_DATABASE: 'Database',
  
  // Profile Tab
  PROFILE_FIRST_NAME: 'First Name',
  PROFILE_LAST_NAME: 'Last Name',
  PROFILE_USERNAME: 'Username',
  PROFILE_EMAIL: 'Email',
  PROFILE_ROLE: 'Role',
  PROFILE_ROLE_HELP: 'Contact your administrator to change your role',
  PROFILE_SAVE_CHANGES: 'Save Changes',
  
  // Security Tab
  SECURITY_TITLE: 'Change Password',
  SECURITY_CURRENT_PASSWORD: 'Current Password',
  SECURITY_NEW_PASSWORD: 'New Password',
  SECURITY_CONFIRM_PASSWORD: 'Confirm New Password',
  SECURITY_UPDATE_PASSWORD: 'Update Password',
  SECURITY_COMING_SOON: 'Password change feature coming soon',
  
  // Preferences Tab
  PREFERENCES_TITLE: 'Display Preferences',
  PREFERENCES_DARK_MODE: 'Dark Mode',
  PREFERENCES_DARK_MODE_DESC: 'Switch to dark theme',
  
  // Database Tab
  DATABASE_TITLE: 'Database Management',
  DATABASE_SUBTITLE: 'Backup and restore your system data',
  DATABASE_INFO_TITLE: 'All data is stored locally in your browser',
  DATABASE_INFO_DESC: 'Regular backups are recommended to prevent data loss. Backup files include all products, transactions, users, and settings.',
  DATABASE_TOTAL_RECORDS: 'Total Records',
  DATABASE_STORAGE_USED: 'Storage Used',
  DATABASE_LAST_BACKUP: 'Last Backup',
  DATABASE_NEVER: 'Never',
  DATABASE_CREATE_BACKUP: 'Create Backup',
  DATABASE_BACKUP_DESC: 'Export all system data to a JSON file',
  DATABASE_BACKUP_INCLUDES: 'This backup will include:',
  DATABASE_BACKUP_CREATE_FULL: 'Create Full Backup',
  DATABASE_BACKUP_QUICK: 'Quick Backup (Products Only)',
  DATABASE_BACKUP_QUICK_COMING_SOON: 'Quick backup feature coming soon',
  DATABASE_RESTORE_TITLE: 'Restore Database',
  DATABASE_RESTORE_DESC: 'Import data from a backup file',
  DATABASE_RESTORE_WARNING: 'Warning: Restoring will overwrite current data',
  DATABASE_RESTORE_WARNING_DESC: 'Make sure to create a backup of your current data before restoring. This action cannot be undone.',
  DATABASE_RESTORE_DROP: 'Drop your backup file here',
  DATABASE_RESTORE_BROWSE: 'or click to browse',
  DATABASE_RESTORE_SELECT: 'Select Backup File',
  DATABASE_RESTORE_FORMAT: 'Accepted format: .json',
  DATABASE_RESTORE_BUTTON: 'Restore Database',
  DATABASE_RESTORE_VALIDATE: 'Validate Backup File',
  DATABASE_RESTORE_SELECT_FIRST: 'Please select a backup file first',
  DATABASE_RESTORE_VALIDATE_DESC: 'Validation will check file integrity before restore',
  DATABASE_EXPORT_TITLE: 'Export Data',
  DATABASE_EXPORT_DESC: 'Export specific data types',
  DATABASE_EXPORT_PRODUCTS: 'Export Products (CSV)',
  DATABASE_EXPORT_TRANSACTIONS: 'Export Transactions (CSV)',
  DATABASE_EXPORT_INVENTORY: 'Export Inventory (CSV)',
  DATABASE_SCHEDULED_TITLE: 'Scheduled Backups',
  DATABASE_SCHEDULED_DESC: 'Automatic backup settings',
  DATABASE_SCHEDULED_AUTO: 'Auto Backup',
  DATABASE_SCHEDULED_FREQUENCY: 'Backup Frequency',
  DATABASE_SCHEDULED_DAILY: 'Daily',
  DATABASE_SCHEDULED_WEEKLY: 'Weekly',
  DATABASE_SCHEDULED_MONTHLY: 'Monthly',
  DATABASE_HISTORY_TITLE: 'Recent Backups',
  DATABASE_HISTORY_EMPTY: 'No backup history available',
  DATABASE_HISTORY_EMPTY_DESC: 'Create your first backup to see it here',
  
  // Toast Messages
  TOAST_PROFILE_UPDATED: 'Profile updated successfully',
  TOAST_BACKUP_CREATED: 'Backup created successfully!',
  TOAST_FILE_SELECTED: 'File "{name}" selected. Click Restore to proceed.',
  TOAST_EXPORT_PRODUCTS: 'Exporting products as CSV',
  TOAST_EXPORT_TRANSACTIONS: 'Exporting transactions as CSV',
  TOAST_EXPORT_INVENTORY: 'Exporting inventory as CSV',
};

// =============================================================================
// STORAGE KEYS
// =============================================================================
export const STORAGE_KEYS = {
  USERS: 'motomedic_users',
  CURRENT_USER: 'motomedic_current_user',
  LAST_BACKUP: 'motomedic_last_backup',
  PRODUCTS: 'motomedic_products',
  TRANSACTIONS: 'motomedic_transactions',
  CATEGORIES: 'motomedic_categories',
  BRANDS: 'motomedic_brands',
  SUPPLIERS: 'motomedic_suppliers',
};

// =============================================================================
// TAB TYPES
// =============================================================================
export const TAB_TYPES = {
  PROFILE: 'profile',
  SECURITY: 'security',
  PREFERENCES: 'preferences',
  DATABASE: 'database',
};

// =============================================================================
// BACKUP DATA KEYS
// =============================================================================
export const BACKUP_DATA_KEYS = [
  STORAGE_KEYS.PRODUCTS,
  STORAGE_KEYS.TRANSACTIONS,
  STORAGE_KEYS.USERS,
  STORAGE_KEYS.CATEGORIES,
  STORAGE_KEYS.BRANDS,
  STORAGE_KEYS.SUPPLIERS,
];

