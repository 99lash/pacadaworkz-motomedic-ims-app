/**
 * Attribute Service
 * Handles all data operations for the attributes feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const ATTRIBUTE_STORAGE_KEY = 'motomedic_attributes';

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

const generateAttributeId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : `attr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all attributes
 * @returns {Array} Attributes array
 */
export const fetchAttributes = () => {
  return readFromStorage(ATTRIBUTE_STORAGE_KEY, []);
};

/**
 * Fetches a single attribute by ID
 * @param {string} id - Attribute ID
 * @returns {Object|null} Attribute object or null
 */
export const fetchAttributeById = (id) => {
  const attributes = fetchAttributes();
  return attributes.find(attribute => attribute.id === id) || null;
};

/**
 * Creates a new attribute
 * @param {Object} attributeData - Attribute data
 * @returns {Object} Created attribute
 */
export const createAttribute = (attributeData) => {
  const attributes = fetchAttributes();
  const newAttribute = {
    id: generateAttributeId(),
    name: attributeData.name?.trim() || '',
    description: attributeData.description?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedAttributes = [...attributes, newAttribute];
  saveToStorage(ATTRIBUTE_STORAGE_KEY, updatedAttributes);
  return newAttribute;
};

/**
 * Updates an existing attribute
 * @param {string} id - Attribute ID
 * @param {Object} attributeData - Updated attribute data
 * @returns {Object|null} Updated attribute or null
 */
export const updateAttribute = (id, attributeData) => {
  const attributes = fetchAttributes();
  const index = attributes.findIndex(attribute => attribute.id === id);
  
  if (index === -1) return null;
  
  const updatedAttribute = {
    ...attributes[index],
    name: attributeData.name?.trim() || '',
    description: attributeData.description?.trim() || '',
    updatedAt: new Date().toISOString(),
  };
  
  const updatedAttributes = [
    ...attributes.slice(0, index),
    updatedAttribute,
    ...attributes.slice(index + 1),
  ];
  
  saveToStorage(ATTRIBUTE_STORAGE_KEY, updatedAttributes);
  return updatedAttribute;
};

/**
 * Deletes an attribute
 * @param {string} id - Attribute ID
 * @returns {boolean} Success status
 */
export const deleteAttribute = (id) => {
  const attributes = fetchAttributes();
  const filteredAttributes = attributes.filter(attribute => attribute.id !== id);
  
  if (filteredAttributes.length === attributes.length) {
    return false; // Attribute not found
  }
  
  saveToStorage(ATTRIBUTE_STORAGE_KEY, filteredAttributes);
  return true;
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

