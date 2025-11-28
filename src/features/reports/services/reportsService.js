/**
 * Reports Service
 * Handles all data operations for the reports feature
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

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all transactions
 * @returns {Array} Transactions array
 */
export const fetchTransactions = () => {
  return readFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
};

/**
 * Fetches all products
 * @returns {Array} Products array
 */
export const fetchProducts = () => {
  return readFromStorage(STORAGE_KEYS.PRODUCTS, []);
};

/**
 * Fetches all purchase orders
 * @returns {Array} Purchase orders array
 */
export const fetchPurchaseOrders = () => {
  return readFromStorage(STORAGE_KEYS.PURCHASE_ORDERS, []);
};

/**
 * Fetches all stock adjustments
 * @returns {Array} Stock adjustments array
 */
export const fetchStockAdjustments = () => {
  return readFromStorage(STORAGE_KEYS.STOCK_ADJUSTMENTS, []);
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

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const reportsService = {
  fetchTransactions,
  fetchProducts,
  fetchPurchaseOrders,
  fetchStockAdjustments,
  fetchCategories,
  fetchBrands,
};

export default reportsService;

