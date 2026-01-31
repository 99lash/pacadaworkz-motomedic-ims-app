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
import { filterLogs, getUniqueModules } from '../utils';

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
    const loadLogs = async () => {
      try {
        setIsLoading(true);
        const response = await activityLogsService.fetchActivityLogs();
        
        if (response?.success) {
          setLogs(response.data || []);
        }
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

  const refreshLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await activityLogsService.fetchActivityLogs();
      if (response?.success) {
        setLogs(response.data || []);
      }
    } catch (error) {
      console.error('Error refreshing activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

