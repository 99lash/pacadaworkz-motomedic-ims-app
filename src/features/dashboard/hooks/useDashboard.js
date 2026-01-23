/**
 * useDashboard Hook
 * 
 * Custom hook that encapsulates all dashboard-related state management
 * and business logic. Fetches data from the API.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardService } from '../services';

export const useDashboard = (user) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalTransactions: 0,
    activeUsers: 0,
    inventoryValue: 0,
  });
  
  const [topProducts, setTopProducts] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [inventoryOverview, setInventoryOverview] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const isAdminOrSuper = useMemo(
    () => user?.role === 'admin' || user?.role === 'superadmin',
    [user]
  );

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare promises for parallel execution
      const promises = [
        dashboardService.fetchStats(),
        dashboardService.fetchSalesTrend(), // defaults to 'week'
        dashboardService.fetchTopProducts(),
      ];

      // Add admin-only calls
      if (isAdminOrSuper) {
        promises.push(dashboardService.fetchRevenueByCategory());
        promises.push(dashboardService.fetchInventoryOverview());
      }

      const results = await Promise.all(promises);

      const [statsRes, salesTrendRes, topProductsRes, revenueRes, inventoryRes] = results;

      // Handle Stats
      if (statsRes && statsRes.success) {
        const rawStats = statsRes.data || {};
        // Map snake_case from API to camelCase for UI
        const mappedStats = {
          totalProducts: rawStats.total_products ?? rawStats.totalProducts ?? 0,
          totalSales: rawStats.total_sales ?? rawStats.totalSales ?? 0,
          totalRevenue: rawStats.total_revenue ?? rawStats.totalRevenue ?? 0,
          lowStockCount: rawStats.low_stock_count ?? rawStats.lowStockCount ?? 0,
          outOfStockCount: rawStats.out_of_stock_count ?? rawStats.outOfStockCount ?? 0,
          totalTransactions: rawStats.total_transactions ?? rawStats.totalTransactions ?? 0,
          activeUsers: rawStats.active_users ?? rawStats.activeUsers ?? 0,
          inventoryValue: rawStats.inventory_value ?? rawStats.inventoryValue ?? 0,
        };
        setStats(prev => ({ ...prev, ...mappedStats }));
      } else if (statsRes) {
        console.error('Failed to fetch stats:', statsRes.error);
      }

      // Handle Sales Trend
      if (salesTrendRes && salesTrendRes.success) {
        const rawData = salesTrendRes.data || {};
        if (Array.isArray(rawData)) {
          setSalesTrend(rawData);
        } else if (typeof rawData === 'object' && rawData !== null) {
          // Transform { "2023-01-01": 100 } to [{ date: "2023-01-01", sales: 100 }]
          const transformed = Object.entries(rawData).map(([date, amount]) => ({
            date,
            sales: amount
          }));
          setSalesTrend(transformed);
        } else {
          setSalesTrend([]);
        }
      }

      // Handle Top Products
      if (topProductsRes && topProductsRes.success) {
        const rawData = topProductsRes.data || {};
        if (Array.isArray(rawData)) {
          setTopProducts(rawData);
        } else if (typeof rawData === 'object' && rawData !== null) {
          // Transform { "Product A": 10 } to [{ name: "Product A", sales: 10 }]
          const transformed = Object.entries(rawData).map(([name, count]) => ({
            name,
            sales: count
          }));
          setTopProducts(transformed);
        } else {
          setTopProducts([]);
        }
      }

      // Handle Admin Data
      if (isAdminOrSuper) {
        if (revenueRes && revenueRes.success) {
          const rawData = revenueRes.data || {};
          if (Array.isArray(rawData)) {
            setRevenueByCategory(rawData);
          } else if (typeof rawData === 'object' && rawData !== null) {
            // Transform { "Category A": 100 } to [{ name: "Category A", value: 100 }]
            const transformed = Object.entries(rawData).map(([name, value]) => ({
              name,
              value
            }));
            setRevenueByCategory(transformed);
          } else {
            setRevenueByCategory([]);
          }
        }
        if (inventoryRes && inventoryRes.success) {
          setInventoryOverview(inventoryRes.data);
        }
      }

      // TODO: Implement fetchRecentActivities when endpoint is available
      // For now, we leave it empty or mock it if strictly necessary, 
      // but keeping it empty is safer than using broken local storage logic.
      setRecentActivities([]);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdminOrSuper]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Data
    stats,
    topProducts,
    revenueByCategory,
    salesTrend,
    inventoryOverview,
    recentActivities,
    
    // Status
    isLoading,
    error,

    // Computed
    isAdminOrSuper,

    // Actions
    refreshData: loadDashboardData,
  };
};

export default useDashboard;