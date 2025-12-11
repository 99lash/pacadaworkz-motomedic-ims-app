/**
 * Inventory Service
 * Handles all data operations for the inventory feature
 *
 * This service integrates with the backend API endpoints.
 */

import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  INVENTORY: '/v1/inventory',
  INVENTORY_BY_ID: (id) => `/v1/inventory/${id}`,
};

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches inventory items with pagination and search
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @returns {Promise<Object>} Paginated response
 */
export const fetchInventory = async ({
  page = 1,
  pageSize = 20,
  search = '',
} = {}) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: pageSize.toString(),
    });

    if (search?.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY}?${params}`);

    if (response.data.success) {
      const { data, meta } = response.data;

      // Transform backend response to frontend format
      const transformedData = data.map(transformInventoryFromBackend);

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
      error: response.data.message || 'Failed to fetch inventory',
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
      error: extractErrorMessage(error, 'Failed to fetch inventory'),
    };
  }
};

/**
 * Fetches all inventory items (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
export const fetchAllInventory = async () => {
  try {
    // Fetch all inventory without pagination for dropdowns/validation
    const response = await apiClient.get(`${API_ENDPOINTS.INVENTORY}?per_page=1000`);

    if (response.data.success) {
      const transformedData = response.data.data.map(transformInventoryFromBackend);
      return {
        data: transformedData,
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: response.data.message || 'Failed to fetch inventory',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch inventory'),
    };
  }
};

/**
 * Fetches a single inventory item by ID
 * @param {string|number} id - Inventory item ID
 * @returns {Promise<Object>}
 */
export const fetchInventoryById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.INVENTORY_BY_ID(id));

    if (response.data.success) {
      return {
        data: transformInventoryFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Inventory item not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch inventory item'),
    };
  }
};

/**
 * Creates a new inventory item
 * @param {Object} inventoryData - Inventory data
 * @param {number} inventoryData.product_id - Product ID
 * @param {number} inventoryData.supplier_id - Supplier ID
 * @param {number} inventoryData.quantity - Quantity
 * @param {string} inventoryData.last_stock_in - Last stock in date (optional)
 * @returns {Promise<Object>}
 */
export const createInventory = async (inventoryData) => {
  try {
    const payload = transformInventoryToBackend(inventoryData);

    const response = await apiClient.post(API_ENDPOINTS.INVENTORY, payload);

    if (response.data.success) {
      return {
        data: transformInventoryFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to create inventory item',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create inventory item'),
    };
  }
};

/**
 * Updates an existing inventory item
 * @param {string|number} id - Inventory item ID
 * @param {Object} inventoryData - Updated data
 * @returns {Promise<Object>}
 */
export const updateInventory = async (id, inventoryData) => {
  try {
    const payload = transformInventoryToBackend(inventoryData);

    const response = await apiClient.patch(API_ENDPOINTS.INVENTORY_BY_ID(id), payload);

    if (response.data.success) {
      return {
        data: transformInventoryFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to update inventory item',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update inventory item'),
    };
  }
};

/**
 * Deletes an inventory item
 * @param {string|number} id - Inventory item ID
 * @returns {Promise<Object>}
 */
export const deleteInventory = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.INVENTORY_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete inventory item',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete inventory item'),
    };
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Transforms backend inventory data to frontend format
 * @param {Object} backendInventory - Inventory from backend
 * @returns {Object} Transformed inventory
 */
const transformInventoryFromBackend = (backendInventory) => ({
  id: backendInventory.id,
  productId: backendInventory.product_id,
  supplierId: backendInventory.supplier_id,
  sku: backendInventory.sku,
  productName: backendInventory.product_name,
  category: backendInventory.category,
  brand: backendInventory.brand,
  quantity: parseInt(backendInventory.quantity) || 0,
  lastStockIn: backendInventory.last_stock_in,
  // Note: Additional fields like minStock, maxStock, location, status
  // are not provided by backend and would need to be added separately
});

/**
 * Transforms frontend inventory data to backend format
 * @param {Object} frontendInventory - Inventory from frontend
 * @returns {Object} Transformed inventory for API
 */
const transformInventoryToBackend = (frontendInventory) => ({
  product_id: frontendInventory.productId,
  supplier_id: frontendInventory.supplierId,
  quantity: parseInt(frontendInventory.quantity) || 0,
  last_stock_in: frontendInventory.lastStockIn || null,
});

// =============================================================================
// SERVICE EXPORT
// =============================================================================

/**
 * Inventory Service
 * Provides a clean API for inventory operations with proper error handling
 * and data transformation. All methods return consistent response objects.
 */
const inventoryService = {
  // Data fetching methods
  fetchInventory,
  fetchAllInventory,
  fetchInventoryById,

  // CRUD operations
  createInventory,
  updateInventory,
  deleteInventory,

  // Constants
  API_ENDPOINTS,
};

export default inventoryService;

