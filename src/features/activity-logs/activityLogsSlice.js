import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logs: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  searchTerm: '',
  filterModule: '',
};

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    fetchLogsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchLogsSuccess: (state, action) => {
      state.isLoading = false;
      state.logs = action.payload;
      state.lastFetched = Date.now();
    },
    fetchLogsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setFilterModule: (state, action) => {
      state.filterModule = action.payload;
    },
    resetActivityLogsState: (state) => initialState
  },
});

export const {
  fetchLogsStart,
  fetchLogsSuccess,
  fetchLogsFailure,
  setSearchTerm,
  setFilterModule,
  resetActivityLogsState
} = activityLogsSlice.actions;

export default activityLogsSlice.reducer;
