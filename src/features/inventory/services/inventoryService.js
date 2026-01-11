import { apiClient } from '../../../shared/services';

const mapInventoryFromApi = (apiItem) => ({
  id: apiItem.id,
  product: apiItem.product_name,
  sku: apiItem.sku,
  currentStock: apiItem.quantity,
  minStock: 10, // Default value, not provided by API
  maxStock: 100, // Default value, not provided by API
  location: 'Warehouse A', // Default value, not provided by API
  lastUpdated: apiItem.last_stock_in,
  category: apiItem.category,
  brand: apiItem.brand,
});

/**
 * Fetches all inventory items
 * @returns {Promise<Array>} Inventory items array
 */
export const fetchInventory = async () => {
  const response = await apiClient.get('/v1/inventory');
  return response.data.data.map(mapInventoryFromApi);
};

/**
 * Updates inventory stock for an item
 * @param {string} id - Inventory item ID
 * @param {number} newStock - New stock quantity
 * @returns {Promise<Object>} Updated inventory item
 */
export const updateInventoryStock = async (id, newStock) => {
  const response = await apiClient.patch(`/v1/inventory/${id}`, {
    quantity: newStock, // API expects 'quantity'
  });
  return mapInventoryFromApi(response.data.data);
};

