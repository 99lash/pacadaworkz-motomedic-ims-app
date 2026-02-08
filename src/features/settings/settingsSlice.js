import { createSlice } from '@reduxjs/toolkit';
import { TAB_TYPES } from './utils';

const initialState = {
  activeTab: TAB_TYPES.PROFILE,
  profileData: {
    firstName: '',
    lastName: '',
    email: '',
  },
  isLoading: false,
  isSaving: false,
  error: null,
  
  // Database Stats
  databaseStats: {
    totalRecords: 0,
    storageUsed: '0 KB',
    lastBackup: 'Never',
  },
  
  // UI State
  selectedBackupFile: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Profile
    setProfileData: (state, action) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },
    setSaving: (state, action) => {
      state.isSaving = action.payload;
    },
    
    // Database Stats
    setDatabaseStats: (state, action) => {
      state.databaseStats = action.payload;
    },
    
    // Backup
    setSelectedBackupFile: (state, action) => {
      state.selectedBackupFile = action.payload;
    },
    
    resetSettingsState: () => initialState
  },
});

export const {
  setActiveTab,
  setProfileData,
  setSaving,
  setDatabaseStats,
  setSelectedBackupFile,
  resetSettingsState
} = settingsSlice.actions;

export default settingsSlice.reducer;
