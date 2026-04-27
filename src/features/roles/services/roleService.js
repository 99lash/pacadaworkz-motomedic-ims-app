import apiClient from '../../../shared/services/apiClient';

/**
 * Role Service
 * Handles all API calls for role and permission management
 */

const roleService = {
  /**
   * Fetches all roles from the API
   * @returns {Promise<Array>} List of roles with their permissions
   */
  getRoles: async () => {
    const response = await apiClient.get('/v1/roles/');
    return response.data.data;
  },

  /**
   * Fetches a single role by ID
   * @param {number|string} id Role ID
   * @returns {Promise<Object>} Role details
   */
  getRoleById: async (id) => {
    const response = await apiClient.get(`/v1/roles/${id}`);
    return response.data.data;
  },

  /**
   * Creates a new role
   * @param {Object} data Role data { role_name, description }
   * @returns {Promise<Object>} Created role
   */
  createRole: async (data) => {
    const response = await apiClient.post('/v1/roles/', {
      role_name: data.name, // Mapping UI 'name' to API 'role_name'
      description: data.description,
    });
    return response.data.data;
  },

  /**
   * Updates an existing role
   * @param {number|string} id Role ID
   * @param {Object} data Role data { name, description }
   * @returns {Promise<Object>} Updated role
   */
  updateRole: async (id, data) => {
    const response = await apiClient.put(`/v1/roles/${id}`, {
      role_name: data.name, // Mapping UI 'name' to API 'role_name'
      description: data.description,
    });
    return response.data.data;
  },

  /**
   * Deletes a role
   * @param {number|string} id Role ID
   * @returns {Promise<Object>} Success message
   */
  deleteRole: async (id) => {
    const response = await apiClient.delete(`/v1/roles/${id}`);
    return response.data.data;
  },

  /**
   * Fetches all available permissions
   * @returns {Promise<Array>} List of all permissions
   */
  getPermissions: async () => {
    const response = await apiClient.get('/v1/permissions/');
    return response.data.data;
  },

  /**
   * Syncs permissions for a role
   * @param {number|string} id Role ID
   * @param {Array<number>} permissionIds Array of permission IDs
   * @returns {Promise<Object>} Updated role with permissions
   */
  syncPermissions: async (id, permissionIds) => {
    const response = await apiClient.post(`/v1/roles/${id}/permissions`, {
      permissions: permissionIds,
    });
    return response.data.data;
  },
};

export default roleService;
