/**
 * POS Helper Functions
 * Utility functions for POS calculations and formatting
 */

/**
 * Filters products based on search term
 * @param {Array} products - Array of products
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered products
 */
export const filterProducts = (products, searchTerm) => {
  if (!searchTerm.trim()) {
    return products.filter((product) => product.currentStock > 0);
  }

  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.currentStock > 0 &&
      (product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        (product.barcode && product.barcode.includes(term)))
  );
};

/**
 * Calculates subtotal from cart items
 * @param {Array} cart - Array of cart items
 * @returns {number} Subtotal amount
 */
export const calculateSubtotal = (cart) => {
  return cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
};

/**
 * Calculates total after discount
 * @param {number} subtotal - Subtotal amount
 * @param {number} discount - Discount amount
 * @returns {number} Total amount
 */
export const calculateTotal = (subtotal, discount) => {
  return Math.max(0, subtotal - discount);
};

/**
 * Calculates change for cash payment
 * @param {number} amountPaid - Amount paid by customer
 * @param {number} total - Total amount due
 * @returns {number} Change amount
 */
export const calculateChange = (amountPaid, total) => {
  return Math.max(0, amountPaid - total);
};

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

