import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';
import { API_ENDPOINTS } from '../utils';

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches products with pagination and search
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @returns {Promise<Object>} Paginated response
 */
export const fetchProductsPaginated = async ({
  page = 1,
  pageSize = 20,
  search = '',
  categoryId = '',
  brandId = '',
  status = '',
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: pageSize.toString(),
    });

    if (search?.trim()) {
      params.append('search', search.trim());
    }
    if (categoryId) {
      params.append('category_id', categoryId);
    }
    if (brandId) {
      params.append('brand_id', brandId);
    }
    if (status) {
      params.append('status', status);
    }

    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}?${params}`);

    if (response.data.success) {
      const { data, meta } = response.data;

      // Transform backend response to frontend format
      const transformedData = data.map(transformProductFromBackend);

      return {
        success: true,
        data: transformedData,
        pagination: {
          page: meta?.current_page || page,
          pageSize: meta?.per_page || pageSize,
          totalItems: meta?.total || 0,
          totalPages: meta?.last_page || 0,
          hasNextPage: (meta?.current_page || page) < (meta?.last_page || 0),
          hasPrevPage: (meta?.current_page || page) > 1,
        },
      };
    }

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
      error: response.data.message || 'Failed to fetch products',
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
      error: extractErrorMessage(error, 'Failed to fetch products'),
    };
  }
};

/**
 * Fetches all products (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
export const fetchProducts = async () => {
  try {
    // Fetch all products without pagination for dropdowns/validation
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS}?per_page=1000`);

    if (response.data.success) {
      const transformedData = response.data.data.map(transformProductFromBackend);
      return {
        data: transformedData,
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: response.data.message || 'Failed to fetch products',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch products'),
    };
  }
};

/**
 * Fetches a single product by ID
 * @param {string|number} id - Product ID
 * @returns {Promise<Object>}
 */
export const fetchProductById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));

    if (response.data.success) {
      return {
        data: transformProductFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Product not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch product'),
    };
  }
};

/**
 * Creates a new product
 * @param {Object} productData - Product data
 * @param {string} productData.name - Product name
 * @param {string} productData.sku - Product SKU
 * @param {string|number} productData.categoryId - Category ID
 * @param {string|number} productData.brandId - Brand ID
 * @param {number} productData.costPrice - Cost price
 * @param {number} productData.sellingPrice - Selling price
 * @param {number} productData.reorderPoint - Reorder point
 * @param {string} productData.description - Description (optional)
 * @returns {Promise<Object>}
 */
export const createProduct = async (productData) => {
  try {
    const payload = transformProductToBackend(productData);

    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, payload);

    if (response.data.success) {
      return {
        data: transformProductFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to create product',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create product'),
    };
  }
};

/**
 * Updates an existing product
 * @param {string|number} id - Product ID
 * @param {Object} productData - Updated data
 * @returns {Promise<Object>}
 */
export const updateProduct = async (id, productData) => {
  try {
    const payload = transformProductToBackend(productData);

    const response = await apiClient.put(API_ENDPOINTS.PRODUCT_BY_ID(id), payload);

    if (response.data.success) {
      return {
        data: transformProductFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to update product',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update product'),
    };
  }
};

/**
 * Deletes a product
 * @param {string|number} id - Product ID
 * @returns {Promise<Object>}
 */
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete product',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete product'),
    };
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Transforms backend product data to frontend format
 * @param {Object} backendProduct - Product from backend
 * @returns {Object} Transformed product
 */
const transformProductFromBackend = (backendProduct) => ({
  id: backendProduct.id,
  sku: backendProduct.sku,
  name: backendProduct.name,
  categoryName: backendProduct.category,
  brandName: backendProduct.brand,
  costPrice: parseFloat(backendProduct.cost_price) || 0,
  sellingPrice: parseFloat(backendProduct.unit_price) || 0,
  reorderPoint: parseInt(backendProduct.reorder_level) || 0,
  currentStock: parseInt(backendProduct.reorder_level) || 0, // Using reorder_level as currentStock for now
  description: backendProduct.description || '',
  isActive: backendProduct.is_active || true,
  stockStatus: 'in_stock', // TODO: Calculate based on inventory
  createdAt: backendProduct.created_at,
  updatedAt: backendProduct.updated_at,
});

/**
 * Transforms frontend product data to backend format
 * @param {Object} frontendProduct - Product from frontend
 * @returns {Object} Transformed product for API
 */
const transformProductToBackend = (frontendProduct) => ({
  category_id: frontendProduct.categoryId,
  brand_id: frontendProduct.brandId,
  sku: frontendProduct.sku,
  name: frontendProduct.name,
  description: frontendProduct.description || '',
  unit_price: parseFloat(frontendProduct.sellingPrice) || 0,
  cost_price: parseFloat(frontendProduct.costPrice) || 0,
  reorder_level: parseInt(frontendProduct.reorderPoint) || 0,
  // Note: currentStock not sent to backend as it's not implemented yet
});

// =============================================================================
// LEGACY FUNCTIONS (for compatibility)
// =============================================================================

/**
 * @deprecated Use fetchFilterOptions from categoryService and brandService instead
 */
export const fetchFilterOptions = async () => {
  // This would require fetching categories and brands separately
  // For now, return empty to avoid breaking existing code
  return {
    success: true,
    data: {
      categories: [],
      brands: [],
    },
  };
};

/**
 * @deprecated Export functionality not implemented in backend yet
 */
export const exportProductsAsCsv = async () => {
  return {
    success: false,
    error: 'Export functionality not implemented yet',
  };
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

/**
 * Product Service
 * Provides a clean API for product operations with proper error handling
 * and data transformation. All methods return consistent response objects.
 */
const productService = {
  // Data fetching methods
  fetchProducts,
  fetchProductsPaginated,
  fetchProductById,

  // CRUD operations
  createProduct,
  updateProduct,
  deleteProduct,

  // Legacy methods (for compatibility)
  fetchFilterOptions,
  exportProductsAsCsv,

  // Constants
  API_ENDPOINTS,
};

export default productService;
