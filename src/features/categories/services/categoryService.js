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
  { id: '1', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 25, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '2', name: 'Clothing', description: 'Apparel and fashion items', productCount: 18, createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: '3', name: 'Books', description: 'Books and educational materials', productCount: 12, createdAt: '2024-01-08', updatedAt: '2024-01-08' },
  { id: '4', name: 'Home & Garden', description: 'Home improvement and gardening supplies', productCount: 8, createdAt: '2024-01-05', updatedAt: '2024-01-05' },
  { id: '5', name: 'Sports', description: 'Sports equipment and outdoor gear', productCount: 15, createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '6', name: 'Automotive', description: 'Car parts and motorcycle accessories', productCount: 42, createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '7', name: 'Tools', description: 'Hand tools and power tools', productCount: 33, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '8', name: 'Lubricants', description: 'Oils, greases, and lubricants', productCount: 28, createdAt: '2023-12-28', updatedAt: '2023-12-28' },
  { id: '9', name: 'Filters', description: 'Air, oil, and fuel filters', productCount: 56, createdAt: '2023-12-25', updatedAt: '2023-12-25' },
  { id: '10', name: 'Brakes', description: 'Brake pads, rotors, and calipers', productCount: 67, createdAt: '2023-12-22', updatedAt: '2023-12-22' },
  { id: '11', name: 'Tires', description: 'Tires and wheels', productCount: 89, createdAt: '2023-12-20', updatedAt: '2023-12-20' },
  { id: '12', name: 'Batteries', description: 'Vehicle batteries and accessories', productCount: 34, createdAt: '2023-12-18', updatedAt: '2023-12-18' },
  { id: '13', name: 'Electrical', description: 'Electrical components and wiring', productCount: 78, createdAt: '2023-12-15', updatedAt: '2023-12-15' },
  { id: '14', name: 'Engine Parts', description: 'Engine components and accessories', productCount: 145, createdAt: '2023-12-12', updatedAt: '2023-12-12' },
  { id: '15', name: 'Suspension', description: 'Shocks, struts, and springs', productCount: 52, createdAt: '2023-12-10', updatedAt: '2023-12-10' },
  { id: '16', name: 'Exhaust', description: 'Exhaust systems and mufflers', productCount: 38, createdAt: '2023-12-08', updatedAt: '2023-12-08' },
  { id: '17', name: 'Cooling System', description: 'Radiators, hoses, and thermostats', productCount: 47, createdAt: '2023-12-05', updatedAt: '2023-12-05' },
  { id: '18', name: 'Fuel System', description: 'Fuel pumps, injectors, and tanks', productCount: 63, createdAt: '2023-12-03', updatedAt: '2023-12-03' },
  { id: '19', name: 'Transmission', description: 'Transmission parts and fluids', productCount: 71, createdAt: '2023-12-01', updatedAt: '2023-12-01' },
  { id: '20', name: 'Body Parts', description: 'Fenders, bumpers, and mirrors', productCount: 94, createdAt: '2023-11-28', updatedAt: '2023-11-28' },
  { id: '21', name: 'Interior', description: 'Seats, carpets, and trim', productCount: 56, createdAt: '2023-11-25', updatedAt: '2023-11-25' },
  { id: '22', name: 'Lighting', description: 'Headlights, taillights, and bulbs', productCount: 82, createdAt: '2023-11-22', updatedAt: '2023-11-22' },
  { id: '23', name: 'Safety', description: 'Safety equipment and accessories', productCount: 29, createdAt: '2023-11-20', updatedAt: '2023-11-20' },
  { id: '24', name: 'Audio', description: 'Car audio and entertainment', productCount: 45, createdAt: '2023-11-18', updatedAt: '2023-11-18' },
  { id: '25', name: 'Accessories', description: 'General vehicle accessories', productCount: 112, createdAt: '2023-11-15', updatedAt: '2023-11-15' },
];

