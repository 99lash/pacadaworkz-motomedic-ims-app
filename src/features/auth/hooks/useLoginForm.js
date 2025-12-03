import { useState } from 'react';
import { useAuth } from './useAuth';
import { validateLoginCredentials } from '../../../shared/utils/validation';

/**
 * Custom hook for login form management
 * Handles form state, validation, and submission
 * Separates form logic from UI component
 */
export const useLoginForm = (onSuccess) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  /**
   * Update form field value
   * @param {string} field - Field name
   * @param {string} value - Field value
   */
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error for this field when user types
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if valid
   */
  const validate = () => {
    const validation = validateLoginCredentials(formData);
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate before submission
    if (!validate()) {
      return;
    }

    // Attempt login
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Call success callback if provided
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result.data);
      }
    }
  };

  /**
   * Reset form to initial state
   */
  const reset = () => {
    setFormData({
      email: '',
      password: '',
    });
    setValidationErrors({});
  };

  return {
    formData,
    validationErrors,
    loading,
    error,
    updateField,
    handleSubmit,
    reset,
  };
};

export default useLoginForm;

