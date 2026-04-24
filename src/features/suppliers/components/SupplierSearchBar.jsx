/**
 * SupplierSearchBar Component
 * 
 * Server-side search component for suppliers.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';

const SupplierSearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
        aria-hidden="true" 
      />
      <Input
        placeholder="Search suppliers..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10"
        aria-label="Search suppliers"
      />
    </div>
  );
};

SupplierSearchBar.propTypes = {
  /** Current search term value */
  value: PropTypes.string.isRequired,
  /** Callback when search value changes */
  onChange: PropTypes.func.isRequired,
};

export default memo(SupplierSearchBar);
