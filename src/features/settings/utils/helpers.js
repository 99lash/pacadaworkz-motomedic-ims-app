/**
 * Settings Helper Functions
 * Utility functions for settings operations
 */

import { STORAGE_KEYS, BACKUP_DATA_KEYS } from './constants';

/**
 * Reads data from localStorage
 * @param {string} key - Storage key
 * @param {*} fallback - Default value if key doesn't exist
 * @returns {*} Parsed data or fallback
 */
export const readFromStorage = (key, fallback = null) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return fallback;
  }
};

/**
 * Saves data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
  }
};

/**
 * Calculates total records across all data keys
 * @returns {number} Total number of records
 */
export const calculateTotalRecords = () => {
  let total = 0;
  BACKUP_DATA_KEYS.forEach((key) => {
    const data = readFromStorage(key, []);
    if (Array.isArray(data)) {
      total += data.length;
    }
  });
  return total;
};

/**
 * Calculates storage used by motomedic keys
 * @returns {string} Formatted storage size (e.g., "123.45 KB")
 */
export const calculateStorageUsed = () => {
  if (typeof window === 'undefined') return '0 KB';
  
  let totalSize = 0;
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith('motomedic_')) {
      totalSize += (window.localStorage.getItem(key) || '').length;
    }
  }
  return `${(totalSize / 1024).toFixed(2)} KB`;
};

/**
 * Gets last backup timestamp
 * @returns {string} Last backup timestamp or 'Never'
 */
export const getLastBackup = () => {
  return readFromStorage(STORAGE_KEYS.LAST_BACKUP) || 'Never';
};

/**
 * Validates profile form data
 * @param {Object} profileData - Profile data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateProfileForm = (profileData) => {
  const errors = {};
  
  if (!profileData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }
  
  if (!profileData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }
  
  if (!profileData.username?.trim()) {
    errors.username = 'Username is required';
  }
  
  if (!profileData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    errors.email = 'Invalid email format';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

