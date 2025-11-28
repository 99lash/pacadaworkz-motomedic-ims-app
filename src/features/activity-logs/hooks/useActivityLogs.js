/**
 * useActivityLogs Hook
 * 
 * Custom hook that encapsulates all activity logs-related state management
 * and business logic. Separates concerns from UI components.
 * 
 * Features:
 * - Data fetching and filtering
 * - Search functionality
 * - Module filtering
 * - Role-based access control
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { activityLogsService } from '../services';
import { filterLogs, getUniqueModules, filterLogsByUserRole } from '../utils';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Activity logs management hook
 * @param {Object} user - User object with id and role
 * @returns {Object} Activity logs state and handlers
 */
export const useActivityLogs = (user) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModule, setFilterModule] = useState('');

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const loadLogs = () => {
      try {
        setIsLoading(true);
        const allLogs = activityLogsService.fetchActivityLogs();
        
        // Filter logs based on user role
        const filteredLogs = filterLogsByUserRole(allLogs, user);
        
        setLogs(filteredLogs);
      } catch (error) {
        console.error('Error loading activity logs:', error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [user]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  // Get unique modules from logs
  const modules = useMemo(() => {
    return getUniqueModules(logs);
  }, [logs]);

  // Filter logs based on search and module filter
  const filteredLogs = useMemo(() => {
    return filterLogs(logs, searchTerm, filterModule);
  }, [logs, searchTerm, filterModule]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleModuleFilterChange = useCallback((value) => {
    setFilterModule(value);
  }, []);

  const refreshLogs = useCallback(() => {
    try {
      const allLogs = activityLogsService.fetchActivityLogs();
      const filteredLogs = filterLogsByUserRole(allLogs, user);
      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error refreshing activity logs:', error);
    }
  }, [user]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Data
    logs,
    filteredLogs,
    isLoading,

    // Filters
    searchTerm,
    filterModule,
    modules,

    // Handlers
    handleSearchChange,
    handleModuleFilterChange,
    refreshLogs,
  };
};

export default useActivityLogs;

