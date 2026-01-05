import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../features/auth';

const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

const formatDate = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date());
};

export default function Header() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await logout();
    // No need to redirect here, the auth state change will trigger it
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = user?.name || 'user';
  const userRole = user?.role?.role_name || 'role';

  return (
    <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      {/* Left section - Welcome message */}
      <div>
        <h1 className="text-gray-900 text-lg font-medium dark:text-gray-100">
          Welcome back, {user?.first_name || userName.split(' ')[0]}!
        </h1>
        <p className="text-gray-500 text-sm mt-0.5 dark:text-gray-400">
          {formatDate()}
        </p>
      </div>

      {/* Right section - User profile */}
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={toggleDropdown}
          className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer dark:bg-gray-900 dark:border-gray-700 dark:hover:border-gray-600"
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{getInitials(userName)}</span>
          </div>
          
          {/* User info */}
          <div className="text-left">
            <div className="text-gray-900 text-sm font-medium dark:text-gray-100">{userName}</div>
            <div className="text-gray-500 text-xs dark:text-gray-400">{userRole}</div>
          </div>
          
          {/* Dropdown icon */}
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