// Simulates network delay (reduced for better UX, set to 0 for instant)
const simulateNetworkDelay = (ms = 200) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generates unique ID (replace with server-generated ID)
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Filters categories by search term
 * @param {Array} categories - Categories array
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered categories
 */
const filterCategories = (categories, searchTerm) => {
  if (!searchTerm?.trim()) return categories;
  
  const search = searchTerm.toLowerCase();
  return categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search) ||
      cat.description.toLowerCase().includes(search)
  );
};

/**
 * Paginates an array
 * @param {Array} items - Items array
 * @param {number} page - Current page (1-based)
 * @param {number} pageSize - Items per page
 * @returns {Array} Paginated items
 */
const paginateArray = (items, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches categories with pagination and search
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @param {string} params.sortBy - Sort field (optional)
 * @param {string} params.sortOrder - Sort order: 'asc' | 'desc' (optional)
 * @returns {Promise<Object>} Paginated response
 * 
 * TODO: Replace with actual API call
 * Example: return axios.get(API_ENDPOINTS.CATEGORIES, { params });
 */
export const fetchCategoriesPaginated = async ({
  page = 1,
  pageSize = 20,
  search = '',
  sortBy = 'name',
  sortOrder = 'asc',
} = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(API_ENDPOINTS.CATEGORIES, {
    //   params: { page, pageSize, search, sortBy, sortOrder }
    // });
    // return response.data;

    await simulateNetworkDelay();

    // Filter by search term
    let filtered = filterCategories(mockCategories, search);

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy] || '';
      const bVal = b[sortBy] || '';
      const comparison = aVal.localeCompare(bVal);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Get total before pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    // Paginate
    const data = paginateArray(filtered, page, pageSize);

    return {
      success: true,
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error: error.message || 'Failed to fetch categories',
    };
  }
};

/**
 * Fetches all categories (for backward compatibility)
 * @deprecated Use fetchCategoriesPaginated for large datasets
 */
export const fetchCategories = async () => {
  try {
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
 * @returns {Promise<Object>}
 */
export const fetchCategoryById = async (id) => {
  try {
    await simulateNetworkDelay(100);

    const category = mockCategories.find((cat) => cat.id === id);

    if (!category) {
      return { data: null, success: false, error: 'Category not found' };
    }

    return { data: { ...category }, success: true };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { data: null, success: false, error: error.message || 'Failed to fetch category' };
  }
};

/**
 * Creates a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>}
 */
export const createCategory = async (categoryData) => {
  try {
    await simulateNetworkDelay();

    const newCategory = {
      id: generateId(),
      name: categoryData.name,
      description: categoryData.description || '',
      productCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    mockCategories = [newCategory, ...mockCategories]; // Add to beginning

    return { data: { ...newCategory }, success: true };
  } catch (error) {
    console.error('Error creating category:', error);
    return { data: null, success: false, error: error.message || 'Failed to create category' };
  }
};

/**
 * Updates an existing category
 * @param {string} id - Category ID
 * @param {Object} categoryData - Updated data
 * @returns {Promise<Object>}
 */
export const updateCategory = async (id, categoryData) => {
  try {
    await simulateNetworkDelay();

    const index = mockCategories.findIndex((cat) => cat.id === id);

    if (index === -1) {
      return { data: null, success: false, error: 'Category not found' };
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

    return { data: { ...updatedCategory }, success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { data: null, success: false, error: error.message || 'Failed to update category' };
  }
};

/**
 * Deletes a category
 * @param {string} id - Category ID
 * @returns {Promise<Object>}
 */
export const deleteCategory = async (id) => {
  try {
    await simulateNetworkDelay();

    const category = mockCategories.find((cat) => cat.id === id);

    if (!category) {
      return { success: false, error: 'Category not found' };
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
    return { success: false, error: error.message || 'Failed to delete category' };
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const categoryService = {
  fetchCategories,
  fetchCategoriesPaginated,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
