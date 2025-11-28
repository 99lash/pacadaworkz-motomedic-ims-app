/**
 * ActivityLogsFilters Component
 * 
 * Filter controls for searching and filtering activity logs by module.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ActivityLogsFilters displays search and module filter controls
 */
const ActivityLogsFilters = ({
  searchTerm,
  filterModule,
  modules,
  onSearchChange,
  onModuleFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
          aria-hidden="true"
        />
        <Input
          type="text"
          placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search activity logs"
        />
      </div>

      {/* Module Filter */}
      <Select value={filterModule || ''} onValueChange={onModuleFilterChange}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Filter by module">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{UI_TEXT.FILTER_ALL_MODULES}</SelectItem>
          {modules.map((module) => (
            <SelectItem key={module} value={module}>
              {module}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ActivityLogsFilters.propTypes = {
  /** Current search term */
  searchTerm: PropTypes.string.isRequired,
  /** Current module filter value */
  filterModule: PropTypes.string.isRequired,
  /** Available modules for filtering */
  modules: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Callback when search term changes */
  onSearchChange: PropTypes.func.isRequired,
  /** Callback when module filter changes */
  onModuleFilterChange: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ActivityLogsFilters);

