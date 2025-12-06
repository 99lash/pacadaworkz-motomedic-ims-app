import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  USERS: '/v1/users',
  USER_BY_ID: (id) => `/v1/users/${id}`,
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
      return {
        data: response.data.data || [],
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
        data: response.data.data,
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
    const response = await apiClient.post(API_ENDPOINTS.USERS, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'User',
    });

    if (response.data.success) {
      return {
        data: response.data.data,
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
    const response = await apiClient.patch(API_ENDPOINTS.USER_BY_ID(id), {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    if (response.data.success) {
      return {
        data: response.data.data,
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

