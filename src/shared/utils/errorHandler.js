/**
 * Error Handler Utilities
 * Consistent error message extraction and handling
 */

/**
 * Extract error message from error object
 * @param {Error|Object} error - Error object
 * @param {string} defaultMessage - Default message if extraction fails
 * @returns {string} Error message
 */
export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
  if (!error) return defaultMessage;

  // Axios error response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error response with data array (validation errors)
  if (error.response?.data?.data && typeof error.response.data.data === 'object') {
    const errors = error.response.data.data;
    const firstError = Object.values(errors)[0];
    if (Array.isArray(firstError)) {
      return firstError[0];
    }
    return firstError || defaultMessage;
  }

  // Error object with message property
  if (error.message) {
    return error.message;
  }

  // String error
  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

/**
 * Check if error is a network error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is a validation error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 422;
};

/**
 * Check if error is an authentication error
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if authentication error
 */
export const isAuthenticationError = (error) => {
  return error.response?.status === 401;
};

export default {
  extractErrorMessage,
  isNetworkError,
  isValidationError,
  isAuthenticationError,
};

