import apiClient from '../../../shared/services/apiClient';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

// =============================================================================
// API ENDPOINTS CONFIGURATION
// =============================================================================

const API_ENDPOINTS = {
  BRANDS: '/v1/brands',
  BRAND_BY_ID: (id) => `/v1/brands/${id}`,
};

// =============================================================================
// API SERVICE METHODS
// =============================================================================

/**
 * Fetches all brands (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
const fetchAllPages = async (url, allData = []) => {
  const response = await apiClient.get(url);
  const { data, links, meta } = response.data;

  const combinedData = allData.concat(data);

  if (links?.next) {
    // If there is a next page, recursively call fetchAllPages
    return fetchAllPages(links.next, combinedData);
  }

  return {
    data: combinedData,
    success: true,
    pagination: meta,
  };
};

/**
 * Fetches all brands (for dropdowns and validation)
 * @returns {Promise<Object>}
 */
export const fetchBrands = async () => {
  try {
    const initialUrl = `${API_ENDPOINTS.BRANDS}`;
    const { data, success } = await fetchAllPages(initialUrl);

    if (success) {
      return {
        data: data || [],
        success: true,
      };
    }

    return {
      data: [],
      success: false,
      error: 'Failed to fetch brands',
    };
  } catch (error) {
    return {
      data: [],
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch brands'),
    };
  }
};

/**
 * Fetches brands with pagination and search
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @returns {Promise<Object>} Paginated response
 */
export const fetchBrandsPaginated = async ({
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

    const response = await apiClient.get(`${API_ENDPOINTS.BRANDS}?${params}`);

    const { data, meta } = response.data;

    return {
      success: true,
      data: data || [],
      pagination: {
        page: meta?.current_page || page,
        pageSize: meta?.per_page || pageSize,
        totalItems: meta?.total || 0,
        totalPages: meta?.last_page || 0,
        hasNextPage: (meta?.current_page || page) < (meta?.last_page || 0),
        hasPrevPage: (meta?.current_page || page) > 1,
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
      error: extractErrorMessage(error, 'Failed to fetch brands'),
    };
  }
};

/**
 * Fetches a single brand by ID
 * @param {string|number} id - Brand ID
 * @returns {Promise<Object>}
 */
export const fetchBrandById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.BRAND_BY_ID(id));

    if (response.data.success) {
      return {
        data: response.data.data,
        success: true,
      };
    }

    return {
      data: null,
      success: false,
      error: response.data.message || 'Brand not found',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch brand'),
    };
  }
};

/**
 * Creates a new brand
 * @param {Object} brandData - Brand data
 * @param {string} brandData.name - Brand name
 * @param {string} brandData.description - Brand description (optional)
 * @returns {Promise<Object>}
 */
export const createBrand = async (brandData) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.BRANDS, {
      name: brandData.name,
      description: brandData.description || '',
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
      error: response.data.message || 'Failed to create brand',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to create brand'),
    };
  }
};

/**
 * Updates an existing brand
 * @param {string|number} id - Brand ID
 * @param {Object} brandData - Updated data
 * @param {string} brandData.name - Brand name
 * @param {string} brandData.description - Brand description (optional)
 * @returns {Promise<Object>}
 */
export const updateBrand = async (id, brandData) => {
  try {
    const response = await apiClient.put(API_ENDPOINTS.BRAND_BY_ID(id), {
      name: brandData.name,
      description: brandData.description || '',
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
      error: response.data.message || 'Failed to update brand',
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: extractErrorMessage(error, 'Failed to update brand'),
    };
  }
};

/**
 * Deletes a brand
 * @param {string|number} id - Brand ID
 * @returns {Promise<Object>}
 */
export const deleteBrand = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.BRAND_BY_ID(id));

    if (response.data.success) {
      return { success: true };
    }

    return {
      success: false,
      error: response.data.message || 'Failed to delete brand',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to delete brand'),
    };
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const brandService = {
  fetchBrands,
  fetchBrandsPaginated,
  fetchBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;

