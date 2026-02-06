import { createSlice } from '@reduxjs/toolkit';
import { REPORT_TYPES, DATE_RANGE_TYPES } from './utils';

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

const initialState = {
  // Filters
  reportType: REPORT_TYPES.SALES,
  dateRange: DATE_RANGE_TYPES.MONTHLY,
  customStartDate: '',
  customEndDate: '',
  
  // Data
  salesData: DEFAULT_SALES_DATA,
  purchaseData: DEFAULT_PURCHASE_DATA,
  inventoryData: DEFAULT_INVENTORY_DATA,
  productPerformanceData: DEFAULT_PERFORMANCE_DATA,
  stockAdjustmentData: DEFAULT_STOCK_ADJUSTMENT_DATA,
  profitLossData: DEFAULT_PROFIT_LOSS_DATA,
  
  isLoading: false,
  error: null,
  lastFetched: null,
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    fetchReportStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchReportSuccess: (state, action) => {
      state.isLoading = false;
      // We update specific report data based on payload key
      if (action.payload.salesData) state.salesData = action.payload.salesData;
      if (action.payload.purchaseData) state.purchaseData = action.payload.purchaseData;
      if (action.payload.inventoryData) state.inventoryData = action.payload.inventoryData;
      if (action.payload.productPerformanceData) state.productPerformanceData = action.payload.productPerformanceData;
      if (action.payload.stockAdjustmentData) state.stockAdjustmentData = action.payload.stockAdjustmentData;
      if (action.payload.profitLossData) state.profitLossData = action.payload.profitLossData;
      
      state.lastFetched = Date.now();
    },
    fetchReportFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Filter Actions
    setReportType: (state, action) => {
      state.reportType = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setCustomStartDate: (state, action) => {
      state.customStartDate = action.payload;
    },
    setCustomEndDate: (state, action) => {
      state.customEndDate = action.payload;
    },
    
    // Reset Data (useful when switching report types to show loading state cleanly)
    resetReportData: (state) => {
      state.salesData = DEFAULT_SALES_DATA;
      state.purchaseData = DEFAULT_PURCHASE_DATA;
      state.inventoryData = DEFAULT_INVENTORY_DATA;
      state.productPerformanceData = DEFAULT_PERFORMANCE_DATA;
      state.stockAdjustmentData = DEFAULT_STOCK_ADJUSTMENT_DATA;
      state.profitLossData = DEFAULT_PROFIT_LOSS_DATA;
    },
    
    resetReportsState: (state) => initialState
  },
});

export const {
  fetchReportStart,
  fetchReportSuccess,
  fetchReportFailure,
  setReportType,
  setDateRange,
  setCustomStartDate,
  setCustomEndDate,
  resetReportData,
  resetReportsState
} = reportsSlice.actions;

export default reportsSlice.reducer;
