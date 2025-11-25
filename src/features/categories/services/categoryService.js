/**
 * Category Service
 * Handles all API communications for the categories feature
 * 
 * This service is designed to be easily swapped from mock data to real API calls.
 * Replace the mock implementations with actual API calls when backend is ready.
 */

import { API_ENDPOINTS } from '../utils/constants';

// =============================================================================
// MOCK DATA (Remove when integrating with real API)
// =============================================================================
let mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 25,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Clothing',
    description: 'Apparel and fashion items',
    productCount: 18,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Books',
    description: 'Books and educational materials',
    productCount: 12,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
  },
  {
    id: '4',
    name: 'Home & Garden',
    description: 'Home improvement and gardening supplies',
    productCount: 8,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    id: '5',
    name: 'Sports',
    description: 'Sports equipment and outdoor gear',
    productCount: 15,
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

// Simulates network delay for realistic UX testing
const simulateNetworkDelay = (ms = 500) => 
  new Promise((resolve) => setTimeout(resolve, ms));

// Generates unique ID (replace with server-generated ID)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches all categories from the server
 * @returns {Promise<{ data: Array, success: boolean, error?: string }>}
 * 
 * TODO: Replace with actual API call
 * Example: return axios.get(API_ENDPOINTS.CATEGORIES);
 */
export const fetchCategories = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(API_ENDPOINTS.CATEGORIES);
    // return { data: response.data, success: true };
    
    await simulateNetworkDelay();
    
    return {
      data: [...mockCategories],
      success: true,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      data: [],
      success: false,
      error: error.message || 'Failed to fetch categories',
    };
  }
};

/**
 * Fetches a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<{ data: Object|null, success: boolean, error?: string }>}
 * 
 * TODO: Replace with actual API call
 * Example: return axios.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
 */
export const fetchCategoryById = async (id) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(API_ENDPOINTS.CATEGORY_BY_ID(id));
    // return { data: response.data, success: true };
    
    await simulateNetworkDelay(300);
    
    const category = mockCategories.find((cat) => cat.id === id);
    
    if (!category) {
      return {
        data: null,
        success: false,
        error: 'Category not found',
      };
    }
    
    return {
      data: { ...category },
      success: true,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to fetch category',
    };
  }
};

/**
 * Creates a new category
 * @param {Object} categoryData - Category data to create
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.description - Category description
 * @returns {Promise<{ data: Object|null, success: boolean, error?: string }>}
 * 
 * TODO: Replace with actual API call
 * Example: return axios.post(API_ENDPOINTS.CATEGORIES, categoryData);
 */
export const createCategory = async (categoryData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.post(API_ENDPOINTS.CATEGORIES, categoryData);
    // return { data: response.data, success: true };
    
    await simulateNetworkDelay();
    
    const newCategory = {
      id: generateId(),
      name: categoryData.name,
      description: categoryData.description || '',
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    mockCategories = [...mockCategories, newCategory];
    
    return {
      data: { ...newCategory },
      success: true,
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to create category',
    };
  }
};

/**
 * Updates an existing category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<{ data: Object|null, success: boolean, error?: string }>}
 * 
 * TODO: Replace with actual API call
 * Example: return axios.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
 */
export const updateCategory = async (id, categoryData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.put(API_ENDPOINTS.CATEGORY_BY_ID(id), categoryData);
    // return { data: response.data, success: true };
    
    await simulateNetworkDelay();
    
    const index = mockCategories.findIndex((cat) => cat.id === id);
    
    if (index === -1) {
      return {
        data: null,
        success: false,
        error: 'Category not found',
      };
    }
    
    const updatedCategory = {
      ...mockCategories[index],
      name: categoryData.name,
      description: categoryData.description || '',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    
    mockCategories = [
      ...mockCategories.slice(0, index),
      updatedCategory,
      ...mockCategories.slice(index + 1),
    ];
    
    return {
      data: { ...updatedCategory },
      success: true,
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      data: null,
      success: false,
      error: error.message || 'Failed to update category',
    };
  }
};

/**
 * Deletes a category
 * @param {string} id - Category ID
 * @returns {Promise<{ success: boolean, error?: string }>}
 * 
 * TODO: Replace with actual API call
 * Example: return axios.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
 */
export const deleteCategory = async (id) => {
  try {
    // TODO: Replace with actual API call
    // await axios.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
    // return { success: true };
    
    await simulateNetworkDelay();
    
    const category = mockCategories.find((cat) => cat.id === id);
    
    if (!category) {
      return {
        success: false,
        error: 'Category not found',
      };
    }
    
    // Business rule: Cannot delete category with products
    if (category.productCount > 0) {
      return {
        success: false,
        error: 'Cannot delete category with products. Please reassign products first.',
      };
    }
    
    mockCategories = mockCategories.filter((cat) => cat.id !== id);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete category',
    };
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================
const categoryService = {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;

