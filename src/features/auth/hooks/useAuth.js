import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { 
  loginSuccess, 
  logout as logoutAction, 
  setLoading, 
  setError,
  setUser 
} from '../authSlice';
import authService from '../services/authService';
import { ROLES } from '../../../shared/utils/permissions';

const roleMap = {
  1: ROLES.SUPER_ADMIN,
  2: ROLES.ADMIN,
  3: ROLES.STAFF,
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, accessToken } = useSelector(
    (state) => state.auth
  );

  // Listen for logout events from apiClient interceptor
  useEffect(() => {
    const handleLogout = () => {
      dispatch(logoutAction());
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [dispatch]); // ✅ Proper dependency array

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, data?: Object, error?: string}>} Login result
   */
  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await authService.login(email, password);

      if (result.success) {
        dispatch(
          loginSuccess({
            user: result.data.user,
            accessToken: result.data.tokens.access_token,
            refreshToken: result.data.tokens.refresh_token,
          })
        );
        return {
          success: true,
          data: result.data,
        };
      } else {
        const errorMessage = result.message || 'Login failed';
        dispatch(setError(errorMessage));
        return {
          success: false,
          error: errorMessage,
        };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred during login';
      dispatch(setError(errorMessage));
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Logout user
   * @returns {Promise<{success: boolean}>} Logout result
   */
  const logout = async () => {
    try {
      dispatch(setLoading(true));
      await authService.logout();
      dispatch(logoutAction());
      return { success: true };
    } catch (_error) {
      // Even if API call fails, clear local state
      dispatch(logoutAction());
      return { success: true };
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Get current user data from API
   * @returns {Promise<Object|null>} User data or null
   */
  const getCurrentUser = async () => {
    try {
      dispatch(setLoading(true));
      const result = await authService.getCurrentUser();

      if (result.success) {
        dispatch(setUser(result.data));
        return result.data;
      } else {
        dispatch(setError(result.message || 'Failed to get user data'));
        return null;
      }
    } catch (error) {
      dispatch(setError(error.message || 'Failed to get user data'));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Initialize auth state from storage
   * @returns {boolean} True if auth state was restored
   */
  const initializeAuth = () => {
    const storedUser = authService.getStoredUser();
    const token = authService.getAccessToken();

    if (token && storedUser) {
      dispatch(
        loginSuccess({
          user: storedUser,
          accessToken: token,
          refreshToken: authService.getRefreshToken(),
        })
      );
      return true;
    }
    return false;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    accessToken,
    userRole: user ? roleMap[user.role_id] : null,
    login,
    logout,
    getCurrentUser,
    initializeAuth,
  };
};

