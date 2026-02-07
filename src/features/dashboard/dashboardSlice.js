import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalTransactions: 0,
    activeUsers: 0,
    inventoryValue: 0,
  },
  topProducts: [],
  revenueByCategory: [],
  salesTrend: [],
  inventoryOverview: null,
  recentActivities: [],
  isLoading: false,
  error: null,
  lastFetched: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.topProducts = action.payload.topProducts;
      state.revenueByCategory = action.payload.revenueByCategory;
      state.salesTrend = action.payload.salesTrend;
      state.inventoryOverview = action.payload.inventoryOverview;
      state.recentActivities = action.payload.recentActivities;
      state.lastFetched = Date.now();
    },
    fetchDashboardFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    resetDashboardState: (state) => {
      return initialState;
    }
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchDashboardFailure,
  resetDashboardState
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
