import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attributes: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedAttribute: null,
  attributeToDelete: null,
};

const attributesSlice = createSlice({
  name: 'attributes',
  initialState,
  reducers: {
    fetchAttributesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchAttributesSuccess: (state, action) => {
      state.isLoading = false;
      state.attributes = action.payload;
      state.lastFetched = Date.now();
    },
    fetchAttributesFailure: (state, action) => {
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
    setSelectedAttribute: (state, action) => {
      state.selectedAttribute = action.payload;
    },
    setAttributeToDelete: (state, action) => {
      state.attributeToDelete = action.payload;
    },
    
    resetAttributesState: (state) => initialState
  },
});

export const {
  fetchAttributesStart,
  fetchAttributesSuccess,
  fetchAttributesFailure,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedAttribute,
  setAttributeToDelete,
  resetAttributesState
} = attributesSlice.actions;

export default attributesSlice.reducer;
