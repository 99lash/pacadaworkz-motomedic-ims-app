/**
 * Dashboard Service
 * Handles all data operations for the dashboard feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'motomedic_products',
  TRANSACTIONS: 'motomedic_transactions',
  USERS: 'motomedic_users',
  CATEGORIES: 'motomedic_categories',
  ACTIVITY_LOGS: 'motomedic_activity_logs',
};

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
 * Fetches all products
 * @returns {Array} Products array
 */
export const fetchProducts = () => {
  return readFromStorage(STORAGE_KEYS.PRODUCTS, []);
};

/**
 * Fetches all transactions
 * @returns {Array} Transactions array
 */
export const fetchTransactions = () => {
  return readFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
};

/**
 * Fetches all users
 * @returns {Array} Users array
 */
export const fetchUsers = () => {
  return readFromStorage(STORAGE_KEYS.USERS, []);
};

/**
 * Fetches all categories
 * @returns {Array} Categories array
 */
export const fetchCategories = () => {
  return readFromStorage(STORAGE_KEYS.CATEGORIES, []);
};

/**
 * Fetches activity logs
 * @returns {Array} Activity logs array
 */
export const fetchActivityLogs = () => {
  return readFromStorage(STORAGE_KEYS.ACTIVITY_LOGS, []);
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const dashboardService = {
  fetchProducts,
  fetchTransactions,
  fetchUsers,
  fetchCategories,
  fetchActivityLogs,
};

export default dashboardService;

