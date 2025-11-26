export const UI_TEXT = {
  PAGE_TITLE: 'User Management',
  PAGE_SUBTITLE: 'Manage user accounts and permissions',
  BTN_ADD_USER: 'Add User',
  EMPTY_TITLE: 'No users found',
  EMPTY_DESCRIPTION: 'Create your first user account to get started.',
  EMPTY_ACTION: 'Add your first user',
  FORM_TITLE_CREATE: 'Add New User',
  FORM_TITLE_EDIT: 'Edit User',
  PERMISSIONS_TITLE: 'Manage Permissions',
  LABEL_NAME: 'Full Name',
  LABEL_EMAIL: 'Email',
  LABEL_ROLE: 'Role',
  LABEL_STATUS: 'Status',
  LABEL_PASSWORD: 'Temporary Password',
  LABEL_PERMISSIONS: 'Permissions',
  PLACEHOLDER_NAME: 'Enter full name',
  PLACEHOLDER_EMAIL: 'Enter email address',
  PLACEHOLDER_PASSWORD: 'Generate password',
  PLACEHOLDER_ROLE: 'Select role',
  TOAST_CREATE: 'User created successfully',
  TOAST_UPDATE: 'User updated successfully',
  TOAST_DELETE: 'User deleted successfully',
  TOAST_PERMISSIONS_UPDATE: 'Permissions updated successfully',
  TOAST_FORM_ERROR: 'Please fix the highlighted errors.',
};

export const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  role: 'User',
  status: 'Active',
  password: '',
  permissions: {},
};

export const INITIAL_FORM_ERRORS = {
  name: '',
  email: '',
  role: '',
  password: '',
};

export const USER_ROLES = ['Admin', 'Manager', 'User'];

export const USER_STATUSES = ['Active', 'Inactive'];

export const PERMISSION_MODULES = [
  'products',
  'inventory',
  'transactions',
  'users',
  'reports',
];

export const PERMISSION_ACTIONS = ['create', 'read', 'update', 'delete'];

