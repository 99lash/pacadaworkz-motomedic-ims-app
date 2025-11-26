/**
 * User Service
 * Handles all data operations for the users feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const USER_STORAGE_KEY = 'motomedic_users';

// =============================================================================
// MOCK DATA (Remove when integrating with real API)
// =============================================================================

const MOCK_USERS = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2025-01-30 14:30',
    permissions: {
      products: { create: true, read: true, update: true, delete: true },
      inventory: { create: true, read: true, update: true, delete: true },
      transactions: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      reports: { create: true, read: true, update: false, delete: false },
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-30T14:30:00Z',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: '2025-01-30 11:15',
    permissions: {
      products: { create: true, read: true, update: true, delete: false },
      inventory: { create: true, read: true, update: true, delete: false },
      transactions: { create: true, read: true, update: true, delete: false },
      users: { create: false, read: true, update: false, delete: false },
      reports: { create: true, read: true, update: false, delete: false },
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2025-01-30T11:15:00Z',
  },
  {
    id: 3,
    name: 'Mike Davis',
    email: 'mike.davis@company.com',
    role: 'User',
    status: 'Active',
    lastLogin: '2025-01-29 16:45',
    permissions: {
      products: { create: false, read: true, update: false, delete: false },
      inventory: { create: false, read: true, update: true, delete: false },
      transactions: { create: true, read: true, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
    },
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2025-01-29T16:45:00Z',
  },
  {
    id: 4,
    name: 'Emily Wilson',
    email: 'emily.wilson@company.com',
    role: 'User',
    status: 'Inactive',
    lastLogin: '2025-01-20 09:30',
    permissions: {
      products: { create: false, read: true, update: false, delete: false },
      inventory: { create: false, read: true, update: false, delete: false },
      transactions: { create: false, read: true, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: true, update: false, delete: false },
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2025-01-20T09:30:00Z',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const readFromStorage = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const generateUserId = () => {
  const users = fetchUsers();
  const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
  return maxId + 1;
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all users
 * @returns {Array} Users array
 */
export const fetchUsers = () => {
  const stored = readFromStorage(USER_STORAGE_KEY, MOCK_USERS);
  if (stored.length === 0 && typeof window !== 'undefined') {
    saveToStorage(USER_STORAGE_KEY, MOCK_USERS);
    return MOCK_USERS;
  }
  return stored;
};

/**
 * Fetches a single user by ID
 * @param {number} id - User ID
 * @returns {Object|null} User object or null
 */
export const fetchUserById = (id) => {
  const users = fetchUsers();
  return users.find(user => user.id === id) || null;
};

/**
 * Creates a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
export const createUser = (userData) => {
  const users = fetchUsers();
  const newUser = {
    id: generateUserId(),
    name: userData.name,
    email: userData.email,
    role: userData.role || 'User',
    status: userData.status || 'Active',
    lastLogin: null,
    permissions: userData.permissions || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedUsers = [...users, newUser];
  saveToStorage(USER_STORAGE_KEY, updatedUsers);
  return newUser;
};

/**
 * Updates an existing user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Object|null} Updated user or null
 */
export const updateUser = (id, userData) => {
  const users = fetchUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return null;
  
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString(),
  };
  
  const updatedUsers = [
    ...users.slice(0, index),
    updatedUser,
    ...users.slice(index + 1),
  ];
  
  saveToStorage(USER_STORAGE_KEY, updatedUsers);
  return updatedUser;
};

/**
 * Deletes a user
 * @param {number} id - User ID
 * @returns {boolean} Success status
 */
export const deleteUser = (id) => {
  const users = fetchUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false; // User not found
  }
  
  saveToStorage(USER_STORAGE_KEY, filteredUsers);
  return true;
};

/**
 * Updates user permissions
 * @param {number} id - User ID
 * @param {Object} permissions - Permissions object
 * @returns {Object|null} Updated user or null
 */
export const updateUserPermissions = (id, permissions) => {
  return updateUser(id, { permissions });
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const userService = {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPermissions,
};

export default userService;

