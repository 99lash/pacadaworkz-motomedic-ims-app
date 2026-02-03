import { apiClient } from '../../../shared/services';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';
import { API_ENDPOINTS } from '../utils';

// =============================================================================
// DATA TRANSFORMERS
// =============================================================================

const transformPurchaseOrderFromBackend = (po) => ({
  id: po.id,
  supplierId: po.supplier_id,
  supplierName: po.supplier,
  orderDate: po.order_date,
  expectedDeliveryDate: po.expected_delivery,
  total: parseFloat(po.total_amount) || 0,
  status: po.status,
  notes: po.notes || '',
  items: po.items?.map(item => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    quantityOrdered: parseInt(item.quantity, 10),
    costPrice: parseFloat(item.cost_price),
    totalCost: parseFloat(item.total_cost),
  })) || [],
  createdAt: po.created_at,
  updatedAt: po.updated_at,
});

const transformPurchaseOrderToBackend = (po) => {
  const totalAmount = po.items.reduce((sum, item) => {
    return sum + ((parseInt(item.quantityOrdered, 10) || 0) * (parseFloat(item.costPrice) || 0));
  }, 0);

  return {
    supplier_id: po.supplierId,
    user_id: 1, // As per docs, user_id is required. Backend will use authenticated user anyway.
    order_date: new Date().toISOString().slice(0, 10),
    expected_delivery: po.expectedDeliveryDate,
    total_amount: totalAmount, // Add total_amount to pass validation
    status: 'pending',
    notes: po.notes,
    items: po.items.map(item => ({
      product_id: item.productId,
      quantity: parseInt(item.quantityOrdered, 10),
      cost_price: parseFloat(item.costPrice),
    })),
  };
};


// =============================================================================
// SERVICE METHODS
// =============================================================================

export const fetchPurchaseOrders = async (params = {}) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PURCHASES, { params });
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data.map(transformPurchaseOrderFromBackend),
        pagination: response.data.meta,
      };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

export const fetchPurchaseOrderById = async (id) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PURCHASE_BY_ID(id));
    if (response.data.success) {
      return {
        success: true,
        data: transformPurchaseOrderFromBackend(response.data.data),
      };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

export const createPurchaseOrder = async (purchaseOrderData) => {
  try {
    const payload = transformPurchaseOrderToBackend(purchaseOrderData);
    const response = await apiClient.post(API_ENDPOINTS.PURCHASES, payload);
    if (response.data.success) {
      return {
        success: true,
        data: transformPurchaseOrderFromBackend(response.data.data),
      };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

export const markPurchaseOrderAsReceived = async (id) => {
  try {
    const payload = { status: 'received' };
    const response = await apiClient.patch(API_ENDPOINTS.PURCHASE_BY_ID(id), payload);
    if (response.data.success) {
      return {
        success: true,
        data: transformPurchaseOrderFromBackend(response.data.data),
      };
    }
    return { success: false, error: response.data.message };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
};

export const deletePurchaseOrder = async (id) => {
  try {
    const response = await apiClient.delete(API_ENDPOINTS.PURCHASE_BY_ID(id));
    return { success: response.data.success };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
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


