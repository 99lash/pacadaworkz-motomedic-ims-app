import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // Pagination
  pagination: null,
  currentPage: 1,
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedBrand: null,
  brandToDelete: null,
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    fetchBrandsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBrandsSuccess: (state, action) => {
      state.isLoading = false;
      state.brands = action.payload.data;
      state.pagination = action.payload.pagination;
      state.lastFetched = Date.now();
    },
    fetchBrandsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // UI Actions
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setFormOpen: (state, action) => {
      state.isFormOpen = action.payload;
    },
    setDeleteOpen: (state, action) => {
      state.isDeleteOpen = action.payload;
    },
    setFormMode: (state, action) => {
      state.formMode = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    setBrandToDelete: (state, action) => {
      state.brandToDelete = action.payload;
    },
    
    resetBrandsState: (state) => initialState
  },
});

export const {
  fetchBrandsStart,
  fetchBrandsSuccess,
  fetchBrandsFailure,
  setCurrentPage,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedBrand,
  setBrandToDelete,
  resetBrandsState
} = brandsSlice.actions;

export default brandsSlice.reducer;
