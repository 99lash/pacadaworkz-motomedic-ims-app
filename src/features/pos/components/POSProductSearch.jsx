import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { UI_TEXT } from '../utils';

const POSProductSearch = ({ searchTerm, onSearchChange, isCompact = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${isCompact ? 'p-2' : 'p-4'}`}>
    <div className="relative">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <input
        type="text"
        placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={`w-full pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
          isCompact ? 'py-1.5 text-xs' : 'py-2.5 text-sm'
        }`}
        autoFocus
      />
    </div>
  </div>
);

POSProductSearch.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};

export default POSProductSearch;

