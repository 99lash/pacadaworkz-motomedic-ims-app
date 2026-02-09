/**
 * SettingsPage Component
 * 
 * Main page component for user settings.
 * Features:
 * - Profile management
 * - Security settings
 * - Database backup/restore
 * - Responsive design with dark mode support
 * - Accessible and user-friendly interface
 */

import React from 'react';
import { useAuth } from '../auth';
import { Card, CardContent } from '../../shared/components/ui/card';
import { useSettings } from './hooks';
import {
  SettingsHeader,
  SettingsTabs,
  ProfileTab,
  SecurityTab,
  DatabaseTab,
} from './components';
import { TAB_TYPES } from './utils';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const SettingsPage = () => {
  // ---------------------------------------------------------------------------
  // AUTH - Get current user
  // ---------------------------------------------------------------------------
  const { user } = useAuth();

  // ---------------------------------------------------------------------------
  // HOOK - All state and handlers
  // ---------------------------------------------------------------------------
  const {
    // Tab state
    activeTab,
    handleTabChange,

    // Profile state
    profileData,
    isSaving,
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
  } = useSettings(user);

  // ---------------------------------------------------------------------------
  // RENDER - Main Content
  // ---------------------------------------------------------------------------
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <SettingsHeader />

      {/* Tabs Container */}
      <Card>
        <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <CardContent className="p-6">
          {/* Tab Content */}
          {activeTab === TAB_TYPES.PROFILE && (
            <ProfileTab
              user={user}
              profileData={profileData}
              isSaving={isSaving}
              onFieldChange={handleProfileFieldChange}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === TAB_TYPES.SECURITY && (
            <SecurityTab 
              onUpdatePassword={handleUpdatePassword}
              isSaving={isSaving}
            />
          )}

          {activeTab === TAB_TYPES.DATABASE && (
            <DatabaseTab
              databaseStats={databaseStats}
              selectedBackupFile={selectedBackupFile}
              onCreateBackup={handleCreateBackup}
              onFileSelect={handleFileSelect}
              onRestore={handleRestoreBackup}
              onValidate={handleValidateBackup}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default SettingsPage;

