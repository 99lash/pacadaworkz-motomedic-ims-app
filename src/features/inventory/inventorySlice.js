import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FILTERS, UI_TEXT } from './utils';

const initialState = {
  inventory: [],
  totalItems: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // Filters
  searchTerm: '',
  statusFilter: UI_TEXT.STATUS_ALL,
  statusFilters: STATUS_FILTERS,

  // Pagination
  currentPage: 1,
  pageSize: 10,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchInventoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action) => {
      state.isLoading = false;
      state.inventory = action.payload.inventory;
      state.totalItems = action.payload.totalItems;
      state.lastFetched = Date.now();
    },
    fetchInventoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Filters
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },

    // Pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    
    // Updates
    updateInventoryItem: (state, action) => {
      const updatedItem = action.payload;
      state.inventory = state.inventory.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      );
    },
    
    resetInventoryState: (state) => {
      return initialState;
    }
  },
});

export const {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  setSearchTerm,
  setStatusFilter,
  setCurrentPage,
  setPageSize,
  updateInventoryItem,
  resetInventoryState
} = inventorySlice.actions;

export default inventorySlice.reducer;
