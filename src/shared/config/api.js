/**
 * API Configuration
 * Centralized API endpoint and base URL configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/v1/auth/login',
      LOGOUT: '/v1/auth/logout',
      ME: '/v1/auth/me',
      REFRESH: '/v1/auth/refresh',
    },
    DASHBOARD: {
      STATS: '/v1/dashboard/stats',
      SALES_TREND: '/v1/dashboard/charts/sales-trend',
      TOP_PRODUCTS: '/v1/dashboard/charts/top-products',
      REVENUE_BY_CATEGORY: '/v1/dashboard/charts/revenue-by-category',
      INVENTORY_OVERVIEW: '/v1/dashboard/charts/inventory-overview',
      RECENT_ACTIVITIES: '/v1/dashboard/recent-activities',
    },
  },
};

export default API_CONFIG;

