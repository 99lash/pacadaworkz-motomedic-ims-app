/**
 * Supplier Service
 * Handles all data operations for the suppliers feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const SUPPLIER_STORAGE_KEY = 'motomedic_suppliers';

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

const generateSupplierId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : `supplier_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all suppliers
 * @returns {Array} Suppliers array
 */
export const fetchSuppliers = () => {
  return readFromStorage(SUPPLIER_STORAGE_KEY, []);
};

/**
 * Fetches a single supplier by ID
 * @param {string} id - Supplier ID
 * @returns {Object|null} Supplier object or null
 */
export const fetchSupplierById = (id) => {
  const suppliers = fetchSuppliers();
  return suppliers.find(supplier => supplier.id === id) || null;
};

/**
 * Creates a new supplier
 * @param {Object} supplierData - Supplier data
 * @returns {Object} Created supplier
 */
export const createSupplier = (supplierData) => {
  const suppliers = fetchSuppliers();
  const newSupplier = {
    id: generateSupplierId(),
    companyName: supplierData.companyName?.trim() || '',
    contactPerson: supplierData.contactPerson?.trim() || '',
    phone: supplierData.phone?.trim() || '',
    email: supplierData.email?.trim() || '',
    address: supplierData.address?.trim() || '',
    paymentTerms: supplierData.paymentTerms?.trim() || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedSuppliers = [...suppliers, newSupplier];
  saveToStorage(SUPPLIER_STORAGE_KEY, updatedSuppliers);
  return newSupplier;
};

/**
 * Updates an existing supplier
 * @param {string} id - Supplier ID
 * @param {Object} supplierData - Updated supplier data
 * @returns {Object|null} Updated supplier or null
 */
export const updateSupplier = (id, supplierData) => {
  const suppliers = fetchSuppliers();
  const index = suppliers.findIndex(supplier => supplier.id === id);
  
  if (index === -1) return null;
  
  const updatedSupplier = {
    ...suppliers[index],
    companyName: supplierData.companyName?.trim() || '',
    contactPerson: supplierData.contactPerson?.trim() || '',
    phone: supplierData.phone?.trim() || '',
    email: supplierData.email?.trim() || '',
    address: supplierData.address?.trim() || '',
    paymentTerms: supplierData.paymentTerms?.trim() || '',
    updatedAt: new Date().toISOString(),
  };
  
  const updatedSuppliers = [
    ...suppliers.slice(0, index),
    updatedSupplier,
    ...suppliers.slice(index + 1),
  ];
  
  saveToStorage(SUPPLIER_STORAGE_KEY, updatedSuppliers);
  return updatedSupplier;
};

/**
 * Deletes a supplier
 * @param {string} id - Supplier ID
 * @returns {boolean} Success status
 */
export const deleteSupplier = (id) => {
  const suppliers = fetchSuppliers();
  const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
  
  if (filteredSuppliers.length === suppliers.length) {
    return false; // Supplier not found
  }
  
  saveToStorage(SUPPLIER_STORAGE_KEY, filteredSuppliers);
  return true;
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const supplierService = {
  fetchSuppliers,
  fetchSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};

export default supplierService;

