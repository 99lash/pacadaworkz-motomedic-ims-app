import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  purchaseOrders: [],
  suppliers: [],
  products: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedPurchaseOrder: null,
  purchaseOrderToDelete: null,
};

const purchasesSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    fetchPurchasesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPurchasesSuccess: (state, action) => {
      state.isLoading = false;
      state.purchaseOrders = action.payload.purchaseOrders;
      state.suppliers = action.payload.suppliers;
      state.products = action.payload.products;
      state.lastFetched = Date.now();
    },
    fetchPurchasesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // UI Actions
    setFormOpen: (state, action) => {
      state.isFormOpen = action.payload;
    },
    setDeleteOpen: (state, action) => {
      state.isDeleteOpen = action.payload;
    },
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
    setSelectedPurchaseOrder: (state, action) => {
      state.selectedPurchaseOrder = action.payload;
    },
    setPurchaseOrderToDelete: (state, action) => {
      state.purchaseOrderToDelete = action.payload;
    },
    
    resetPurchasesState: (state) => initialState
  },
});

export const {
  fetchPurchasesStart,
  fetchPurchasesSuccess,
  fetchPurchasesFailure,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedPurchaseOrder,
  setPurchaseOrderToDelete,
  resetPurchasesState
} = purchasesSlice.actions;

export default purchasesSlice.reducer;
