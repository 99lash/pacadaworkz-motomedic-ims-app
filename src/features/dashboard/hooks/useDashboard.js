/**
 * useDashboard Hook
 * 
 * Custom hook that encapsulates all dashboard-related state management
 * and business logic. Fetches data from the API and manages state via Redux.
 */

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardService } from '../services';
import { 
  fetchDashboardStart, 
  fetchDashboardSuccess, 
  fetchDashboardFailure 
} from '../dashboardSlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDashboard = (user, userRole) => {
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);
  
  // Select state from Redux
  const {
    stats,
    topProducts,
    revenueByCategory,
    salesTrend,
    inventoryOverview,
    recentActivities,
    isLoading,
    error,
    lastFetched
  } = useSelector((state) => state.dashboard);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const isAdminOrSuper = useMemo(
    () => userRole === 'admin' || userRole === 'superadmin',
    [userRole]
  );

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadDashboardData = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    if (isFetchingRef.current) {
      return;
    }
    isFetchingRef.current = true;

    dispatch(fetchDashboardStart());

    try {
      // Prepare promises for parallel execution
      const promises = [
        dashboardService.fetchStats(),
        dashboardService.fetchSalesTrend(), // defaults to 'week'
        dashboardService.fetchTopProducts(),
        dashboardService.fetchRecentActivities(),
      ];

      // Add admin-only calls
      if (isAdminOrSuper) {
        promises.push(dashboardService.fetchRevenueByCategory());
        promises.push(dashboardService.fetchInventoryOverview());
      }

      const results = await Promise.all(promises);

      const [statsRes, salesTrendRes, topProductsRes, activitiesRes, revenueRes, inventoryRes] = results;

      // Process Data
      const newRecentActivities = (activitiesRes && activitiesRes.success) ? (activitiesRes.data || []) : [];
      
      let newStats = {};
      if (statsRes && statsRes.success) {
        const rawStats = statsRes.data || {};
        newStats = {
          totalProducts: rawStats.total_products ?? rawStats.totalProducts ?? 0,
          totalSales: rawStats.total_sales ?? rawStats.totalSales ?? 0,
          totalRevenue: rawStats.total_revenue ?? rawStats.totalRevenue ?? 0,
          lowStockCount: rawStats.low_stock ?? rawStats.lowStockCount ?? 0,
          outOfStockCount: rawStats.out_of_stock ?? rawStats.outOfStock ?? 0,
          totalTransactions: rawStats.total_transactions ?? rawStats.totalTransactions ?? 0,
          activeUsers: rawStats.active_users ?? rawStats.activeUsers ?? 0,
          inventoryValue: (inventoryRes?.data?.total_inventory_value ?? inventoryRes?.data?.totalInventoryValue ?? 0),
        };
      } else if (statsRes) {
        console.error('Failed to fetch stats:', statsRes.error);
      }

      let newSalesTrend = [];
      if (salesTrendRes && salesTrendRes.success) {
        const rawData = salesTrendRes.data || {};
        if (Array.isArray(rawData)) {
          newSalesTrend = rawData;
        } else if (typeof rawData === 'object' && rawData !== null) {
          newSalesTrend = Object.entries(rawData).map(([date, amount]) => ({
            date,
            sales: amount
          }));
        }
      }

      let newTopProducts = [];
      if (topProductsRes && topProductsRes.success) {
        const rawData = topProductsRes.data || {};
        if (Array.isArray(rawData)) {
          newTopProducts = rawData;
        } else if (typeof rawData === 'object' && rawData !== null) {
          newTopProducts = Object.entries(rawData).map(([name, count]) => ({
            name,
            sales: count
          }));
        }
      }

      let newRevenueByCategory = [];
      let newInventoryOverview = null;

      if (isAdminOrSuper) {
        if (revenueRes && revenueRes.success) {
          const rawData = revenueRes.data || {};
          if (Array.isArray(rawData)) {
            newRevenueByCategory = rawData.map(item => ({
              name: item.name || item.category || item.category_name || 'Unknown Category',
              value: Number(item.value || item.revenue || item.total_revenue || item.total || 0)
            }));
          } else if (typeof rawData === 'object' && rawData !== null) {
            newRevenueByCategory = Object.entries(rawData).map(([name, value]) => ({
              name,
              value: Number(value)
            }));
          }
        }
        if (inventoryRes && inventoryRes.success) {
          newInventoryOverview = inventoryRes.data;
        }
      }

      dispatch(fetchDashboardSuccess({
        stats: newStats,
        topProducts: newTopProducts,
        revenueByCategory: newRevenueByCategory,
        salesTrend: newSalesTrend,
        inventoryOverview: newInventoryOverview,
        recentActivities: newRecentActivities
      }));

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      dispatch(fetchDashboardFailure('Failed to load dashboard data'));
    } finally {
      isFetchingRef.current = false;
    }
  }, [user, isAdminOrSuper, dispatch]);

  useEffect(() => {
    const now = Date.now();
    if (lastFetched && (now - lastFetched < CACHE_DURATION)) {
      return;
    }
    loadDashboardData();
  }, [loadDashboardData, lastFetched]);

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
    refreshData: () => loadDashboardData(true),
  };
};

export default useDashboard;
