/**
 * useReports Hook
 * 
 * Custom hook that encapsulates all reports-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback } from 'react';
import { reportsService } from '../services';
import { REPORT_TYPES, DATE_RANGE_TYPES, getDateRangeFilter } from '../utils';

// Default initial states to prevent UI crashes
const DEFAULT_SALES_DATA = {
  totalSales: 0,
  totalRevenue: 0,
  transactionCount: 0,
  salesByStaff: {},
  trendData: [],
};

const DEFAULT_PURCHASE_DATA = {
  totalPurchases: 0,
  poCount: 0,
  purchaseBySupplier: {},
  trendData: [],
};

const DEFAULT_INVENTORY_DATA = {
  totalProducts: 0,
  lowStock: 0,
  outOfStock: 0,
  overStock: 0,
  totalValue: 0,
  lowStockItems: [],
  outOfStockItems: [],
  overStockItems: [],
};

const DEFAULT_PERFORMANCE_DATA = {
  topProducts: [],
  worstProducts: [],
  revenueByCategory: {},
  revenueByBrand: {},
};

const DEFAULT_STOCK_ADJUSTMENT_DATA = {
  totalAdjustments: 0,
  adjustmentByReason: {},
  adjustmentByStaff: {},
  adjustmentValue: 0,
  adjustments: [],
};

const DEFAULT_PROFIT_LOSS_DATA = {
  revenue: 0,
  cogs: 0,
  grossProfit: 0,
  adjustmentLosses: 0,
  netProfit: 0,
  profitMargin: 0,
};

export const useReports = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [reportType, setReportType] = useState(REPORT_TYPES.SALES);
  const [dateRange, setDateRange] = useState(DATE_RANGE_TYPES.MONTHLY);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const [salesData, setSalesData] = useState(DEFAULT_SALES_DATA);
  const [purchaseData, setPurchaseData] = useState(DEFAULT_PURCHASE_DATA);
  const [inventoryData, setInventoryData] = useState(DEFAULT_INVENTORY_DATA);
  const [productPerformanceData, setProductPerformanceData] = useState(DEFAULT_PERFORMANCE_DATA);
  const [stockAdjustmentData, setStockAdjustmentData] = useState(DEFAULT_STOCK_ADJUSTMENT_DATA);
  const [profitLossData, setProfitLossData] = useState(DEFAULT_PROFIT_LOSS_DATA);

  // Products state is kept for potential future use or if we decide to fetch it alongside
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  const formatDateForApi = (date) => {
    if (!date) return null;
    const d = new Date(date);
    // Format to YYYY-MM-DD, handling timezone offset if necessary, 
    // or just use local date components to avoid shifting
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { start, end } = getDateRangeFilter(dateRange, customStartDate, customEndDate);
      const startDate = formatDateForApi(start);
      const endDate = formatDateForApi(end);

      switch (reportType) {
        case REPORT_TYPES.SALES: {
          const data = await reportsService.fetchSalesReport(startDate, endDate);
          setSalesData({
            totalSales: Number(data.total_sales) || 0,
            totalRevenue: Number(data.total_sales) || 0,
            transactionCount: Number(data.transactions) || 0,
            salesByStaff: {}, // Not provided by backend
            trendData: (data.trend || []).map(t => ({
              date: t.date,
              sales: Number(t.total) || 0
            })),
          });
          break;
        }
        case REPORT_TYPES.PURCHASE: {
          const data = await reportsService.fetchPurchaseReport(startDate, endDate);
          setPurchaseData({
            totalPurchases: Number(data.total_purchases) || 0,
            poCount: Number(data.purchase_orders) || 0,
            purchaseBySupplier: {}, // Not provided by backend
            trendData: (data.trend || []).map(t => ({
              date: t.date,
              cost: Number(t.total) || 0
            })),
          });
          break;
        }
        case REPORT_TYPES.INVENTORY: {
          const data = await reportsService.fetchInventoryReport(startDate, endDate);
          setInventoryData({
            totalProducts: Number(data.total_products) || 0,
            lowStock: Number(data.low_stock) || 0,
            outOfStock: Number(data.out_of_stock) || 0,
            overStock: 0, // Not provided by backend
            totalValue: Number(data.total_value) || 0,
            lowStockItems: [], // Not provided by backend report endpoint
            outOfStockItems: [], // Not provided by backend report endpoint
            overStockItems: [], // Not provided by backend
          });
          break;
        }
        case REPORT_TYPES.PRODUCT_PERFORMANCE: {
          const data = await reportsService.fetchProductPerformanceReport(startDate, endDate);
          
          // Transform array to object for charts
          const revenueByCategory = (data.revenue_by_category || []).reduce((acc, curr) => {
            acc[curr.name] = Number(curr.total) || 0;
            return acc;
          }, {});

          const revenueByBrand = (data.revenue_by_brand || []).reduce((acc, curr) => {
            acc[curr.name] = Number(curr.total) || 0;
            return acc;
          }, {});

          setProductPerformanceData({
            topProducts: [], // Not provided by backend
            worstProducts: [], // Not provided by backend
            revenueByCategory,
            revenueByBrand,
          });
          break;
        }
        case REPORT_TYPES.STOCK_ADJUSTMENT: {
          const data = await reportsService.fetchStockAdjustmentReport(startDate, endDate);
          
          const adjustmentByReason = (data.adjustments_by_reason || []).reduce((acc, curr) => {
            acc[curr.reason] = Number(curr.num_reasons) || 0;
            return acc;
          }, {});

          setStockAdjustmentData({
            totalAdjustments: Number(data.total_adjustments) || 0,
            adjustmentByReason,
            adjustmentByStaff: {}, // Not provided by backend
            adjustmentValue: Number(data.adjustments_value) || 0,
            adjustments: [], // Not provided by backend
          });
          break;
        }
        case REPORT_TYPES.PROFIT_LOSS: {
          const data = await reportsService.fetchProfitLossReport(startDate, endDate);
          setProfitLossData({
            revenue: Number(data.revenue) || 0,
            cogs: Number(data.cost_of_goods) || 0,
            grossProfit: Number(data.gross_profit) || 0,
            adjustmentLosses: Number(data.adjustment_loss) || 0,
            netProfit: Number(data.net_profit) || 0,
            profitMargin: Number(data.profit_margin) || 0,
          });
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading reports data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [reportType, dateRange, customStartDate, customEndDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const exportCurrentReport = useCallback(async () => {
    try {
      const { start, end } = getDateRangeFilter(dateRange, customStartDate, customEndDate);
      const startDate = formatDateForApi(start);
      const endDate = formatDateForApi(end);

      const blob = await reportsService.exportReport(reportType, startDate, endDate);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${startDate}_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  }, [reportType, dateRange, customStartDate, customEndDate]);

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
    products, // Kept empty for now
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
    exportCurrentReport,
    refreshData: loadData,
  };
};

export default useReports;

