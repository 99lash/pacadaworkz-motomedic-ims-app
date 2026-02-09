import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'motomedic-theme';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
};

const initialState = {
  theme: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, state.theme);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, state.theme);
      }
    },
  },
});

export const { toggleTheme, setTheme } = uiSlice.actions;
export const selectTheme = (state) => state.ui.theme;
export default uiSlice.reducer;
