export const validateRoleForm = (formData, roles = [], currentRoleId = null) => {
  const errors = {};
  const trimmedName = formData.name?.trim() || '';

  if (!trimmedName) {
    errors.name = 'Role name is required.';
  } else {
    const exists = roles.some((role) => {
      const roleName = role.role || role.name;
      return roleName?.toLowerCase() === trimmedName.toLowerCase() && role.id !== currentRoleId;
    });
    
    if (exists) {
      errors.name = 'Role name must be unique.';
    }
  }

  if (!formData.permissions || formData.permissions.length === 0) {
    errors.permissions = 'Assign at least one permission.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
