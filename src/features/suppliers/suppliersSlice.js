import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: [],
  isLoading: false,
  isSaving: false,
  error: null,
  lastFetched: null,
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  selectedSupplier: null,
  supplierToDelete: null,
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    fetchSuppliersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuppliersSuccess: (state, action) => {
      state.isLoading = false;
      state.suppliers = action.payload;
      state.lastFetched = Date.now();
    },
    fetchSuppliersFailure: (state, action) => {
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
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setSelectedSupplier: (state, action) => {
      state.selectedSupplier = action.payload;
    },
    setSupplierToDelete: (state, action) => {
      state.supplierToDelete = action.payload;
    },
    
    resetSuppliersState: (state) => initialState
  },
});

export const {
  fetchSuppliersStart,
  fetchSuppliersSuccess,
  fetchSuppliersFailure,
  setFormOpen,
  setDeleteOpen,
  setSaving,
  setSelectedSupplier,
  setSupplierToDelete,
  resetSuppliersState
} = suppliersSlice.actions;

export default suppliersSlice.reducer;
