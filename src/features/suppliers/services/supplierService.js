import { apiClient } from '../../../shared/services';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';
import { API_ENDPOINTS } from '../utils';

// =============================================================================
// CACHE
// =============================================================================

const cache = {
  suppliers: null,
  last_update: null,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const transformSupplierFromBackend = (supplier) => ({
  id: supplier.id,
  companyName: supplier.name,
  contactPerson: supplier.contact_person,
  phone: supplier.phone,
  email: supplier.email,
  address: supplier.address,
  paymentTerms: supplier.payment_terms,
  createdAt: supplier.created_at,
  updatedAt: supplier.updated_at,
});

const transformSupplierToBackend = (supplier) => ({
  name: supplier.companyName,
  contact_person: supplier.contactPerson,
  contact_number: supplier.phone,
  email: supplier.email,
  address: supplier.address,
  payment_terms: supplier.paymentTerms,
});

// =============================================================================
// SERVICE METHODS
// =============================================================================

export const invalidateCache = () => {
  cache.suppliers = null;
  cache.last_update = null;
};

export const fetchSuppliers = async () => {
  const now = Date.now();
  if (cache.suppliers && cache.last_update && now - cache.last_update < CACHE_DURATION) {
    return { success: true, data: cache.suppliers };
  }

  try {
    const response = await apiClient.get(API_ENDPOINTS.SUPPLIERS);
    if (response.data.success) {
      const suppliers = response.data.data.map(transformSupplierFromBackend);
      cache.suppliers = suppliers;
      cache.last_update = now;
      return { success: true, data: suppliers };
    }
    return { success: false, error: response.data.message || 'Failed to fetch suppliers' };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, 'Failed to fetch suppliers') };
  }
};

export const fetchSupplierById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SUPPLIER_BY_ID(id));
    if (response.data.success) {
      const supplier = transformSupplierFromBackend(response.data.data);
      return { success: true, data: supplier };
    }
    return { success: false, error: response.data.message || 'Supplier not found' };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, 'Failed to fetch supplier') };
  }
};

export const createSupplier = async (supplierData) => {
  try {
    const payload = transformSupplierToBackend(supplierData);
    const response = await apiClient.post(API_ENDPOINTS.SUPPLIERS, payload);
    if (response.data.success) {
      invalidateCache();
      const supplier = transformSupplierFromBackend(response.data.data);
      return { success: true, data: supplier };
    }
    return { success: false, error: response.data.message || 'Failed to create supplier' };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, 'Failed to create supplier') };
  }
};

export const updateSupplier = async (id, supplierData) => {
  try {
    const payload = transformSupplierToBackend(supplierData);
    const response = await apiClient.patch(API_ENDPOINTS.SUPPLIER_BY_ID(id), payload);
    if (response.data.success) {
      invalidateCache();
      const supplier = transformSupplierFromBackend(response.data.data);
      return { success: true, data: supplier };
    }
    return { success: false, error: response.data.message || 'Failed to update supplier' };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, 'Failed to update supplier') };
  }
};

export const deleteSupplier = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.SUPPLIER_BY_ID(id));
    if (response.data.success) {
      invalidateCache();
      return { success: true };
    }
    return { success: false, error: response.data.message || 'Failed to delete supplier' };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error, 'Failed to delete supplier') };
  }
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
  invalidateCache,
};

export default supplierService;
