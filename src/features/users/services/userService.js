import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  USERS: '/v1/users',
  USER_BY_ID: (id) => `/v1/users/${id}`,
};

const ROLE_NAME_MAP = {
  1: 'Super Admin',
  2: 'Admin',
  3: 'Staff',
};

const ROLE_ID_MAP = {
  'Super Admin': 1,
  'Admin': 2,
  'Staff': 3,
  'User': 3, // Default to Staff if 'User' is selected
  'Manager': 2, // Map Manager to Admin for now, or could be another role
};

// =============================================================================
// HELPERS
// =============================================================================

const transformUser = (user) => {
  return {
    ...user,
    role: ROLE_NAME_MAP[user.role_id] || 'User',
    status: user.is_active ? 'Active' : 'Inactive',
    lastLogin: user.last_login ? new Date(user.last_login).toLocaleString() : 'Never',
  };
};

const splitName = (fullName) => {
  const parts = fullName.trim().split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ') || firstName; // Fallback if no last name
  return { first_name: firstName, last_name: lastName };
};

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches all users
 * @returns {Promise<Object>}
 */
export const fetchUsers = async () => {
  try {
    // Fetch all users without pagination for management
    const response = await apiClient.get(`${API_ENDPOINTS.USERS}?per_page=1000`);

    if (response.data.success) {
      const users = (response.data.data || []).map(transformUser);
      return {
        data: users,
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: response.data.message || 'Failed to fetch users',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch users'),
    };
  }
};

/**
 * Fetches a single user by ID
 * @param {string|number} id - User ID
 * @returns {Promise<Object>}
 */
export const fetchUserById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.USER_BY_ID(id));

    if (response.data.success) {
      return {
        data: transformUser(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'User not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch user'),
    };
  }
};

/**
 * Creates a new user
 * @param {Object} userData - User data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.role - User role
 * @returns {Promise<Object>}
 */
export const createUser = async (userData) => {
  try {
    const { first_name, last_name } = splitName(userData.name);
    
    const payload = {
      name: userData.name, // Keep full name if backend uses it
      first_name,
      last_name,
      email: userData.email,
      password: userData.password,
      role_id: ROLE_ID_MAP[userData.role] || 3, // Default to Staff (3)
      is_default_password: true, // Assuming this is required based on StoreUserRequest
    };

    const response = await apiClient.post(API_ENDPOINTS.USERS, payload);

    if (response.data.success) {
      return {
        data: transformUser(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to create user',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create user'),
    };
  }
};

/**
 * Updates an existing user
 * @param {string|number} id - User ID
 * @param {Object} userData - Updated data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.role - User role
 * @returns {Promise<Object>}
 */
export const updateUser = async (id, userData) => {
  try {
    const { first_name, last_name } = splitName(userData.name);
    
    const payload = {
      name: userData.name,
      first_name,
      last_name,
      email: userData.email,
      role_id: ROLE_ID_MAP[userData.role] || 3,
      is_active: userData.status === 'Active',
    };

    const response = await apiClient.patch(API_ENDPOINTS.USER_BY_ID(id), payload);

    if (response.data.success) {
      return {
        data: transformUser(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to update user',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update user'),
    };
  }
};

/**
 * Deletes a user
 * @param {string|number} id - User ID
 * @returns {Promise<Object>}
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete user',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete user'),
    };
  }
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
};

export default userService;

