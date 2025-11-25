/**
 * useCategoryForm Hook
 * 
 * Specialized hook for category form state management
 * Can be used independently for form-only scenarios
 */

import { useState, useCallback } from 'react';
import { validateCategoryForm, sanitizeCategoryData } from '../utils';

// =============================================================================
// INITIAL STATE
// =============================================================================
const INITIAL_FORM_STATE = {
  name: '',
  description: '',
};

const INITIAL_FORM_ERRORS = {
  name: '',
  description: '',
};

/**
 * Category form management hook
 * @param {Object} options - Hook options
 * @param {Object} options.initialData - Initial form data
 * @param {Array} options.existingCategories - List of existing categories for validation
 * @param {string} options.editingCategoryId - ID of category being edited (for uniqueness check)
 * @returns {Object} Form state and handlers
 */
export const useCategoryForm = ({
  initialData = null,
  existingCategories = [],
  editingCategoryId = null,
} = {}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [formData, setFormData] = useState(
    initialData || INITIAL_FORM_STATE
  );
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isDirty, setIsDirty] = useState(false);
  
  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------
  
  /**
   * Updates a form field
   */
  const setFieldValue = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear field error on change
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);
  
  /**
   * Sets a specific field error
   */
  const setFieldError = useCallback((field, error) => {
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  }, []);
  
  /**
   * Validates the entire form
   */
  const validate = useCallback(() => {
    const { isValid, errors } = validateCategoryForm(
      formData,
      existingCategories,
      editingCategoryId
    );
    
    setFormErrors(errors);
    return isValid;
  }, [formData, existingCategories, editingCategoryId]);
  
  /**
   * Gets sanitized form data
   */
  const getSanitizedData = useCallback(() => {
    return sanitizeCategoryData(formData);
  }, [formData]);
  
  /**
   * Resets form to initial state
   */
  const reset = useCallback((newInitialData = null) => {
    setFormData(newInitialData || INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsDirty(false);
  }, []);
  
  /**
   * Sets form data (for editing)
   */
  const setData = useCallback((data) => {
    setFormData({
      name: data.name || '',
      description: data.description || '',
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsDirty(false);
  }, []);
  
  // ---------------------------------------------------------------------------
  // RETURN VALUE
  // ---------------------------------------------------------------------------
  return {
    // State
    formData,
    formErrors,
    isDirty,
    
    // Field handlers
    setFieldValue,
    setFieldError,
    
    // Form handlers
    validate,
    getSanitizedData,
    reset,
    setData,
    
    // Convenience getters
    isValid: Object.values(formErrors).every((error) => !error),
  };
};

export default useCategoryForm;

