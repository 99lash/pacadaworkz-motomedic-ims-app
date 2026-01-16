
import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  CATEGORIES: '/v1/categories',
  CATEGORY_BY_ID: (id) => `/v1/categories/${id}`,
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
 * @returns {Promise<Object>} Paginated response
 */
export const fetchCategoriesPaginated = async ({
  page = 1,
  pageSize = 10,
  search = '',
} = {}) => {
  try {
    const BACKEND_PAGE_SIZE = 10; // Backend hardcoded pagination limit
    const pagesToFetch = Math.ceil(pageSize / BACKEND_PAGE_SIZE);
    const requests = [];

    // Calculate the range of backend pages to fetch based on the frontend's current page and desired pageSize
    const startBackendPage = (page - 1) * pagesToFetch + 1;
    const endBackendPage = startBackendPage + pagesToFetch - 1;

    for (let i = startBackendPage; i <= endBackendPage; i++) {
      const params = new URLSearchParams({
        page: i.toString(),
        // Although the backend ignores this, it's good practice to send it
        per_page: BACKEND_PAGE_SIZE.toString(),
      });

      if (search?.trim()) {
        params.append('search', search.trim());
      }
      requests.push(apiClient.get(`${API_ENDPOINTS.CATEGORIES}?${params}`));
    }

    const responses = await Promise.all(requests);

    let combinedData = [];
    let latestBackendMeta = null;

    for (const response of responses) {
      if (response.data.success) {
        combinedData = combinedData.concat(response.data.data || []);
        // Keep the meta from the latest successful backend response for total items
        latestBackendMeta = response.data.meta;
      } else {
        // If any of the requests fail, return an error for the entire operation
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
          error: response.data.message || 'Failed to fetch categories from one or more pages',
        };
      }
    }

    const totalItems = latestBackendMeta?.total || 0;
    // Recalculate totalPages based on the frontend's desired pageSize
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      success: true,
      // Slice the combined data to match the requested pageSize
      data: combinedData.slice(0, pageSize),
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  } catch (error) {
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
      error: extractErrorMessage(error, 'Failed to fetch categories'),
    };
  }
};

/**
 * Fetches all categories (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
export const fetchCategories = async () => {
  try {
    // Fetch all categories without pagination for dropdowns/validation
    const response = await apiClient.get(`${API_ENDPOINTS.CATEGORIES}?per_page=1000`);

    if (response.data.success) {
      return {
        data: response.data.data || [],
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: response.data.message || 'Failed to fetch categories',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch categories'),
    };
  }
};

/**
 * Fetches a single category by ID
 * @param {string|number} id - Category ID
 * @returns {Promise<Object>}
 */
export const fetchCategoryById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORY_BY_ID(id));

    if (response.data.success) {
      return {
        data: response.data.data,
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Category not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch category'),
    };
  }
};

/**
 * Creates a new category
 * @param {Object} categoryData - Category data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.description - Category description (optional)
 * @returns {Promise<Object>}
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CATEGORIES, {
      name: categoryData.name,
      description: categoryData.description || '',
    });

    if (response.data.success) {
      return {
        data: response.data.data,
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to create category',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create category'),
    };
  }
};

/**
 * Updates an existing category
 * @param {string|number} id - Category ID
 * @param {Object} categoryData - Updated data
 * @param {string} categoryData.name - Category name
 * @param {string} categoryData.description - Category description (optional)
 * @returns {Promise<Object>}
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.CATEGORY_BY_ID(id), {
      name: categoryData.name,
      description: categoryData.description || '',
    });

    if (response.data.success) {
      return {
        data: response.data.data,
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to update category',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update category'),
    };
  }
};

/**
 * Deletes a category
 * @param {string|number} id - Category ID
 * @returns {Promise<Object>}
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete category',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete category'),
    };
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

/**
 * Category Service
 * Provides a clean API for category operations with proper error handling
 * and data transformation. All methods return consistent response objects.
 */
const categoryService = {
  // Data fetching methods
  fetchCategories,
  fetchCategoriesPaginated,
  fetchCategoryById,

  // CRUD operations
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
