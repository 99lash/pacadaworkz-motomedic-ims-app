import { Menu, X } from 'lucide-react';

const MobileMenuButton = ({ isOpen, onToggle, className = '' }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        p-2 rounded-lg 
        bg-white hover:bg-gray-100 
        dark:bg-gray-900 dark:hover:bg-gray-800
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${className}
      `}
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-sidebar"
    >
      <span className="sr-only">
        {isOpen ? 'Close menu' : 'Open menu'}
      </span>
      {isOpen ? (
        <X size={24} className="text-gray-700 dark:text-gray-200" aria-hidden="true" />
      ) : (
        <Menu size={24} className="text-gray-700 dark:text-gray-200" aria-hidden="true" />
      )}
    </button>
  );
};

export default MobileMenuButton;

