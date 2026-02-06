import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  totalItems: 0,
  allCategories: [],
  isLoading: false,
  isSaving: false,
  isDeleting: false,
  error: null,
  lastFetched: null,
  
  // Search
  searchTerm: '',
  
  // Pagination
  currentPage: 1,
  pageSize: 10,
  
  // UI State
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  editingCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    fetchCategoriesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload.data;
      state.totalItems = action.payload.totalItems;
      state.lastFetched = Date.now();
    },
    fetchCategoriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // All Categories (for validation/dropdowns)
    setAllCategories: (state, action) => {
      state.allCategories = action.payload;
    },
    
    // Search & Pagination
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
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
    setAddDialogOpen: (state, action) => {
      state.isAddDialogOpen = action.payload;
    },
    setEditDialogOpen: (state, action) => {
      state.isEditDialogOpen = action.payload;
    },
    setEditingCategory: (state, action) => {
      state.editingCategory = action.payload;
    },
    
    resetCategoriesState: (state) => initialState
  },
});

export const {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  setAllCategories,
  setSearchTerm,
  setCurrentPage,
  setPageSize,
  setSaving,
  setDeleting,
  setAddDialogOpen,
  setEditDialogOpen,
  setEditingCategory,
  resetCategoriesState
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
