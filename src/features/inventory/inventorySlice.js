import { createSlice } from '@reduxjs/toolkit';
import { STATUS_FILTERS, UI_TEXT } from './utils';

const initialState = {
  inventory: [],
  filteredInventory: [], // We can keep filtered state in Redux or compute in hook. Storing in Redux for persistence.
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // Filters
  searchTerm: '',
  statusFilter: UI_TEXT.STATUS_ALL,
  statusFilters: STATUS_FILTERS,
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
      state.inventory = action.payload;
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
  updateInventoryItem,
  resetInventoryState
} = inventorySlice.actions;

export default inventorySlice.reducer;
