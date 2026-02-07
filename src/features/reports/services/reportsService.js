/**
 * Reports Service
 * Handles all data operations for the reports feature
 * 
 * This service uses the backend API for data fetching.
 */

import apiClient from '../../../shared/services/apiClient';

// =============================================================================
// SERVICE METHODS
// =============================================================================

/**
 * Fetches sales report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Sales report data
 */
export const fetchSalesReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/sales', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Fetches purchase report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Purchase report data
 */
export const fetchPurchaseReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/purchases', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Fetches inventory report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Inventory report data
 */
export const fetchInventoryReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/inventory', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Fetches product performance report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Product performance report data
 */
export const fetchProductPerformanceReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/product-performance', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Fetches stock adjustments report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Stock adjustments report data
 */
export const fetchStockAdjustmentReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/stock-adjustments', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Fetches profit & loss report data
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Profit & loss report data
 */
export const fetchProfitLossReport = async (startDate, endDate) => {
  const response = await apiClient.get('/v1/reports/profit-loss', {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data.data;
};

/**
 * Exports report to CSV
 * @param {string} type - Report type
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Blob>} File blob
 */
export const exportReport = async (type, startDate, endDate) => {
  const response = await apiClient.get(`/v1/reports/${type}/export`, {
    params: { start_date: startDate, end_date: endDate },
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Fetches raw inventory data for detailed reporting
 * @returns {Promise<Array>} Inventory data
 */
export const fetchRawInventory = async () => {
  const response = await apiClient.get('/v1/inventory');
  return response.data.data;
};

/**
 * Fetches raw stock adjustments for detailed reporting
 * @returns {Promise<Array>} Adjustments data
 */
export const fetchRawStockAdjustments = async () => {
  const response = await apiClient.get('/v1/stock-adjustments');
  return response.data.data;
};

/**
 * Fetches top products from dashboard (quantity based)
 * @returns {Promise<Object>} Key-value pair of Product Name -> Quantity
 */
export const fetchDashboardTopProducts = async () => {
  const response = await apiClient.get('/v1/dashboard/charts/top-products');
  return response.data.data;
};

// =============================================================================
// SERVICE EXPORT
// =============================================================================

const reportsService = {
  fetchSalesReport,
  fetchPurchaseReport,
  fetchInventoryReport,
  fetchProductPerformanceReport,
  fetchStockAdjustmentReport,
  fetchProfitLossReport,
  exportReport,
  fetchRawInventory,
  fetchRawStockAdjustments,
  fetchDashboardTopProducts,
};

export default reportsService;

