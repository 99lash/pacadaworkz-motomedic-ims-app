/**
 * Storage Service
 * Abstraction layer for localStorage operations with error handling
 */

const STORAGE_PREFIX = 'motomedic_';

class StorageService {
  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  get(key) {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      return localStorage.getItem(prefixedKey);
    } catch (error) {
      console.error(`Error reading from localStorage [${key}]:`, error);
      return null;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      localStorage.setItem(prefixedKey, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      const prefixedKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage [${key}]:`, error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   * @returns {boolean} Success status
   */
  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get JSON object from localStorage
   * @param {string} key - Storage key
   * @returns {Object|null} Parsed object or null
   */
  getJSON(key) {
    const value = this.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON from localStorage [${key}]:`, error);
      return null;
    }
  }

  /**
   * Set JSON object in localStorage
   * @param {string} key - Storage key
   * @param {Object} value - Object to store
   * @returns {boolean} Success status
   */
  setJSON(key, value) {
    try {
      const jsonString = JSON.stringify(value);
      return this.set(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying JSON for localStorage [${key}]:`, error);
      return false;
    }
  }
}

export const storageService = new StorageService();
export default storageService;

