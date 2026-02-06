import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // Search
  searchTerm: '',
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedUser: null,
  userToDelete: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
      state.lastFetched = Date.now();
    },
    fetchUsersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Search
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
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
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserToDelete: (state, action) => {
      state.userToDelete = action.payload;
    },
    
    resetUsersState: (state) => initialState
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setSearchTerm,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedUser,
  setUserToDelete,
  resetUsersState
} = usersSlice.actions;

export default usersSlice.reducer;
