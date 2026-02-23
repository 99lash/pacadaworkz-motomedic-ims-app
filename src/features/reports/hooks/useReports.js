/**
 * useReports Hook
 * 
 * Custom hook that encapsulates all reports-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { reportsService } from '../services';
import { productService } from '../../products/services';
import { REPORT_TYPES, DATE_RANGE_TYPES, getDateRangeFilter, filterByDateRange } from '../utils';

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
  const [products] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const isLoadingDataRef = useRef(false);

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
    if (isLoadingDataRef.current) return;
    isLoadingDataRef.current = true;
    setIsLoading(true);
    
    // Reset all data to defaults to prevent stale data display
    setSalesData(DEFAULT_SALES_DATA);
    setPurchaseData(DEFAULT_PURCHASE_DATA);
    setInventoryData(DEFAULT_INVENTORY_DATA);
    setProductPerformanceData(DEFAULT_PERFORMANCE_DATA);
    setStockAdjustmentData(DEFAULT_STOCK_ADJUSTMENT_DATA);
    setProfitLossData(DEFAULT_PROFIT_LOSS_DATA);

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
          const [reportData, rawInventory] = await Promise.all([
            reportsService.fetchInventoryReport(startDate, endDate),
            reportsService.fetchRawInventory()
          ]);

          const mappedInventory = (rawInventory || []).map(item => ({
            id: item.id,
            name: item.product_name,
            sku: item.sku,
            currentStock: Number(item.quantity) || 0,
            reorderPoint: Number(item.reorder_level) || 0,
          }));

          const lowStockItems = mappedInventory.filter(item => 
            item.currentStock > 0 && item.currentStock <= item.reorderPoint
          );
          const outOfStockItems = mappedInventory.filter(item => 
            item.currentStock <= 0
          );

          setInventoryData({
            totalProducts: Number(reportData.total_products) || 0,
            lowStock: Number(reportData.low_stock) || 0,
            outOfStock: Number(reportData.out_of_stock) || 0,
            overStock: 0,
            totalValue: Number(reportData.total_value) || 0,
            lowStockItems,
            outOfStockItems,
            overStockItems: [],
          });
          break;
        }
        case REPORT_TYPES.PRODUCT_PERFORMANCE: {
          const [data, dashboardTopProducts, allProducts] = await Promise.all([
            reportsService.fetchProductPerformanceReport(startDate, endDate),
            reportsService.fetchDashboardTopProducts(),
            productService.fetchProducts()
          ]);
          
          // Transform array to object for charts
          const revenueByCategory = (data.revenue_by_category || []).reduce((acc, curr) => {
            acc[curr.name] = Number(curr.total) || 0;
            return acc;
          }, {});

          const revenueByBrand = (data.revenue_by_brand || []).reduce((acc, curr) => {
            acc[curr.name] = Number(curr.total) || 0;
            return acc;
          }, {});

          // Map dashboard top products (quantity) to revenue using product price
          const topProducts = Object.entries(dashboardTopProducts || {}).map(([name, quantity]) => {
            const product = (allProducts.data || []).find(p => p.name === name);
            const price = product ? (Number(product.sellingPrice) || 0) : 0;
            return {
              id: product?.id || name, // Use name as fallback ID if product not found
              productName: name,
              quantity: Number(quantity),
              revenue: Number(quantity) * price
            };
          }).sort((a, b) => b.revenue - a.revenue).slice(0, 10); // Top 10 by revenue

          setProductPerformanceData({
            topProducts,
            worstProducts: [], // Not provided by backend
            revenueByCategory,
            revenueByBrand,
          });
          break;
        }
        case REPORT_TYPES.STOCK_ADJUSTMENT: {
          const [reportData, rawAdjustments] = await Promise.all([
            reportsService.fetchStockAdjustmentReport(startDate, endDate),
            reportsService.fetchRawStockAdjustments()
          ]);
          
          const adjustmentByReason = (reportData.adjustments_by_reason || []).reduce((acc, curr) => {
            acc[curr.reason] = Number(curr.num_reasons) || 0;
            return acc;
          }, {});

          // Filter adjustments by selected date range
          const filteredAdjustments = (rawAdjustments || [])
            .filter(adj => filterByDateRange(adj.created_at, dateRange, customStartDate, customEndDate))
            .map(adj => ({
              id: adj.id,
              productName: adj.product_name,
              adjustmentQuantity: Number(adj.quantity) || 0,
              reason: adj.reason,
              userName: adj.user_name || 'System',
              createdAt: adj.created_at,
            }));

          setStockAdjustmentData({
            totalAdjustments: Number(reportData.total_adjustments) || 0,
            adjustmentByReason,
            adjustmentByStaff: {}, // Not provided by backend
            adjustmentValue: Number(reportData.adjustments_value) || 0,
            adjustments: filteredAdjustments,
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
      isLoadingDataRef.current = false;
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
