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
  },
};

export default API_CONFIG;

