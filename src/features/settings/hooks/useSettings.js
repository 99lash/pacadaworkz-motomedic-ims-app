/**
 * useSettings Hook
 * 
 * Custom hook that encapsulates all settings-related state management
 * and business logic. Separates concerns from UI components.
 * 
 * Features:
 * - Profile management
 * - Tab navigation
 * - Database backup/restore
 * - Preferences management
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { settingsService } from '../services';
import { validateProfileForm } from '../utils';
import { TAB_TYPES, UI_TEXT } from '../utils';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Settings management hook
 * @param {Object} user - Current user object (initial)
 * @returns {Object} Settings state and handlers
 */
export const useSettings = (user) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [activeTab, setActiveTab] = useState(TAB_TYPES.PROFILE);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [selectedBackupFile, setSelectedBackupFile] = useState(null);
  const isFetchingProfileRef = useRef(false);

  // ---------------------------------------------------------------------------
  // EFFECT - Fetch Profile
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      if (isFetchingProfileRef.current) return;
      isFetchingProfileRef.current = true;
      setIsLoadingProfile(true);
      try {
        const result = await settingsService.fetchProfile();
        if (result.success) {
          setProfileData({
            firstName: result.data.firstName || '',
            lastName: result.data.lastName || '',
            email: result.data.email || '',
          });
        } else {
          // Fallback to initial user prop or show error
          // toast.error('Failed to load profile data');
        }
      } finally {
        setIsLoadingProfile(false);
        isFetchingProfileRef.current = false;
      }
    };

    if (activeTab === TAB_TYPES.PROFILE) {
      loadProfile();
    }
  }, [activeTab]);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  // Database stats are not currently provided by the API in this format.
  // Using placeholders or static values for now.
  const databaseStats = useMemo(() => ({
    totalRecords: 0, // Placeholder
    storageUsed: 'Server', // Placeholder
    lastBackup: 'Unknown', // Placeholder
  }), []);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleProfileFieldChange = useCallback((field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSaveProfile = useCallback(async (e) => {
    e.preventDefault();
    
    const validation = validateProfileForm(profileData);
    if (!validation.isValid) {
      Object.values(validation.errors).forEach((error) => {
        toast.error(error);
      });
      return;
    }
    
    setIsSaving(true);
    try {
      // Pass user.id if needed, though API uses Auth token
      const result = await settingsService.updateUserProfile(user?.id, profileData);
      
      if (result.success) {
        toast.success(UI_TEXT.TOAST_PROFILE_UPDATED);
        // Optionally update global user state here if a method was provided
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }, [profileData, user]);

  const handleUpdatePassword = useCallback(async (passwordData) => {
    setIsSaving(true);
    try {
       const result = await settingsService.updatePassword(passwordData);
       if (result.success) {
         toast.success(result.message || 'Password updated successfully');
         return true;
       } else {
         toast.error(result.error || 'Failed to update password');
         return false;
       }
    } catch (error) {
       console.error('Update password error:', error);
       toast.error('Failed to update password');
       return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handleCreateBackup = useCallback(async () => {
    try {
      const result = await settingsService.createBackup();
      if (result.success) {
        const filename = `motomedic-backup-${new Date().toISOString().split('T')[0]}.sql`; // API returns SQL/file stream usually, assumed .sql or .zip based on typical Laravel backups
        // Note: Controller uses Storage::download($path). Browser will handle filename from Content-Disposition if not overridden.
        // But downloadBackup helper forces a filename.
        settingsService.downloadBackup(result.data, filename);
        toast.success(UI_TEXT.TOAST_BACKUP_CREATED);
      } else {
        toast.error(result.error || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    }
  }, []);

  const handleFileSelect = useCallback((file) => {
    if (file) {
      setSelectedBackupFile(file);
      toast.success(UI_TEXT.TOAST_FILE_SELECTED.replace('{name}', file.name));
    }
  }, []);

  const handleRestoreBackup = useCallback(async () => {
    if (!selectedBackupFile) {
      toast.warning(UI_TEXT.DATABASE_RESTORE_SELECT_FIRST);
      return;
    }

    try {
      const result = await settingsService.restoreBackup(selectedBackupFile);
      
      if (result.success) {
        toast.success(result.message || 'Database restored successfully');
        setSelectedBackupFile(null);
        // Reload page to reflect changes might be needed
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(result.error || 'Failed to restore backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    }
  }, [selectedBackupFile]);

  const handleValidateBackup = useCallback(async () => {
    if (!selectedBackupFile) {
      toast.warning(UI_TEXT.DATABASE_RESTORE_SELECT_FIRST);
      return;
    }
    // Basic client-side check
    if (selectedBackupFile.name.endsWith('.sql') || selectedBackupFile.name.endsWith('.zip') || selectedBackupFile.name.endsWith('.json')) {
        toast.success('File extension looks valid. Click Restore to proceed.');
    } else {
        toast.warning('File extension might not be supported.');
    }
  }, [selectedBackupFile]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    // Tab state
    activeTab,
    handleTabChange,

    // Profile state
    profileData,
    isSaving,
    isLoadingProfile,
    handleProfileFieldChange,
    handleSaveProfile,
    handleUpdatePassword,

    // Database state
    databaseStats,
    selectedBackupFile,
    handleCreateBackup,
    handleFileSelect,
    handleRestoreBackup,
    handleValidateBackup,
  };
};

export default useSettings;
