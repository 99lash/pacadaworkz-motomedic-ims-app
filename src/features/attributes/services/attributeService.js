import apiClient from '../../../shared/services/apiClient';

const ATTRIBUTE_CACHE_KEY = 'motomedic_attributes_cache';
const ATTRIBUTE_API_ENDPOINT = '/attributes';

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

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const attributeService = {
  fetchAttributes,
  fetchAttributeById,
  createAttribute,
  updateAttribute,
  deleteAttribute,
};

export default attributeService;

