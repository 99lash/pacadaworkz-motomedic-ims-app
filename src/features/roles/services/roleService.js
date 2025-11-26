const ROLE_STORAGE_KEY = 'motomedic_roles';
const USER_STORAGE_KEY = 'motomedic_users';

const MOCK_ROLES = [
  {
    id: 'role_superadmin',
    name: 'SuperAdmin',
    description: 'Full system access',
    permissions: [{ module: 'roles', actions: ['view', 'create', 'edit', 'delete'] }],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_admin',
    name: 'Admin',
    description: 'Manage settings and users',
    permissions: [{ module: 'users', actions: ['view', 'create', 'edit'] }],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'role_staff',
    name: 'Staff',
    description: 'Limited operational access',
    permissions: [{ module: 'products', actions: ['view', 'edit'] }],
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const readFromStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const fetchRoles = () => {
  const stored = readFromStorage(ROLE_STORAGE_KEY, MOCK_ROLES);
  if (stored.length === 0 && typeof window !== 'undefined') {
    window.localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(MOCK_ROLES));
    return MOCK_ROLES;
  }
  return stored;
};

export const fetchUsers = () => readFromStorage(USER_STORAGE_KEY);

export const saveRoles = (roles) => {
  window.localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(roles));
  return roles;
};

export const generateRoleId = () =>
  `role_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const roleService = {
  fetchRoles,
  fetchUsers,
  saveRoles,
  generateRoleId,
};

export default roleService;

