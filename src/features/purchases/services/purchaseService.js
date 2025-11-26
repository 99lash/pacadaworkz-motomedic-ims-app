/**
 * Purchase Service
 * Handles all data operations for the purchases feature
 * 
 * This service uses localStorage for persistence.
 * Replace with actual API calls when backend is ready.
 */

const PURCHASE_STORAGE_KEY = 'motomedic_purchase_orders';
const SUPPLIER_STORAGE_KEY = 'motomedic_suppliers';
const PRODUCT_STORAGE_KEY = 'motomedic_products';

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

const generatePurchaseOrderId = () => {
  return crypto.randomUUID ? crypto.randomUUID() : `po_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches all purchase orders
 * @returns {Array} Purchase orders array
 */
export const fetchPurchaseOrders = () => {
  return readFromStorage(PURCHASE_STORAGE_KEY, []);
};

/**
 * Fetches a single purchase order by ID
 * @param {string} id - Purchase order ID
 * @returns {Object|null} Purchase order object or null
 */
export const fetchPurchaseOrderById = (id) => {
  const purchaseOrders = fetchPurchaseOrders();
  return purchaseOrders.find(po => po.id === id) || null;
};

/**
 * Fetches suppliers (for purchase order creation)
 * @returns {Array} Suppliers array
 */
export const fetchSuppliers = () => {
  return readFromStorage(SUPPLIER_STORAGE_KEY, []);
};

/**
 * Fetches products (for purchase order creation)
 * @returns {Array} Products array
 */
export const fetchProducts = () => {
  // Get products from localStorage
  // Note: Products should be created through the Products page first
  // The productService uses in-memory mockProducts, so we rely on localStorage
  // which gets populated when products are created/updated through the Products page
  return readFromStorage(PRODUCT_STORAGE_KEY, []);
};

/**
 * Creates a new purchase order
 * @param {Object} purchaseOrderData - Purchase order data
 * @returns {Object} Created purchase order
 */
export const createPurchaseOrder = (purchaseOrderData) => {
  const purchaseOrders = fetchPurchaseOrders();
  const suppliers = fetchSuppliers();
  const supplier = suppliers.find(s => s.id === purchaseOrderData.supplierId);
  
  // Calculate total
  const total = purchaseOrderData.items.reduce((sum, item) => {
    return sum + (item.quantityOrdered * item.costPrice);
  }, 0);

  const newPurchaseOrder = {
    id: generatePurchaseOrderId(),
    supplierId: purchaseOrderData.supplierId,
    supplierName: supplier?.companyName || 'Unknown Supplier',
    expectedDeliveryDate: purchaseOrderData.expectedDeliveryDate,
    notes: purchaseOrderData.notes || '',
    items: purchaseOrderData.items.map(item => ({
      productId: item.productId,
      quantityOrdered: item.quantityOrdered,
      quantityReceived: 0,
      costPrice: item.costPrice,
    })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedPurchaseOrders = [...purchaseOrders, newPurchaseOrder];
  saveToStorage(PURCHASE_STORAGE_KEY, updatedPurchaseOrders);
  return newPurchaseOrder;
};

/**
 * Updates a purchase order status to received
 * @param {string} id - Purchase order ID
 * @returns {Object|null} Updated purchase order or null
 */
export const markPurchaseOrderAsReceived = (id) => {
  const purchaseOrders = fetchPurchaseOrders();
  const products = fetchProducts();
  const index = purchaseOrders.findIndex(po => po.id === id);
  
  if (index === -1) return null;
  
  const purchaseOrder = purchaseOrders[index];
  
  // Update product stock and cost prices
  const updatedProducts = products.map((product) => {
    const poItem = purchaseOrder.items.find((item) => item.productId === product.id);
    if (poItem) {
      return {
        ...product,
        currentStock: (product.currentStock || 0) + poItem.quantityOrdered,
        costPrice: poItem.costPrice, // Update cost price
      };
    }
    return product;
  });
  
  saveToStorage(PRODUCT_STORAGE_KEY, updatedProducts);
  
  // Update purchase order status
  const updatedPurchaseOrder = {
    ...purchaseOrder,
    status: 'received',
    receivedAt: new Date().toISOString(),
    items: purchaseOrder.items.map((item) => ({
      ...item,
      quantityReceived: item.quantityOrdered,
    })),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedPurchaseOrders = [
    ...purchaseOrders.slice(0, index),
    updatedPurchaseOrder,
    ...purchaseOrders.slice(index + 1),
  ];
  
  saveToStorage(PURCHASE_STORAGE_KEY, updatedPurchaseOrders);
  return updatedPurchaseOrder;
};

/**
 * Deletes a purchase order
 * @param {string} id - Purchase order ID
 * @returns {boolean} Success status
 */
export const deletePurchaseOrder = (id) => {
  const purchaseOrders = fetchPurchaseOrders();
  const filteredPurchaseOrders = purchaseOrders.filter(po => po.id !== id);
  
  if (filteredPurchaseOrders.length === purchaseOrders.length) {
    return false; // Purchase order not found
  }
  
  saveToStorage(PURCHASE_STORAGE_KEY, filteredPurchaseOrders);
  return true;
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const purchaseService = {
  fetchPurchaseOrders,
  fetchPurchaseOrderById,
  fetchSuppliers,
  fetchProducts,
  createPurchaseOrder,
  markPurchaseOrderAsReceived,
  deletePurchaseOrder,
};

export default purchaseService;

