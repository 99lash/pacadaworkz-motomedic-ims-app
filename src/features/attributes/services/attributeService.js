import apiClient from '../../../shared/services/apiClient';

const ATTRIBUTE_CACHE_KEY = 'motomedic_attributes_cache';
const ATTRIBUTE_API_ENDPOINT = '/v1/attributes';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getCachedAttributes = () => {
  try {
    const cached = sessionStorage.getItem(ATTRIBUTE_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Error reading from attribute cache:', error);
    return null;
  }
};

const cacheAttributes = (data) => {
  try {
    sessionStorage.setItem(ATTRIBUTE_CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error writing to attribute cache:', error);
  }
};

const clearAttributeCache = () => {
  sessionStorage.removeItem(ATTRIBUTE_CACHE_KEY);
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all attributes, using cache if available.
 * @param {boolean} forceRefresh - Ignore cache and fetch from API
 * @returns {Promise<Array>} Attributes array
 */
export const fetchAttributes = async (forceRefresh = false) => {
  const cached = getCachedAttributes();
  if (cached && !forceRefresh) {
    return cached;
  }
  
  const response = await apiClient.get(ATTRIBUTE_API_ENDPOINT);
  const attributes = response.data.data; // The API wraps data in a 'data' property
  cacheAttributes(attributes);
  return attributes;
};

/**
 * Fetches attributes with pagination and search
 *
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (1-based)
 * @param {number} params.pageSize - Items per page
 * @param {string} params.search - Search term (optional)
 * @returns {Promise<Object>} Paginated response
 */
export const fetchAttributesPaginated = async ({
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

    const response = await apiClient.get(`${ATTRIBUTE_API_ENDPOINT}?${params}`);

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
    throw error;
  }
};

/**
 * Fetches a single attribute by ID from the cache.
 * Note: For real-time data, you might want a dedicated API call.
 * @param {string} id - Attribute ID
 * @returns {Promise<Object|null>} Attribute object or null
 */
export const fetchAttributeById = async (id) => {
  const attributes = await fetchAttributes();
  return attributes.find(attribute => attribute.id === id) || null;
};

/**
 * Creates a new attribute.
 * @param {Object} attributeData - { name, description }
 * @returns {Promise<Object>} Created attribute
 */
export const createAttribute = async (attributeData) => {
  const response = await apiClient.post(ATTRIBUTE_API_ENDPOINT, attributeData);
  clearAttributeCache(); // Invalidate cache
  return response.data.data;
};

/**
 * Updates an existing attribute.
 * @param {string} id - Attribute ID
 * @param {Object} attributeData - { name, description }
 * @returns {Promise<Object>} Updated attribute
 */
export const updateAttribute = async (id, attributeData) => {
  const response = await apiClient.put(`${ATTRIBUTE_API_ENDPOINT}/${id}`, attributeData);
  clearAttributeCache(); // Invalidate cache
  return response.data.data;
};

/**
 * Deletes an attribute.
 * @param {string} id - Attribute ID
 * @returns {Promise<void>}
 */
export const deleteAttribute = async (id) => {
  await apiClient.delete(`${ATTRIBUTE_API_ENDPOINT}/${id}`);
  clearAttributeCache(); // Invalidate cache
};

/**
 * Adds a new value to an attribute.
 * @param {string} attributeId - Attribute ID
 * @param {Object} valueData - { value }
 * @returns {Promise<Object>} Created attribute value
 */
export const addAttributeValue = async (attributeId, valueData) => {
  const response = await apiClient.post(`${ATTRIBUTE_API_ENDPOINT}/${attributeId}/values`, valueData);
  clearAttributeCache();
  return response.data.data;
};

/**
 * Updates an attribute value.
 * @param {string} valueId - Value ID
 * @param {Object} valueData - { value }
 * @returns {Promise<Object>} Updated attribute value
 */
export const updateAttributeValue = async (valueId, valueData) => {
  const response = await apiClient.patch(`${ATTRIBUTE_API_ENDPOINT}/values/${valueId}`, valueData);
  clearAttributeCache();
  return response.data.data;
};

/**
 * Deletes an attribute value.
 * @param {string} valueId - Value ID
 * @returns {Promise<void>}
 */
export const deleteAttributeValue = async (valueId) => {
  await apiClient.delete(`${ATTRIBUTE_API_ENDPOINT}/values/${valueId}`);
  clearAttributeCache();
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const attributeService = {
  fetchAttributes,
  fetchAttributesPaginated,
  fetchAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  addAttributeValue,
  updateAttributeValue,
  deleteAttributeValue,
};

export default attributeService;

