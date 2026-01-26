import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { STORAGE_KEYS } from '../config/storage';
import storageService from './storageService';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storageService.get(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          // Try to refresh the token using refresh token as auth header
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          // The API returns access_token in response.data.data (wrapped in resource)
          const newAccessToken = response.data.data?.new_access_token || response.data.new_access_token;
          
          if (newAccessToken) {
            // Store new access token
            storageService.set(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        storageService.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storageService.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storageService.remove(STORAGE_KEYS.USER);
        
        // Dispatch logout event for components to handle navigation
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

