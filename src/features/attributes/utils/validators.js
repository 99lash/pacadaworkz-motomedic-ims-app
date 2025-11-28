/**
 * Attribute Form Validators
 */

import { VALIDATION } from './constants';

/**
 * Validates attribute form data
 * @param {Object} formData - Form data to validate
 * @param {Array} attributes - Existing attributes array
 * @param {string|null} currentAttributeId - Current attribute ID (for edit mode)
 * @returns {Object} Validation result with isValid and errors
 */
export const validateAttributeForm = (formData, attributes = [], currentAttributeId = null) => {
  const errors = {};
  const trimmedName = formData.name?.trim() || '';

  // Name validation
  if (!trimmedName) {
    errors.name = 'Attribute name is required.';
  } else if (trimmedName.length < VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Attribute name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters.`;
  } else if (trimmedName.length > VALIDATION.NAME_MAX_LENGTH) {
    errors.name = `Attribute name must not exceed ${VALIDATION.NAME_MAX_LENGTH} characters.`;
  } else {
    // Check for duplicate names (case-insensitive)
    const duplicate = attributes.find(
      (attribute) =>
        attribute.id !== currentAttributeId &&
        attribute.name?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      errors.name = 'An attribute with this name already exists.';
    }
  }

  // Description validation (optional)
  if (formData.description && formData.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must not exceed ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

