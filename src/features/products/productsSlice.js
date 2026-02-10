import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  totalItems: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // Filters
  searchTerm: '',
  selectedCategory: 'all',
  selectedBrand: 'all',
  filterOptions: {
    categories: [],
    brands: [],
  },
  
  // UI State
  isSaving: false,
  isDeleting: false,
  isExporting: false,
  isFormDialogOpen: false,
  editingProduct: null,
  
  // Pagination
  currentPage: 1,
  pageSize: 10,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.totalItems = action.payload.totalItems;
      state.lastFetched = Date.now();
    },
    fetchProductsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Filters & Options
    setFilterOptions: (state, action) => {
      state.filterOptions = {
        ...state.filterOptions,
        ...action.payload,
      };
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedBrand: (state, action) => {
      state.selectedBrand = action.payload;
    },
    
    // Pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    
    // UI Actions
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    setDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    setExporting: (state, action) => {
      state.isExporting = action.payload;
    },
    setFormDialogOpen: (state, action) => {
      state.isFormDialogOpen = action.payload;
    },
    setEditingProduct: (state, action) => {
      state.editingProduct = action.payload;
    },
    
    resetProductsState: (state) => {
      return initialState;
    }
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setFilterOptions,
  setSearchTerm,
  setSelectedCategory,
  setSelectedBrand,
  setCurrentPage,
  setPageSize,
  setSaving,
  setDeleting,
  setExporting,
  setFormDialogOpen,
  setEditingProduct,
  resetProductsState
} = productsSlice.actions;

export default productsSlice.reducer;
