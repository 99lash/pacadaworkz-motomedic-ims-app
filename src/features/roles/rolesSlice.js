import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: [],
  users: [], // Needed for counting users per role
  isLoading: false,
  error: null,
  lastFetched: null,
  
  // UI State
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedRole: null,
  roleToDelete: null,
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    fetchRolesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRolesSuccess: (state, action) => {
      state.isLoading = false;
      state.roles = action.payload.roles;
      state.users = action.payload.users;
      state.lastFetched = Date.now();
    },
    fetchRolesFailure: (state, action) => {
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
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    setRoleToDelete: (state, action) => {
      state.roleToDelete = action.payload;
    },
    
    resetRolesState: (state) => initialState
  },
});

export const {
  fetchRolesStart,
  fetchRolesSuccess,
  fetchRolesFailure,
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedRole,
  setRoleToDelete,
  resetRolesState
} = rolesSlice.actions;

export default rolesSlice.reducer;
