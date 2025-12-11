/**
 * Supplier Service
 * Handles all data operations for the suppliers feature
 *
 * This service integrates with the backend API endpoints.
 */

import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  SUPPLIERS: '/v1/suppliers',
  SUPPLIER_BY_ID: (id) => `/v1/suppliers/${id}`,
};

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches suppliers with pagination and search
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @returns {Promise<Object>} Paginated response
 */
export const fetchSuppliers = async ({
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

    const response = await apiClient.get(`${API_ENDPOINTS.SUPPLIERS}?${params}`);

    if (response.data.success) {
      const { data, meta } = response.data;

      // Transform backend response to frontend format
      const transformedData = data.map(transformSupplierFromBackend);

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
      error: response.data.message || 'Failed to fetch suppliers',
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
      error: extractErrorMessage(error, 'Failed to fetch suppliers'),
    };
  }
};

/**
 * Fetches all suppliers (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
export const fetchAllSuppliers = async () => {
  try {
    // Fetch all suppliers without pagination for dropdowns/validation
    const response = await apiClient.get(`${API_ENDPOINTS.SUPPLIERS}?per_page=1000`);

    if (response.data.success) {
      const transformedData = response.data.data.map(transformSupplierFromBackend);
      return {
        data: transformedData,
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: response.data.message || 'Failed to fetch suppliers',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch suppliers'),
    };
  }
};

/**
 * Fetches a single supplier by ID
 * @param {string|number} id - Supplier ID
 * @returns {Promise<Object>}
 */
export const fetchSupplierById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SUPPLIER_BY_ID(id));

    if (response.data.success) {
      return {
        data: transformSupplierFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Supplier not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch supplier'),
    };
  }
};

/**
 * Creates a new supplier
 * @param {Object} supplierData - Supplier data
 * @param {string} supplierData.companyName - Company name
 * @param {string} supplierData.contactPerson - Contact person
 * @param {string} supplierData.email - Email address
 * @param {string} supplierData.phone - Phone number
 * @param {string} supplierData.address - Address
 * @returns {Promise<Object>}
 */
export const createSupplier = async (supplierData) => {
  try {
    const payload = transformSupplierToBackend(supplierData);

    const response = await apiClient.post(API_ENDPOINTS.SUPPLIERS, payload);

    if (response.data.success) {
      return {
        data: transformSupplierFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to create supplier',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create supplier'),
    };
  }
};

/**
 * Updates an existing supplier
 * @param {string|number} id - Supplier ID
 * @param {Object} supplierData - Updated data
 * @returns {Promise<Object>}
 */
export const updateSupplier = async (id, supplierData) => {
  try {
    const payload = transformSupplierToBackend(supplierData);

    const response = await apiClient.patch(API_ENDPOINTS.SUPPLIER_BY_ID(id), payload);

    if (response.data.success) {
      return {
        data: transformSupplierFromBackend(response.data.data),
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Failed to update supplier',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update supplier'),
    };
  }
};

/**
 * Deletes a supplier
 * @param {string|number} id - Supplier ID
 * @returns {Promise<Object>}
 */
export const deleteSupplier = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.SUPPLIER_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete supplier',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete supplier'),
    };
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Transforms backend supplier data to frontend format
 * @param {Object} backendSupplier - Supplier from backend
 * @returns {Object} Transformed supplier
 */
const transformSupplierFromBackend = (backendSupplier) => ({
  id: backendSupplier.id,
  companyName: backendSupplier.name,
  contactPerson: backendSupplier.contact_person || '',
  email: backendSupplier.email || '',
  phone: backendSupplier.phone || '',
  address: backendSupplier.address || '',
  // Note: payment_terms not provided by backend
  createdAt: backendSupplier.created_at,
  updatedAt: backendSupplier.updated_at,
});

/**
 * Transforms frontend supplier data to backend format
 * @param {Object} frontendSupplier - Supplier from frontend
 * @returns {Object} Transformed supplier for API
 */
const transformSupplierToBackend = (frontendSupplier) => ({
  name: frontendSupplier.companyName?.trim() || '',
  contact_person: frontendSupplier.contactPerson?.trim() || '',
  email: frontendSupplier.email?.trim() || '',
  phone: frontendSupplier.phone?.trim() || '',
  address: frontendSupplier.address?.trim() || '',
  // Note: payment_terms not sent to backend as it's not implemented
});

// =============================================================================
// SERVICE EXPORT
// =============================================================================

/**
 * Supplier Service
 * Provides a clean API for supplier operations with proper error handling
 * and data transformation. All methods return consistent response objects.
 */
const supplierService = {
  // Data fetching methods
  fetchSuppliers,
  fetchAllSuppliers,
  fetchSupplierById,

  // CRUD operations
  createSupplier,
  updateSupplier,
  deleteSupplier,

  // Constants
  API_ENDPOINTS,
};

export default supplierService;

