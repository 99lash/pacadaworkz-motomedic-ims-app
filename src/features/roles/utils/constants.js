export const UI_TEXT = {
  PAGE_TITLE: 'Role Management',
  PAGE_SUBTITLE: 'Create custom roles and assign granular permissions.',
  BTN_ADD_ROLE: 'Create Role',
  INFO_TITLE: 'Role-Based Access Control',
  INFO_DESCRIPTION:
    'Define custom roles with specific permissions to control what users can access and do in the system.',
  EMPTY_TITLE: 'No roles created yet',
  EMPTY_DESCRIPTION: 'Create your first role to start managing team permissions.',
  EMPTY_ACTION: 'Create your first role',
  FORM_TITLE_CREATE: 'Create New Role',
  FORM_TITLE_EDIT: 'Edit Role',
  LABEL_NAME: 'Role Name',
  LABEL_DESCRIPTION: 'Description',
  LABEL_PERMISSIONS: 'Permissions',
  PLACEHOLDER_NAME: 'e.g., Store Manager',
  PLACEHOLDER_DESCRIPTION: 'Brief description of this role',
  TOAST_CREATE: 'Role created successfully',
  TOAST_UPDATE: 'Role updated successfully',
  TOAST_DELETE: 'Role deleted successfully',
  TOAST_DELETE_BLOCKED: 'Cannot delete role. {count} user(s) are assigned to it.',
  TOAST_FORM_ERROR: 'Please fix the highlighted errors.',
};

export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  permissions: [],
};

export const INITIAL_FORM_ERRORS = {
  name: '',
  permissions: '',
};

export const PERMISSION_MODULES = [
  {
    module: 'dashboard',
    label: 'Dashboard',
    actions: [{ action: 'view', label: 'View' }],
  },
  {
    module: 'inventory',
    label: 'Inventory',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'products',
    label: 'Products',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'categories',
    label: 'Categories',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'brands',
    label: 'Brands',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'attributes',
    label: 'Attributes',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'suppliers',
    label: 'Suppliers',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'pos',
    label: 'POS',
    actions: [
      { action: 'access', label: 'Access' },
      { action: 'create_transaction', label: 'Create Transaction' },
    ],
  },
  {
    module: 'purchases',
    label: 'Purchases',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'reports',
    label: 'Reports',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'export', label: 'Export' },
    ],
  },
  {
    module: 'activity_logs',
    label: 'Activity Logs',
    actions: [
      { action: 'view_own', label: 'View Own' },
      { action: 'view_all', label: 'View All' },
    ],
  },
  {
    module: 'users',
    label: 'Users',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'roles',
    label: 'Roles',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'create', label: 'Create' },
      { action: 'edit', label: 'Edit' },
      { action: 'delete', label: 'Delete' },
    ],
  },
  {
    module: 'settings',
    label: 'Settings',
    actions: [
      { action: 'view', label: 'View' },
      { action: 'edit', label: 'Edit' },
    ],
  },
];

