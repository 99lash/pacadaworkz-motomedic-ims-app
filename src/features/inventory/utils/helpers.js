/**
 * Inventory Helper Functions
 */

/**
 * Calculates stock status based on current stock quantity
 * Since backend doesn't provide min/max stock levels, we use simple thresholds
 * @param {number} currentStock - Current stock quantity
 * @returns {string} Stock status ('out', 'low', 'healthy')
 */
export const getStockStatus = (currentStock) => {
  if (currentStock === 0) return 'out';
  if (currentStock < 10) return 'low'; // Arbitrary threshold
  return 'healthy';
};

/**
 * Calculates stock percentage
 * @param {number} current - Current stock
 * @param {number} max - Maximum stock
 * @returns {number} Stock percentage (0-100)
 */
export const getStockPercentage = (current, max) => {
  return Math.round((current / max) * 100);
};

/**
 * Filters inventory items based on search term and status
 * @param {Array} inventory - Inventory items array
 * @param {string} searchTerm - Search term
 * @param {string} statusFilter - Status filter
 * @param {Function} getStockStatusFn - Function to get stock status
 * @returns {Array} Filtered inventory items
 */
export const filterInventory = (inventory, searchTerm, statusFilter, getStockStatusFn) => {
  return inventory.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const itemStatus = getStockStatusFn(item.quantity);
    let matchesStatus = true;

    if (statusFilter !== 'All Status') {
      switch (statusFilter) {
        case 'In Stock':
          matchesStatus = itemStatus === 'healthy';
          break;
        case 'Low Stock':
          matchesStatus = itemStatus === 'low';
          break;
        case 'Out of Stock':
          matchesStatus = itemStatus === 'out';
          break;
        default:
          matchesStatus = true;
      }
    }

    return matchesSearch && matchesStatus;
  });
};

/**
 * Gets status display information
 * @param {string} status - Stock status
 * @returns {Object} Status display info with text, variant, and icon name
 */
export const getStatusDisplay = (status) => {
  switch (status) {
    case 'out':
      return { text: 'Out of Stock', variant: 'destructive', iconName: 'AlertTriangle' };
    case 'low':
      return { text: 'Low Stock', variant: 'secondary', iconName: 'Package' };
    case 'healthy':
      return { text: 'In Stock', variant: 'default', iconName: 'CheckCircle' };
    default:
      return { text: 'Unknown', variant: 'secondary', iconName: 'Package' };
  }
};

