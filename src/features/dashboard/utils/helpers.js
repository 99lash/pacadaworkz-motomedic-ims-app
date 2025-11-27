/**
 * Dashboard Helper Functions
 * Utility functions for dashboard calculations and formatting
 */

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Calculates sales trend data for the last N days
 * @param {Array} transactions - Array of completed transactions
 * @param {number} days - Number of days to show
 * @returns {Array} Sales trend data
 */
export const calculateSalesTrend = (transactions, days = 7) => {
  const today = new Date();
  const trendData = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = transactions.filter((t) => 
      t.date && t.date.startsWith(dateStr)
    );
    
    const daySales = dayTransactions.reduce((sum, t) => sum + t.total, 0);
    
    trendData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: daySales,
    });
  }
  
  return trendData;
};

/**
 * Calculates top selling products
 * @param {Array} transactions - Array of completed transactions
 * @param {Array} products - Array of products
 * @param {number} limit - Number of top products to return
 * @returns {Array} Top selling products data
 */
export const calculateTopProducts = (transactions, products, limit = 5) => {
  const productSales = {};
  
  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = 0;
      }
      productSales[item.productId] += item.quantity;
    });
  });
  
  return Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return {
        name: product?.name || 'Unknown',
        sales: quantity,
      };
    });
};

/**
 * Calculates revenue by category
 * @param {Array} transactions - Array of completed transactions
 * @param {Array} products - Array of products
 * @param {Array} categories - Array of categories
 * @returns {Array} Revenue by category data
 */
export const calculateRevenueByCategory = (transactions, products, categories) => {
  const categoryRevenue = {};
  
  transactions.forEach((transaction) => {
    transaction.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const category = categories.find((c) => c.id === product.categoryId);
        const categoryName = category?.name || 'Other';
        if (!categoryRevenue[categoryName]) {
          categoryRevenue[categoryName] = 0;
        }
        categoryRevenue[categoryName] += item.total;
      }
    });
  });
  
  return Object.entries(categoryRevenue).map(([name, value]) => ({
    name,
    value,
  }));
};

/**
 * Formats date for activity display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatActivityDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString();
};

