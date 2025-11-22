import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import navigation hook
import { loginUser } from '../services/mockAuth'; // 2. Import your mock service

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner

  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // 3. Call the mock API
      const response = await loginUser(username, password);

      console.log('Login success:', response);

      // Optional: Save fake token to localStorage so you stay "logged in"
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.user.role);

      // 4. Redirect logic based on role (Optional, or just go to dashboard)
      if (response.data.user.role === 'superadmin') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard'); // Or a different page for staff
      }

    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              <circle cx="7" cy="12" r="1.5" />
              <circle cx="17" cy="12" r="1.5" />
            </svg>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <h1 className="text-center text-xl font-semibold text-gray-800 mb-1">
          Pacawork MotoMedic
        </h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Motor Parts & Accessories Authorized Seller
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-medium py-2.5 rounded-md transition-colors duration-200 
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm font-medium text-gray-700 mb-3">
            Demo Credentials:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">SuperAdmin:</span>
              <span className="text-gray-800 font-mono">superadmin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Admin:</span>
              <span className="text-gray-800 font-mono">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Staff:</span>
              <span className="text-gray-800 font-mono">staff / staff123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}