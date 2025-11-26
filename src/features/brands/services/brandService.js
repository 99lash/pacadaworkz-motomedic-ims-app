/**
 * Brand Service
 * Handles all data operations for the brands feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const BRAND_STORAGE_KEY = 'motomedic_brands';

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

const generateBrandId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : `brand_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all brands
 * @returns {Array} Brands array
 */
export const fetchBrands = () => {
  return readFromStorage(BRAND_STORAGE_KEY, []);
};

/**
 * Fetches a single brand by ID
 * @param {string} id - Brand ID
 * @returns {Object|null} Brand object or null
 */
export const fetchBrandById = (id) => {
  const brands = fetchBrands();
  return brands.find(brand => brand.id === id) || null;
};

/**
 * Creates a new brand
 * @param {Object} brandData - Brand data
 * @returns {Object} Created brand
 */
export const createBrand = (brandData) => {
  const brands = fetchBrands();
  const newBrand = {
    id: generateBrandId(),
    name: brandData.name?.trim() || '',
    description: brandData.description?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedBrands = [...brands, newBrand];
  saveToStorage(BRAND_STORAGE_KEY, updatedBrands);
  return newBrand;
};

/**
 * Updates an existing brand
 * @param {string} id - Brand ID
 * @param {Object} brandData - Updated brand data
 * @returns {Object|null} Updated brand or null
 */
export const updateBrand = (id, brandData) => {
  const brands = fetchBrands();
  const index = brands.findIndex(brand => brand.id === id);
  
  if (index === -1) return null;
  
  const updatedBrand = {
    ...brands[index],
    name: brandData.name?.trim() || '',
    description: brandData.description?.trim() || '',
    updatedAt: new Date().toISOString(),
  };
  
  const updatedBrands = [
    ...brands.slice(0, index),
    updatedBrand,
    ...brands.slice(index + 1),
  ];
  
  saveToStorage(BRAND_STORAGE_KEY, updatedBrands);
  return updatedBrand;
};

/**
 * Deletes a brand
 * @param {string} id - Brand ID
 * @returns {boolean} Success status
 */
export const deleteBrand = (id) => {
  const brands = fetchBrands();
  const filteredBrands = brands.filter(brand => brand.id !== id);
  
  if (filteredBrands.length === brands.length) {
    return false; // Brand not found
  }
  
  saveToStorage(BRAND_STORAGE_KEY, filteredBrands);
  return true;
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const brandService = {
  fetchBrands,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;

