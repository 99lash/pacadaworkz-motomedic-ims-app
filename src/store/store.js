// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
// Kailangan mong i-import ang mga slice dito

export const store = configureStore({
  reducer: {
    // Ilalagay dito ang mga reducers, halimbawa:
    // auth: authReducer, 
  },
});