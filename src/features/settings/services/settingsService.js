/**
 * Settings Service
 * Handles all data operations for the settings feature via Backend API
 */

import { apiClient } from '../../../shared/services';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches the current user's profile
 * @returns {Promise<Object>} User profile data
 */
export const fetchProfile = async () => {
  try {
    const response = await apiClient.get('/v1/settings/profile');
    if (response.data.success) {
      const { data } = response.data;
      // Map backend snake_case to frontend camelCase
      return {
        success: true,
        data: {
          ...data,
          firstName: data.first_name,
          lastName: data.last_name,
        }
      };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

/**
 * Updates user profile data
 * @param {string} userId - User ID (unused in API route but kept for signature)
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated user or error
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    // Map frontend camelCase to backend snake_case
    const payload = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
    };

    const response = await apiClient.patch('/v1/settings/profile', payload);
    
    if (response.data.success) {
       const { data } = response.data;
       return {
         success: true,
         data: {
           ...data,
           firstName: data.first_name,
           lastName: data.last_name,
         }
       };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

/**
 * Updates user password
 * @param {Object} passwordData - { current_password, new_password, confirm_new_password }
 * @returns {Promise<Object>} Success status
 */
export const updatePassword = async (passwordData) => {
  try {
    const response = await apiClient.patch('/v1/settings/password', passwordData);
    
    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

/**
 * Creates a full backup of all system data
 * @returns {Promise<Blob>} Backup file blob
 */
export const createBackup = async () => {
  try {
    const response = await apiClient.get('/v1/settings/system/backup', {
      responseType: 'blob',
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

/**
 * Downloads backup blob as file
 * @param {Blob} blob - Backup data blob
 * @param {string} filename - Filename for download
 */
export const downloadBackup = (blob, filename = 'motomedic-backup.json') => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw error;
  }
};

/**
 * Restores data from backup file
 * @param {File} file - Backup file
 * @returns {Promise<Object>} Success status
 */
export const restoreBackup = async (file) => {
  try {
    const formData = new FormData();
    formData.append('backup_file', file);

    const response = await apiClient.post('/v1/settings/system/restore', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const settingsService = {
  fetchProfile,
  updateUserProfile,
  updatePassword,
  createBackup,
  downloadBackup,
  restoreBackup,
};

export default settingsService;

