import { productService } from '../../products/services';
import { categoryService } from '../../categories/services';
import { brandService } from '../../brands/services';
import { STORAGE_KEYS } from '../utils';

// =============================================================================
// CACHE
// =============================================================================

const cache = {
  products: null,
  categories: null,
  brands: null,
  last_update: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
 * Invalidates the cache
 */
export const invalidateCache = () => {
  cache.products = null;
  cache.categories = null;
  cache.brands = null;
  cache.last_update = null;
};

/**
 * Fetches all products, using cache if available
 * @returns {Promise<Array>} Products array
 */
export const fetchProducts = async () => {
  const now = Date.now();
  if (cache.products && cache.last_update && now - cache.last_update < CACHE_DURATION) {
    return cache.products;
  }

  const { data, success } = await productService.fetchProducts();
  if (success) {
    cache.products = data;
    cache.last_update = now;
    return data;
  }
  return [];
};

/**
 * Fetches all categories, using cache if available
 * @returns {Promise<Array>} Categories array
 */
export const fetchCategories = async () => {
  const now = Date.now();
  if (cache.categories && cache.last_update && now - cache.last_update < CACHE_DURATION) {
    return cache.categories;
  }

  const { data, success } = await categoryService.fetchCategories();
  if (success) {
    cache.categories = data;
    cache.last_update = now;
    return data;
  }
  return [];
};

/**
 * Fetches all brands, using cache if available
 * @returns {Promise<Array>} Brands array
 */
export const fetchBrands = async () => {
  const now = Date.now();
  if (cache.brands && cache.last_update && now - cache.last_update < CACHE_DURATION) {
    return cache.brands;
  }

  const { data, success } = await brandService.fetchBrands();
  if (success) {
    cache.brands = data;
    cache.last_update = now;
    return data;
  }
  return [];
};

/**
 * Updates product stock after sale
 * @param {Array} products - Updated products array
 * @returns {Promise<boolean>} Success status
 */
export const updateProductsStock = async (products) => {
  try {
    const updatePromises = products.map(product => 
      productService.updateProduct(product.id, { current_stock: product.currentStock })
    );
    await Promise.all(updatePromises);
    invalidateCache(); // Invalidate cache after stock update
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
  invalidateCache,
};

export default posService;