import { apiClient } from '../../../shared/services';
import { API_CONFIG } from '../../../shared/config/api';
import { extractErrorMessage } from '../../../shared/utils/errorHandler';

/**
 * Dashboard Service
 * Handles all data operations for the dashboard feature using API endpoints.
 */

/**
 * Fetches dashboard KPI statistics
 * @returns {Promise<Object>} Stats object
 */
export const fetchStats = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.STATS);
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch dashboard stats',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch dashboard stats'),
    };
  }
};

/**
 * Fetches sales trend chart data
 * @param {string} period - 'week', 'month', 'year' (default: 'week')
 * @returns {Promise<Object>} Sales trend data
 */
export const fetchSalesTrend = async (period = 'week') => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.SALES_TREND, {
      params: { period },
    });
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch sales trend',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch sales trend'),
    };
  }
};

/**
 * Fetches top selling products
 * @param {number} limit - Number of products to fetch (default: 5)
 * @returns {Promise<Object>} Top products data
 */
export const fetchTopProducts = async (limit = 5) => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.TOP_PRODUCTS, {
      params: { limit },
    });
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch top products',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch top products'),
    };
  }
};

/**
 * Fetches revenue breakdown by category (Admin only)
 * @returns {Promise<Object>} Revenue by category data
 */
export const fetchRevenueByCategory = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.REVENUE_BY_CATEGORY);
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch revenue by category',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch revenue by category'),
    };
  }
};

/**
 * Fetches inventory status overview (Admin only)
 * @returns {Promise<Object>} Inventory overview data
 */
export const fetchInventoryOverview = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.INVENTORY_OVERVIEW);
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch inventory overview',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch inventory overview'),
    };
  }
};

/**
 * Fetches recent system activities
 * @returns {Promise<Object>} Recent activities data
 */
export const fetchRecentActivities = async () => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      error: response.data.message || 'Failed to fetch recent activities',
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, 'Failed to fetch recent activities'),
    };
  }
};

const dashboardService = {
  fetchStats,
  fetchSalesTrend,
  fetchTopProducts,
  fetchRevenueByCategory,
  fetchInventoryOverview,
  fetchRecentActivities,
};

export default dashboardService;