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
  supplierId: po.supplier_id, // Might be undefined in list view if only 'supplier' string is returned
  supplierName: po.supplier || po.supplier_name || 'Unknown Supplier',
  expectedDeliveryDate: po.expected_delivery || po.expected_delivery_date,
  notes: po.notes || '',
  items: (po.items || []).map((item) => ({
    productId: item.product_id,
    productName: item.product_name,
    quantityOrdered: parseFloat(item.quantity_ordered),
    quantityReceived: parseFloat(item.quantity_received) || 0,
    costPrice: parseFloat(item.cost_price),
  })),
  total: parseFloat(po.total_amount),
  status: po.status,
  createdAt: po.order_date || po.created_at, // Use order_date if available
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
    supplier_id: po.supplierId,
    user_id: userId,
    order_date: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
    expected_delivery: po.expectedDeliveryDate,
    notes: po.notes,
    items: po.items.map((item) => ({
      product_id: item.productId,
      quantity_ordered: item.quantityOrdered,
      cost_price: item.costPrice,
    })),
    total_amount: po.total,
    status: po.status || 'pending',
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
    // Calculate total if not provided (though backend likely recalculates)
    const total = purchaseOrderData.items.reduce((sum, item) => {
      return sum + (item.quantityOrdered * item.costPrice);
    }, 0);

    const payload = transformPurchaseOrderToBackend({
      ...purchaseOrderData,
      total,
    });

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
    // Assuming backend handles status update via PATCH
    // If specific endpoint exists for receiving, change this path
    const response = await apiClient.patch(`${API_ENDPOINT}/${id}`, {
      status: 'received',
    });

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
  markPurchaseOrderAsReceived,
  deletePurchaseOrder,
};

export default purchaseService;

