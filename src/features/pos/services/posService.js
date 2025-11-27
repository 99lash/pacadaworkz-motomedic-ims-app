/**
 * POS Service
 * Handles all data operations for the POS feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

import { STORAGE_KEYS } from '../utils';

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

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all products
 * @returns {Array} Products array
 */
export const fetchProducts = () => {
  return readFromStorage(STORAGE_KEYS.PRODUCTS, []);
};

/**
 * Fetches all categories
 * @returns {Array} Categories array
 */
export const fetchCategories = () => {
  return readFromStorage(STORAGE_KEYS.CATEGORIES, []);
};

/**
 * Fetches all brands
 * @returns {Array} Brands array
 */
export const fetchBrands = () => {
  return readFromStorage(STORAGE_KEYS.BRANDS, []);
};

/**
 * Updates product stock after sale
 * @param {Array} products - Updated products array
 * @returns {boolean} Success status
 */
export const updateProductsStock = (products) => {
  try {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return true;
  } catch (error) {
    console.error('Error updating products stock:', error);
    return false;
  }
};

/**
 * Saves a transaction
 * @param {Object} transaction - Transaction object
 * @returns {boolean} Success status
 */
export const saveTransaction = (transaction) => {
  try {
    const transactions = readFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
    transactions.push(transaction);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    return true;
  } catch (error) {
    console.error('Error saving transaction:', error);
    return false;
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const posService = {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  updateProductsStock,
  saveTransaction,
};

export default posService;

