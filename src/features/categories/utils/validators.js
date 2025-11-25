/**
 * Categories Validation Utilities
 * Pure functions for validating category data
 */

import { VALIDATION, UI_TEXT } from './constants';

/**
 * Validates category name
 * @param {string} name - Category name to validate
 * @param {Array} existingCategories - List of existing categories
 * @param {string|null} currentCategoryId - ID of category being edited (null for new)
 * @returns {{ isValid: boolean, error: string }}
 */
export const validateCategoryName = (name, existingCategories = [], currentCategoryId = null) => {
  const trimmedName = name?.trim() || '';
  
  // Required check
  if (!trimmedName) {
    return {
      isValid: false,
      error: UI_TEXT.VALIDATION_NAME_REQUIRED,
    };
  }
  
  // Min length check
  if (trimmedName.length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: UI_TEXT.VALIDATION_NAME_MIN_LENGTH,
    };
  }
  
  // Max length check
  if (trimmedName.length > VALIDATION.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: UI_TEXT.VALIDATION_NAME_MAX_LENGTH,
    };
  }
  
  // Uniqueness check (case-insensitive)
  const isDuplicate = existingCategories.some(
    (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase() && cat.id !== currentCategoryId
  );
  
  if (isDuplicate) {
    return {
      isValid: false,
      error: UI_TEXT.VALIDATION_NAME_EXISTS,
    };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validates entire category form
 * @param {Object} formData - Form data to validate
 * @param {Array} existingCategories - List of existing categories
 * @param {string|null} currentCategoryId - ID of category being edited
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateCategoryForm = (formData, existingCategories = [], currentCategoryId = null) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateCategoryName(
    formData.name,
    existingCategories,
    currentCategoryId
  );
  
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error;
  }
  
  // Description is optional, but we can add length validation if needed
  if (formData.description && formData.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes category form data
 * @param {Object} formData - Raw form data
 * @returns {Object} Sanitized form data
 */
export const sanitizeCategoryData = (formData) => ({
  name: formData.name?.trim() || '',
  description: formData.description?.trim() || '',
});

