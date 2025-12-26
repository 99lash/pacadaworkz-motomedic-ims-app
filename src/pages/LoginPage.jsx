import { useNavigate } from 'react-router-dom';
import { useLoginForm } from '../features/auth/hooks/useLoginForm';
import { ROUTES } from '../shared/utils/routes';
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../shared/services/apiClient';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import storageService from '../shared/services/storageService';
import { STORAGE_KEYS } from '../shared/config/storage';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await apiClient.post('/v1/auth/login/google', {
        credential: credentialResponse.credential,
      });

      const { user, access_token, refresh_token } = response.data.data;
      
      dispatch(loginSuccess({ user, accessToken: access_token, refreshToken: refresh_token }));

      // Persist tokens and user
      storageService.set(STORAGE_KEYS.ACCESS_TOKEN, access_token);
      storageService.set(STORAGE_KEYS.REFRESH_TOKEN, refresh_token);
      storageService.set(STORAGE_KEYS.USER, user);

      navigate(ROUTES.DASHBOARD || '/');
    } catch (error) {
      console.error('Google login failed:', error);
      // Handle login error (e.g., show a notification to the user)
    }
  };

  const handleGoogleLoginError = () => {
    console.error('Google login failed');
    // Handle login error (e.g., show a notification to the user)
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    navigate(ROUTES.DASHBOARD || '/');
  };

  const {
    formData,
    validationErrors,
    loading,
    error,
    updateField,
    handleSubmit,
  } = useLoginForm(handleLoginSuccess);

  // Get display error (validation or API error)
  const displayError = 
    Object.values(validationErrors)[0] || 
    error || 
    null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 rounded-full p-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              <circle cx="7" cy="12" r="1.5"/>
              <circle cx="17" cy="12" r="1.5"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-xl font-semibold text-gray-800 mb-1">
          Pacawork MotoMedic
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Motor Parts & Accessories Authorized Seller
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Error Message */}
          {displayError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{displayError}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.8a2.5 2.5 0 11-5 0" />
                </svg>
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
                  validationErrors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}