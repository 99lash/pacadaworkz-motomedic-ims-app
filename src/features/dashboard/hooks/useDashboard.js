/**
 * useDashboard Hook
 * 
 * Custom hook that encapsulates all dashboard-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dashboardService } from '../services';
import {
  calculateSalesTrend,
  calculateTopProducts,
  calculateRevenueByCategory,
  DAYS_TO_SHOW,
} from '../utils';

export const useDashboard = (user) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [isLoading, setIsLoading] = useState(true);
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
  const [recentActivities, setRecentActivities] = useState([]);

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadDashboardData = useCallback(() => {
    setIsLoading(true);
    try {
      // Load all data
      const products = dashboardService.fetchProducts();
      const transactions = dashboardService.fetchTransactions();
      const users = dashboardService.fetchUsers();
      const categories = dashboardService.fetchCategories();
      const logs = dashboardService.fetchActivityLogs();

      // Filter completed sales transactions
      const completedTransactions = transactions.filter(
        (t) => t.type === 'sale' && t.status === 'completed'
      );

      // Calculate basic stats
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.total, 0);
      const totalSales = completedTransactions.reduce(
        (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
      );
      const lowStockCount = products.filter(
        (p) => p.currentStock <= p.reorderPoint && p.currentStock > 0
      ).length;
      const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
      const activeUsers = users.filter((u) => u.isActive).length;
      const inventoryValue = products.reduce(
        (sum, p) => sum + p.currentStock * p.costPrice,
        0
      );

      setStats({
        totalProducts: products.length,
        totalSales,
        totalRevenue,
        lowStockCount,
        outOfStockCount,
        totalTransactions: completedTransactions.length,
        activeUsers,
        inventoryValue,
      });

      // Calculate derived data
      setTopProducts(calculateTopProducts(completedTransactions, products));
      setRevenueByCategory(calculateRevenueByCategory(completedTransactions, products, categories));
      setSalesTrend(calculateSalesTrend(completedTransactions, DAYS_TO_SHOW));

      // Get recent activities (filtered by user role)
      const userLogs =
        user?.role === 'staff' ? logs.filter((log) => log.userId === user.id) : logs;
      setRecentActivities(userLogs.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const isAdminOrSuper = useMemo(
    () => user?.role === 'admin' || user?.role === 'superadmin',
    [user]
  );

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Data
    stats,
    topProducts,
    revenueByCategory,
    salesTrend,
    recentActivities,
    isLoading,

    // Computed
    isAdminOrSuper,

    // Actions
    refreshData: loadDashboardData,
  };
};

export default useDashboard;

