/**
 * Purchase Service
 * Handles all data operations for the purchases feature
 *
 * This service uses the centralized API client for HTTP requests.
 */

import { apiClient } from '../../../shared/services';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

const API_ENDPOINT = '/v1/purchases';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const transformPurchaseOrderFromBackend = (po) => ({
  id: po.id,
  supplierId: po.supplier_id,
  supplierName: po.supplier_name || po.supplier || 'Unknown Supplier',
  userName: po.user_name,
  expectedDeliveryDate: po.expected_delivery || po.expected_delivery_date,
  notes: po.notes || '',
  items: (po.items || []).map((item) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    quantityOrdered: parseFloat(item.quantity || item.quantity_ordered || 0),
    quantityReceived: parseFloat(item.quantity_received || 0),
    costPrice: parseFloat(item.unit_cost || item.cost_price || 0),
    totalCost: parseFloat(item.total_cost || 0),
  })),
  total: parseFloat(po.total_amount || 0),
  status: po.status,
  createdAt: po.created_at || po.order_date,
  updatedAt: po.updated_at,
});

const transformPurchaseOrderToBackend = (po) => {
  // Try to get user ID from stored auth data
  let userId = 1; // Default fallback
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      userId = user.id || 1;
    }
  } catch (e) {
    console.warn('Could not retrieve user ID for purchase order', e);
  }

  return {
    supplier_id: parseInt(po.supplierId),
    user_id: userId,
    order_date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
    expected_delivery: po.expectedDeliveryDate,
    status: po.status || 'pending',
    notes: po.notes,
    items: (po.items || []).map((item) => ({
      product_id: parseInt(item.productId),
      quantity: parseInt(item.quantityOrdered),
      unit_cost: parseFloat(item.costPrice),
    })),
  };
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all purchase orders
 * @returns {Promise<Array>} Purchase orders array
 */
export const fetchPurchaseOrders = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINT);
    if (response.data.success) {
      return response.data.data.map(transformPurchaseOrderFromBackend);
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch purchase orders:', extractErrorMessage(error));
    return [];
  }
};

/**
 * Fetches a single purchase order by ID
 * @param {string} id - Purchase order ID
 * @returns {Promise<Object|null>} Purchase order object or null
 */
export const fetchPurchaseOrderById = async (id) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINT}/${id}`);
    if (response.data.success) {
      return transformPurchaseOrderFromBackend(response.data.data);
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch purchase order:', extractErrorMessage(error));
    return null;
  }
};

/**
 * Creates a new purchase order
 * @param {Object} purchaseOrderData - Purchase order data
 * @returns {Promise<Object>} Created purchase order
 */
export const createPurchaseOrder = async (purchaseOrderData) => {
  try {
    const payload = transformPurchaseOrderToBackend(purchaseOrderData);

    const response = await apiClient.post(API_ENDPOINT, payload);
    if (response.data.success) {
      return transformPurchaseOrderFromBackend(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to create purchase order');
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to create purchase order'));
  }
};

/**
 * Updates a purchase order status to received
 * @param {string} id - Purchase order ID
 * @returns {Promise<Object|null>} Updated purchase order or null
 */
export const markPurchaseOrderAsReceived = async (id) => {
  try {
    // According to documentation, use POST /api/v1/purchases/:id/receive
    const response = await apiClient.post(`${API_ENDPOINT}/${id}/receive`);

    if (response.data.success) {
      return transformPurchaseOrderFromBackend(response.data.data);
    }
    return null;
  } catch (error) {
    console.error('Failed to mark purchase order as received:', extractErrorMessage(error));
    return null;
  }
};

/**
 * Updates an existing purchase order
 * @param {string} id - Purchase order ID
 * @param {Object} purchaseOrderData - Updated purchase order data
 * @returns {Promise<Object>} Updated purchase order
 */
export const updatePurchaseOrder = async (id, purchaseOrderData) => {
  try {
    const payload = transformPurchaseOrderToBackend(purchaseOrderData);
    const response = await apiClient.patch(`${API_ENDPOINT}/${id}`, payload);
    if (response.data.success) {
      return transformPurchaseOrderFromBackend(response.data.data);
    }
    throw new Error(response.data.message || 'Failed to update purchase order');
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Failed to update purchase order'));
  }
};

/**
 * Deletes a purchase order
 * @param {string} id - Purchase order ID
 * @returns {Promise<boolean>} Success status
 */
export const deletePurchaseOrder = async (id) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINT}/${id}`);
    return response.data.success;
  } catch (error) {
    console.error('Failed to delete purchase order:', extractErrorMessage(error));
    return false;
  }
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const purchaseService = {
  fetchPurchaseOrders,
  fetchPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  markPurchaseOrderAsReceived,
  deletePurchaseOrder,
};

export default purchaseService;

