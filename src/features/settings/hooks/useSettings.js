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

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { settingsService } from '../services';
import { validateProfileForm, calculateTotalRecords, calculateStorageUsed, getLastBackup } from '../utils';
import { TAB_TYPES, UI_TEXT } from '../utils';

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Settings management hook
 * @param {Object} user - Current user object
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
    username: user?.username || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBackupFile, setSelectedBackupFile] = useState(null);

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  const databaseStats = useMemo(() => ({
    totalRecords: calculateTotalRecords(),
    storageUsed: calculateStorageUsed(),
    lastBackup: getLastBackup(),
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
      const updatedUser = settingsService.updateUserProfile(user.id, profileData);
      if (updatedUser) {
        toast.success(UI_TEXT.TOAST_PROFILE_UPDATED);
        // Update user in parent component if needed
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }, [profileData, user]);

  const handleCreateBackup = useCallback(() => {
    try {
      const backup = settingsService.createBackup();
      if (backup) {
        const filename = `motomedic-backup-${new Date().toISOString().split('T')[0]}.json`;
        settingsService.downloadBackup(backup, filename);
        toast.success(UI_TEXT.TOAST_BACKUP_CREATED);
      } else {
        toast.error('Failed to create backup');
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
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(JSON.parse(e.target.result));
        reader.onerror = reject;
        reader.readAsText(selectedBackupFile);
      });

      const validation = settingsService.validateBackup(fileContent);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      const success = settingsService.restoreBackup(fileContent);
      if (success) {
        toast.success('Database restored successfully');
        setSelectedBackupFile(null);
        // Reload page to reflect changes
        window.location.reload();
      } else {
        toast.error('Failed to restore backup');
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

    try {
      const fileContent = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(JSON.parse(e.target.result));
        reader.onerror = reject;
        reader.readAsText(selectedBackupFile);
      });

      const validation = settingsService.validateBackup(fileContent);
      if (validation.isValid) {
        toast.success('Backup file is valid');
      } else {
        toast.error(validation.error);
      }
    } catch (error) {
      console.error('Error validating backup:', error);
      toast.error('Failed to validate backup file');
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
    handleProfileFieldChange,
    handleSaveProfile,

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

