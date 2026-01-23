/**
 * useReports Hook
 * 
 * Custom hook that encapsulates all reports-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { reportsService } from '../services';
import { filterByDateRange, REPORT_TYPES, DATE_RANGE_TYPES } from '../utils';

export const useReports = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [reportType, setReportType] = useState(REPORT_TYPES.SALES);
  const [dateRange, setDateRange] = useState(DATE_RANGE_TYPES.MONTHLY);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [stockAdjustments, setStockAdjustments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      setTransactions(reportsService.fetchTransactions());
      setProducts(reportsService.fetchProducts());
      setPurchaseOrders(reportsService.fetchPurchaseOrders());
      setStockAdjustments(reportsService.fetchStockAdjustments());
      setCategories(reportsService.fetchCategories());
      setBrands(reportsService.fetchBrands());
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // FILTER HELPER
  // ---------------------------------------------------------------------------

  const filterByDate = useCallback(
    (date) => {
      return filterByDateRange(date, dateRange, customStartDate, customEndDate);
    },
    [dateRange, customStartDate, customEndDate]
  );

  // ---------------------------------------------------------------------------
  // SALES REPORT DATA
  // ---------------------------------------------------------------------------

  const salesData = useMemo(() => {
    const filteredSales = transactions.filter(
      (t) => t.type === 'sale' && t.status === 'completed' && filterByDate(t.date)
    );

    const totalSales = filteredSales.reduce((sum, t) => sum + t.total, 0);
    const transactionCount = filteredSales.length;

    // Group by staff
    const salesByStaff = filteredSales.reduce((acc, t) => {
      acc[t.userName] = (acc[t.userName] || 0) + t.total;
      return acc;
    }, {});

    // Group by date for trend
    const salesByDate = filteredSales.reduce((acc, t) => {
      const date = new Date(t.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + t.total;
      return acc;
    }, {});

    const trendData = Object.entries(salesByDate).map(([date, sales]) => ({
      date,
      sales,
    }));

    return {
      totalSales,
      totalRevenue: totalSales,
      transactionCount,
      salesByStaff,
      trendData,
    };
  }, [transactions, filterByDate]);

  // ---------------------------------------------------------------------------
  // PURCHASE REPORT DATA
  // ---------------------------------------------------------------------------

  const purchaseData = useMemo(() => {
    const filteredPurchases = purchaseOrders.filter((po) => filterByDate(po.createdAt));

    const totalPurchases = filteredPurchases.reduce((sum, po) => sum + po.total, 0);
    const poCount = filteredPurchases.length;

    // Group by supplier
    const purchaseBySupplier = filteredPurchases.reduce((acc, po) => {
      acc[po.supplierName] = (acc[po.supplierName] || 0) + po.total;
      return acc;
    }, {});

    // Group by date for trend
    const purchaseByDate = filteredPurchases.reduce((acc, po) => {
      const date = new Date(po.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + po.total;
      return acc;
    }, {});

    const trendData = Object.entries(purchaseByDate).map(([date, cost]) => ({
      date,
      cost,
    }));

    return {
      totalPurchases,
      poCount,
      purchaseBySupplier,
      trendData,
    };
  }, [purchaseOrders, filterByDate]);

  // ---------------------------------------------------------------------------
  // INVENTORY REPORT DATA
  // ---------------------------------------------------------------------------

  const inventoryData = useMemo(() => {
    const lowStock = products.filter((p) => p.currentStock <= p.reorderPoint);
    const outOfStock = products.filter((p) => p.currentStock === 0);
    const overStock = products.filter((p) => p.currentStock > p.reorderPoint * 3);
    const totalValue = products.reduce((sum, p) => sum + p.currentStock * p.costPrice, 0);

    return {
      totalProducts: products.length,
      lowStock: lowStock.length,
      outOfStock: outOfStock.length,
      overStock: overStock.length,
      totalValue,
      lowStockItems: lowStock,
      outOfStockItems: outOfStock,
      overStockItems: overStock,
    };
  }, [products]);

  // ---------------------------------------------------------------------------
  // PRODUCT PERFORMANCE DATA
  // ---------------------------------------------------------------------------

  const productPerformanceData = useMemo(() => {
    const filteredSales = transactions.filter(
      (t) => t.type === 'sale' && t.status === 'completed' && filterByDate(t.date)
    );

    // Sales by product
    const productSales = filteredSales.reduce((acc, t) => {
      t.items.forEach((item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        acc[item.productId].quantity += item.quantity;
        acc[item.productId].revenue += item.total;
      });
      return acc;
    }, {});

    const sortedProducts = Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    const topProducts = sortedProducts.slice(0, 10);
    const worstProducts = sortedProducts.slice(-10).reverse();

    // Revenue by category
    const revenueByCategory = filteredSales.reduce((acc, t) => {
      t.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const category = categories.find((c) => c.id === product.categoryId);
          const categoryName = category?.name || 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + item.total;
        }
      });
      return acc;
    }, {});

    // Revenue by brand
    const revenueByBrand = filteredSales.reduce((acc, t) => {
      t.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          const brand = brands.find((b) => b.id === product.brandId);
          const brandName = brand?.name || 'Unknown';
          acc[brandName] = (acc[brandName] || 0) + item.total;
        }
      });
      return acc;
    }, {});

    return {
      topProducts,
      worstProducts,
      revenueByCategory,
      revenueByBrand,
    };
  }, [transactions, products, categories, brands, filterByDate]);

  // ---------------------------------------------------------------------------
  // STOCK ADJUSTMENT DATA
  // ---------------------------------------------------------------------------

  const stockAdjustmentData = useMemo(() => {
    const filteredAdjustments = stockAdjustments.filter((adj) =>
      filterByDate(adj.createdAt)
    );

    const totalAdjustments = filteredAdjustments.length;

    // Group by reason
    const adjustmentByReason = filteredAdjustments.reduce((acc, adj) => {
      acc[adj.reason] = (acc[adj.reason] || 0) + 1;
      return acc;
    }, {});

    // Group by staff
    const adjustmentByStaff = filteredAdjustments.reduce((acc, adj) => {
      acc[adj.userName] = (acc[adj.userName] || 0) + 1;
      return acc;
    }, {});

    // Calculate value of adjustments
    const adjustmentValue = filteredAdjustments.reduce((sum, adj) => {
      const product = products.find((p) => p.id === adj.productId);
      if (product) {
        return sum + Math.abs(adj.adjustmentQuantity) * product.costPrice;
      }
      return sum;
    }, 0);

    return {
      totalAdjustments,
      adjustmentByReason,
      adjustmentByStaff,
      adjustmentValue,
      adjustments: filteredAdjustments,
    };
  }, [stockAdjustments, products, filterByDate]);

  // ---------------------------------------------------------------------------
  // PROFIT & LOSS DATA
  // ---------------------------------------------------------------------------

      const profitLossData = useMemo(() => {
        const filteredSales = transactions.filter(
          (t) => t.type === 'sale' && t.status === 'completed' && filterByDate(t.date)
        );
        const filteredAdjustments = stockAdjustments.filter((adj) => filterByDate(adj.createdAt));
    
        const revenue = filteredSales.reduce((sum, t) => sum + t.total, 0);
    
        // Calculate COGS from sales
        const cogs = filteredSales.reduce((sum, t) => {
          t.items.forEach((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (product) {
              sum += item.quantity * product.costPrice;
            }
          });
          return sum;
        }, 0);
    const grossProfit = revenue - cogs;

    // Calculate adjustment losses
    const adjustmentLosses = filteredAdjustments.reduce((sum, adj) => {
      if (adj.adjustmentQuantity < 0) {
        const product = products.find((p) => p.id === adj.productId);
        if (product) {
          return sum + Math.abs(adj.adjustmentQuantity) * product.costPrice;
        }
      }
      return sum;
    }, 0);

    const netProfit = grossProfit - adjustmentLosses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      revenue,
      cogs,
      grossProfit,
      adjustmentLosses,
      netProfit,
      profitMargin,
    };
  }, [transactions, stockAdjustments, products, filterByDate]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleReportTypeChange = useCallback((type) => {
    setReportType(type);
  }, []);

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleCustomStartDateChange = useCallback((date) => {
    setCustomStartDate(date);
  }, []);

  const handleCustomEndDateChange = useCallback((date) => {
    setCustomEndDate(date);
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // State
    reportType,
    dateRange,
    customStartDate,
    customEndDate,
    isLoading,

    // Data
    products,
    salesData,
    purchaseData,
    inventoryData,
    productPerformanceData,
    stockAdjustmentData,
    profitLossData,

    // Handlers
    handleReportTypeChange,
    handleDateRangeChange,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
    refreshData: loadData,
  };
};

export default useReports;

