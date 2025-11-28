/**
 * Settings Service
 * Handles all data operations for the settings feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

import { STORAGE_KEYS, BACKUP_DATA_KEYS } from '../utils';
import { readFromStorage, saveToStorage } from '../utils/helpers';

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Updates user profile data
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Object|null} Updated user or null
 */
export const updateUserProfile = (userId, profileData) => {
  try {
    const users = readFromStorage(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex((u) => u.id === userId);
    
    if (userIndex === -1) {
      return null;
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...profileData,
    };
    
    const updatedUsers = [
      ...users.slice(0, userIndex),
      updatedUser,
      ...users.slice(userIndex + 1),
    ];
    
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    
    // Update current user in session
    const currentUser = readFromStorage(STORAGE_KEYS.CURRENT_USER);
    if (currentUser && currentUser.id === userId) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

/**
 * Creates a full backup of all system data
 * @returns {Object} Backup data object
 */
export const createBackup = () => {
  try {
    const backup = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {},
    };
    
    BACKUP_DATA_KEYS.forEach((key) => {
      backup.data[key] = readFromStorage(key, []);
    });
    
    // Save backup timestamp
    saveToStorage(STORAGE_KEYS.LAST_BACKUP, new Date().toLocaleString());
    
    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

/**
 * Downloads backup as JSON file
 * @param {Object} backup - Backup data object
 * @param {string} filename - Filename for download
 */
export const downloadBackup = (backup, filename = 'motomedic-backup.json') => {
  try {
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw error;
  }
};

/**
 * Validates backup file structure
 * @param {Object} backup - Backup data to validate
 * @returns {Object} Validation result
 */
export const validateBackup = (backup) => {
  if (!backup || typeof backup !== 'object') {
    return { isValid: false, error: 'Invalid backup file format' };
  }
  
  if (!backup.data || typeof backup.data !== 'object') {
    return { isValid: false, error: 'Backup file missing data section' };
  }
  
  return { isValid: true };
};

/**
 * Restores data from backup
 * @param {Object} backup - Backup data object
 * @returns {boolean} Success status
 */
export const restoreBackup = (backup) => {
  try {
    const validation = validateBackup(backup);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    Object.keys(backup.data).forEach((key) => {
      if (key.startsWith('motomedic_')) {
        saveToStorage(key, backup.data[key]);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error restoring backup:', error);
    return false;
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const settingsService = {
  updateUserProfile,
  createBackup,
  downloadBackup,
  validateBackup,
  restoreBackup,
};

export default settingsService;

