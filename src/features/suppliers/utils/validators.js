/**
 * Supplier Form Validators
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSupplierForm = (formData, suppliers = [], currentSupplierId = null) => {
  const errors = {};
  const trimmedCompanyName = formData.companyName?.trim() || '';
  const trimmedEmail = formData.email?.trim() || '';

  // Company Name validation
  if (!trimmedCompanyName) {
    errors.companyName = 'Company name is required.';
  } else if (trimmedCompanyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters.';
  } else if (trimmedCompanyName.length > 100) {
    errors.companyName = 'Company name must not exceed 100 characters.';
  }

  // Email validation (optional but must be valid if provided)
  if (trimmedEmail && !EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

