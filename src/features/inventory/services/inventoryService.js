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
 * Fetches inventory items with pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Paginated response
 */
export const fetchInventoryPaginated = async ({
  page = 1,
  pageSize = 20,
  search = '',
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: pageSize.toString(),
  });

  if (search?.trim()) {
    params.append('search', search.trim());
  }

  const response = await apiClient.get(`/v1/inventory?${params}`);
  const { data, meta } = response.data;

  return {
    success: true,
    data: data.map(mapInventoryFromApi),
    pagination: {
      page: meta?.current_page || page,
      pageSize: meta?.per_page || pageSize,
      totalItems: meta?.total || 0,
      totalPages: meta?.last_page || 0,
      hasNextPage: (meta?.current_page || page) < (meta?.last_page || 0),
      hasPrevPage: (meta?.current_page || page) > 1,
    },
  };
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

