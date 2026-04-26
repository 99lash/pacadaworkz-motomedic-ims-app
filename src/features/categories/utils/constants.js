/**
 * Categories Feature Constants
 * Centralized configuration values for the categories module
 */

// =============================================================================
// API ENDPOINTS
// =============================================================================
export const API_ENDPOINTS = {
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id) => `/api/categories/${id}`,
};

// =============================================================================
// UI CONSTANTS
// =============================================================================
export const UI_TEXT = {
  // Page
  PAGE_TITLE: 'Product Categories',
  
  // Buttons
  BTN_ADD_CATEGORY: 'Add New Category',
  BTN_SAVE: 'Save Category',
  BTN_UPDATE: 'Update Category',
  BTN_CANCEL: 'Cancel',
  BTN_DELETE: 'Delete',
  
  // Form Labels
  LABEL_NAME: 'Category Name',
  LABEL_DESCRIPTION: 'Description',
  
  // Placeholders
  PLACEHOLDER_SEARCH: 'Search categories...',
  PLACEHOLDER_NAME: 'Enter category name',
  PLACEHOLDER_DESCRIPTION: 'Enter category description (optional)',
  
  // Dialog Titles
  DIALOG_ADD_TITLE: 'Add New Category',
  DIALOG_ADD_DESC: 'Create a new product category to organize your inventory.',
  DIALOG_EDIT_TITLE: 'Edit Category',
  DIALOG_EDIT_DESC: 'Update the category information.',
  DIALOG_DELETE_TITLE: 'Delete Category',
  
  // Messages
  MSG_NO_CATEGORIES: 'No categories found',
  MSG_NO_SEARCH_RESULTS: 'No categories match your search.',
  MSG_ADD_FIRST: 'Add your first category to get started.',
  MSG_NO_DESCRIPTION: 'No description',
  
  // Toast Messages
  TOAST_ADD_SUCCESS: 'Category added successfully',
  TOAST_UPDATE_SUCCESS: 'Category updated successfully',
  TOAST_DELETE_SUCCESS: 'Category deleted successfully',
  TOAST_DELETE_ERROR: 'Cannot delete category with products. Please reassign products first.',
  TOAST_LOAD_ERROR: 'Failed to load categories. Please try again.',
  TOAST_SAVE_ERROR: 'Failed to save category. Please try again.',
  
  // Validation
  VALIDATION_NAME_REQUIRED: 'Category name is required',
  VALIDATION_NAME_EXISTS: 'Category name already exists',
  VALIDATION_NAME_MIN_LENGTH: 'Category name must be at least 2 characters',
  VALIDATION_NAME_MAX_LENGTH: 'Category name must be less than 50 characters',
};

// =============================================================================
// VALIDATION RULES
// =============================================================================
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
};

// =============================================================================
// DEBOUNCE DELAYS (ms)
// =============================================================================
export const DEBOUNCE = {
  SEARCH: 300,
};

// =============================================================================
// TABLE CONFIGURATION
// =============================================================================
export const CATEGORY_TABLE_CONFIG = {
  COLUMNS: ['name', 'description', 'actions'],
  DEFAULT_SORT: 'name',
  DEFAULT_SORT_ORDER: 'asc',
};

