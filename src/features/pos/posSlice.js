import { createSlice } from '@reduxjs/toolkit';
import { PAYMENT_METHODS } from './utils';

const initialState = {
  products: [],
  categories: [],
  brands: [],
  cart: [],
  isLoading: false,
  isCartLoading: false,
  error: null,
  lastFetched: null,
  
  // UI State
  searchTerm: '',
  selectedCategoryIds: [],
  discount: 0,
  discountType: 'fixed',
  paymentMethod: PAYMENT_METHODS.CASH,
  amountPaid: 0,
  showCheckout: false,
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    fetchPosDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPosDataSuccess: (state, action) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.categories = action.payload.categories;
      state.brands = action.payload.brands;
      state.lastFetched = Date.now();
    },
    fetchPosDataFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Cart Actions
    setCartLoading: (state, action) => {
      state.isCartLoading = action.payload;
    },
    updateCart: (state, action) => {
      state.cart = action.payload;
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
    },
    
    // UI Actions
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategoryIds: (state, action) => {
      state.selectedCategoryIds = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setDiscountType: (state, action) => {
      state.discountType = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setAmountPaid: (state, action) => {
      state.amountPaid = action.payload;
    },
    setShowCheckout: (state, action) => {
      state.showCheckout = action.payload;
    },
    resetPosState: (state) => {
      return initialState;
    }
  },
});

export const {
  fetchPosDataStart,
  fetchPosDataSuccess,
  fetchPosDataFailure,
  setCartLoading,
  updateCart,
  updateProducts,
  setSearchTerm,
  setSelectedCategoryIds,
  setDiscount,
  setDiscountType,
  setPaymentMethod,
  setAmountPaid,
  setShowCheckout,
  resetPosState
} = posSlice.actions;

export default posSlice.reducer;
