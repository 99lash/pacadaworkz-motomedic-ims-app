import axios from 'axios';
import apiClient from '../../../shared/services/apiClient';
import storageService from '../../../shared/services/storageService';
import { STORAGE_KEYS } from '../../../shared/config/storage';
import { API_CONFIG } from '../../../shared/config/api';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Auth Service
 * Handles all authentication-related API calls
 * Separated concerns: API calls only, storage handled by storageService
 */
export const authService = {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response with tokens and user data
   */
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response with tokens and user data
   */
  async login(email, password) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.data.success) {
        const { access_token, refresh_token } = response.data.data;
        
        // Store tokens using storage service
        storageService.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
        if (refresh_token) {
          storageService.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
        }

        // Fetch user data
        try {
          const userResponse = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
          const userData = userResponse.data.success ? userResponse.data.data : null;
          
          if (userData) {
            storageService.setJSON(STORAGE_KEYS.USER, userData);
          }
          
          return {
            success: true,
            data: {
              tokens: {
                access_token,
                refresh_token,
              },
              user: userData,
            },
          };
        } 
        // eslint-disable-next-line no-unused-vars
        catch (_userError) {
          // If getting user fails, still return success with tokens
          // The user can be fetched later using getCurrentUser()
          return {
            success: true,
            data: {
              tokens: {
                access_token,
                refresh_token,
              },
              user: null,
            },
          };
        }
      }

      return {
        success: false,
        message: response.data.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'Login failed'),
      };
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Response indicating success/failure
   */
  /**
   * Logout user
   * @returns {Promise<Object>} Response indicating success/failure
   */
  async logout() {
    try {
      // Use direct axios call without Authorization header for logout
      await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
    } 
    // eslint-disable-next-line no-unused-vars
    catch (error) {
      // Continue with logout even if API call fails
    } finally {
      // Always clear local storage
      this.clearAuthData();
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  },

  /**
   * Clear all authentication data from storage
   */
  clearAuthData() {
    storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storageService.remove(STORAGE_KEYS.USER);
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User data
   */
  /**
   * Get current authenticated user
   * @returns {Promise<Object>} User data
   */
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      
      if (response.data.success) {
        const userData = response.data.data;
        // Store user data using storage service
        storageService.setJSON(STORAGE_KEYS.USER, userData);
        
        return {
          success: true,
          data: userData,
        };
      }

      return {
        success: false,
        message: response.data.message || 'Failed to get user data',
      };
    } catch (error) {
      return {
        success: false,
        message: extractErrorMessage(error, 'Failed to get user data'),
      };
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>} New tokens
   */
  /**
   * Refresh access token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken() {
    try {
      const refreshToken = storageService.get(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {}, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      // The API returns access_token in response.data.data (wrapped in resource)
      if (response.data.success && response.data.data) {
        const newAccessToken = response.data.data.access_token;
        
        if (newAccessToken) {
          storageService.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
          // Refresh token typically doesn't change, but update if provided
          const newRefreshToken = response.data.data.refresh_token;
          if (newRefreshToken) {
            storageService.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }

          return {
            success: true,
            data: {
              access_token: newAccessToken,
              refresh_token: newRefreshToken || refreshToken,
            },
          };
        }
      }

      return {
        success: false,
        message: response.data.message || 'Token refresh failed',
      };
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearAuthData();
      
      return {
        success: false,
        message: extractErrorMessage(error, 'Token refresh failed'),
      };
    }
  },

  /**
   * Get stored access token
   * @returns {string|null} Access token or null
   */
  getAccessToken() {
    return storageService.get(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * Get stored refresh token
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken() {
    return storageService.get(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data or null
   */
  getStoredUser() {
    return storageService.getJSON(STORAGE_KEYS.USER);
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean} True if authenticated
   */
  isAuthenticated() {
    return !!storageService.get(STORAGE_KEYS.ACCESS_TOKEN);
  },
};

export default authService;

