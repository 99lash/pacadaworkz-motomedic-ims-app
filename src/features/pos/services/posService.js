import { productService } from '../../products/services';
import { categoryService } from '../../categories/services';
import { brandService } from '../../brands/services';
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
 * @returns {Promise<Array>} Products array
 */
export const fetchProducts = async () => {
  const { data, success } = await productService.fetchProducts();
  return success ? data : [];
};

/**
 * Fetches all categories
 * @returns {Promise<Array>} Categories array
 */
export const fetchCategories = async () => {
  const { data, success } = await categoryService.fetchCategories();
  return success ? data : [];
};

/**
 * Fetches all brands
 * @returns {Promise<Array>} Brands array
 */
export const fetchBrands = async () => {
  const { data, success } = await brandService.fetchBrands();
  return success ? data : [];
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

