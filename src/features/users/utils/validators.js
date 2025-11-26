/**
 * User Form Validators
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUserForm = (formData, users = [], currentUserId = null) => {
  const errors = {};
  const trimmedName = formData.name?.trim() || '';
  const trimmedEmail = formData.email?.trim() || '';

  // Name validation
  if (!trimmedName) {
    errors.name = 'Full name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (trimmedName.length > 100) {
    errors.name = 'Name must not exceed 100 characters.';
  }

  // Email validation
  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  } else {
    const exists = users.some(
      (user) => user.email.toLowerCase() === trimmedEmail.toLowerCase() && user.id !== currentUserId
    );
    if (exists) {
      errors.email = 'Email address is already in use.';
    }
  }

  // Role validation
  if (!formData.role) {
    errors.role = 'Role is required.';
  }

  // Password validation (only for new users)
  if (!currentUserId && !formData.password?.trim()) {
    errors.password = 'Temporary password is required for new users.';
  } else if (formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

