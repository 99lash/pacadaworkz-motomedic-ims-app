export const API_ENDPOINTS = {
  SUPPLIERS: '/v1/suppliers',
  SUPPLIER_BY_ID: (id) => `/v1/suppliers/${id}`,
};

export const UI_TEXT = {
  PAGE_TITLE: 'Supplier Management',
  PAGE_SUBTITLE: 'Manage your suppliers and vendors',
  BTN_ADD_SUPPLIER: 'Add Supplier',
  EMPTY_TITLE: 'No suppliers found',
  EMPTY_DESCRIPTION: 'Add your first supplier to get started.',
  EMPTY_ACTION: 'Add your first supplier',
  FORM_TITLE_CREATE: 'New Supplier',
  FORM_TITLE_EDIT: 'Edit Supplier',
  LABEL_COMPANY_NAME: 'Company Name',
  LABEL_CONTACT_PERSON: 'Contact Person',
  LABEL_PHONE: 'Phone',
  LABEL_EMAIL: 'Email',
  LABEL_ADDRESS: 'Address',
  LABEL_PAYMENT_TERMS: 'Payment Terms',
  PLACEHOLDER_COMPANY_NAME: 'Enter company name',
  PLACEHOLDER_CONTACT_PERSON: 'Enter contact person name',
  PLACEHOLDER_PHONE: 'Enter phone number',
  PLACEHOLDER_EMAIL: 'Enter email address',
  PLACEHOLDER_ADDRESS: 'Enter address',
  PLACEHOLDER_PAYMENT_TERMS: 'e.g., Net 30, COD',
  TOAST_CREATE: 'Supplier created successfully',
  TOAST_UPDATE: 'Supplier updated successfully',
  TOAST_DELETE: 'Supplier deleted successfully',
  TOAST_FORM_ERROR: 'Please fix the highlighted errors.',
};

export const INITIAL_FORM_STATE = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  paymentTerms: '',
};

export const INITIAL_FORM_ERRORS = {
  companyName: '',
  email: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSupplierForm = (formData) => {
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
