/**
 * Brand Form Validators
 */

export const validateBrandForm = (formData, brands = [], currentBrandId = null) => {
  const errors = {};
  const trimmedName = formData.name?.trim() || '';

  // Name validation
  if (!trimmedName) {
    errors.name = 'Brand name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Brand name must be at least 2 characters.';
  } else if (trimmedName.length > 100) {
    errors.name = 'Brand name must not exceed 100 characters.';
  } else {
    // Check for duplicate names (case-insensitive)
    const duplicate = brands.find(
      (brand) =>
        brand.id !== currentBrandId &&
        brand.name?.toLowerCase().trim() === trimmedName.toLowerCase()
    );
    if (duplicate) {
      errors.name = 'A brand with this name already exists.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

