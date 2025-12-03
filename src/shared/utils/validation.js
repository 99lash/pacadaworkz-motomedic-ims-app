/**
 * Validation Utilities
 * Reusable validation functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {boolean} True if valid
 */
export const isValidPassword = (password, minLength = 6) => {
  if (!password || typeof password !== 'string') return false;
  return password.trim().length >= minLength;
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

/**
 * Validate login credentials
 * @param {Object} credentials - { email, password }
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateLoginCredentials = (credentials) => {
  const errors = {};

  if (!isRequired(credentials.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(credentials.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!isRequired(credentials.password)) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(credentials.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isValidEmail,
  isValidPassword,
  isRequired,
  validateLoginCredentials,
};

