import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roleService from './services/roleService';

// =============================================================================
// ASYNC THUNKS
// =============================================================================

/**
 * Fetch all roles and permissions
 */
export const fetchRolesAndPermissions = createAsyncThunk(
  'roles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [roles, permissions] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);
      return { roles, permissions };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

/**
 * Create a new role and optionally sync permissions
 */
export const createRole = createAsyncThunk(
  'roles/create',
  async ({ roleData, permissionIds }, { rejectWithValue }) => {
    try {
      const newRole = await roleService.createRole(roleData);
      
      if (!newRole || !newRole.id) {
        throw new Error('Server did not return a valid role ID');
      }

      // If we have permissions to sync, do it now
      if (permissionIds && permissionIds.length > 0) {
        const roleWithPermissions = await roleService.syncPermissions(newRole.id, permissionIds);
        // Ensure we merge the response properly, backend might return permissions under data.data
        return {
          ...newRole,
          ...roleWithPermissions,
        };
      }
      
      return newRole;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to create role');
    }
  }
);

/**
 * Update a role and sync permissions
 */
export const updateRole = createAsyncThunk(
  'roles/update',
  async ({ id, roleData, permissionIds }, { rejectWithValue }) => {
    try {
      // Update basic info
      const updatedRole = await roleService.updateRole(id, roleData);
      
      // Sync permissions
      const roleWithPermissions = await roleService.syncPermissions(id, permissionIds);
      
      return {
        ...updatedRole,
        ...roleWithPermissions,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

/**
 * Delete a role
 */
export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete role');
    }
  }
);

// =============================================================================
// SLICE
// =============================================================================

const initialState = {
  roles: [],
  allPermissions: [],
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
  extraReducers: (builder) => {
    builder
      // Fetch Roles and Permissions
      .addCase(fetchRolesAndPermissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRolesAndPermissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = action.payload.roles;
        state.allPermissions = action.payload.permissions;
        state.lastFetched = Date.now();
      })
      .addCase(fetchRolesAndPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles.push(action.payload);
        state.isFormOpen = false;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
        state.isFormOpen = false;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roles = state.roles.filter(r => r.id !== action.payload);
        state.isDeleteOpen = false;
        state.roleToDelete = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFormOpen,
  setDeleteOpen,
  setFormMode,
  setSelectedRole,
  setRoleToDelete,
  resetRolesState
} = rolesSlice.actions;

export default rolesSlice.reducer;
