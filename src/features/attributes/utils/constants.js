/**
 * Attributes Feature Constants
 * Centralized configuration values for the attributes module
 */

// =============================================================================
// UI CONSTANTS
// =============================================================================
export const UI_TEXT = {
  PAGE_TITLE: 'Attribute Management',
  PAGE_SUBTITLE: 'Manage product attributes (size, color, viscosity, etc.)',
  BTN_ADD_ATTRIBUTE: 'Add Attribute',
  EMPTY_TITLE: 'No attributes found',
  EMPTY_DESCRIPTION: 'Add your first attribute to get started.',
  EMPTY_ACTION: 'Add your first attribute',
  FORM_TITLE_CREATE: 'New Attribute',
  FORM_TITLE_EDIT: 'Edit Attribute',
  FORM_DESCRIPTION_CREATE: 'Add a new attribute that can be used when creating products.',
  FORM_DESCRIPTION_EDIT: 'Update the attribute information.',
  LABEL_NAME: 'Attribute Name',
  LABEL_DESCRIPTION: 'Description',
  PLACEHOLDER_NAME: 'e.g., Size, Color, Viscosity, Volume, Type',
  PLACEHOLDER_DESCRIPTION: 'Enter attribute description (optional)',
  TOAST_CREATE: 'Attribute created successfully',
  TOAST_UPDATE: 'Attribute updated successfully',
  TOAST_DELETE: 'Attribute deleted successfully',
  TOAST_FORM_ERROR: 'Please fix the highlighted errors.',
  DELETE_TITLE: 'Delete Attribute',
  DELETE_DESCRIPTION: 'This action cannot be undone.',
  DELETE_CONFIRM: 'Are you sure you want to delete',
  DELETE_WARNING: 'This will permanently remove the attribute and may affect products associated with it.',
};

// =============================================================================
// FORM INITIAL STATES
// =============================================================================
export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
};

export const INITIAL_FORM_ERRORS = {
  name: '',
};

// =============================================================================
// VALIDATION RULES
// =============================================================================
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

