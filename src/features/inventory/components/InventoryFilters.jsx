import React from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { UI_TEXT } from '../utils';

const InventoryFilters = ({ searchTerm, statusFilter, statusFilters, onSearchChange, onStatusFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
    <Select value={statusFilter} onValueChange={onStatusFilterChange}>
      <SelectTrigger className="w-full sm:w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusFilters.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

InventoryFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  statusFilters: PropTypes.array.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onStatusFilterChange: PropTypes.func.isRequired,
};

export default InventoryFilters;

