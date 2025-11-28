/**
 * DatabaseTab Component
 * 
 * Database management tab with backup and restore functionality.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Database, Download, Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DatabaseTab displays database management options
 */
const DatabaseTab = ({
  databaseStats,
  selectedBackupFile,
  onCreateBackup,
  onFileSelect,
  onRestore,
  onValidate,
}) => {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <p className="text-gray-600 dark:text-gray-400">{UI_TEXT.DATABASE_SUBTITLE}</p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 dark:text-blue-100 font-medium">{UI_TEXT.DATABASE_INFO_TITLE}</p>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">{UI_TEXT.DATABASE_INFO_DESC}</p>
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-700 dark:text-blue-300">{UI_TEXT.DATABASE_TOTAL_RECORDS}</span>
              <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-blue-900 dark:text-blue-100 text-lg font-semibold">{databaseStats.totalRecords}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-700 dark:text-green-300">{UI_TEXT.DATABASE_STORAGE_USED}</span>
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-900 dark:text-green-100 text-lg font-semibold">{databaseStats.storageUsed}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-700 dark:text-purple-300">{UI_TEXT.DATABASE_LAST_BACKUP}</span>
              <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-purple-900 dark:text-purple-100 text-lg font-semibold">{databaseStats.lastBackup}</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">{UI_TEXT.DATABASE_CREATE_BACKUP}</CardTitle>
              <p className="text-blue-100 text-sm">{UI_TEXT.DATABASE_BACKUP_DESC}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 mb-4">
            <p className="text-gray-700 dark:text-gray-300">{UI_TEXT.DATABASE_BACKUP_INCLUDES}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'All Products & Inventory',
                'Sales & Transactions',
                'Purchase Orders',
                'Users & Permissions',
                'Categories & Brands',
                'Suppliers & Settings',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={onCreateBackup} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{UI_TEXT.DATABASE_BACKUP_CREATE_FULL}</span>
            </Button>
            <Button variant="outline" disabled>
              <span>{UI_TEXT.DATABASE_BACKUP_QUICK}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Restore Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 dark:from-orange-700 dark:to-orange-800">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">{UI_TEXT.DATABASE_RESTORE_TITLE}</CardTitle>
              <p className="text-orange-100 text-sm">{UI_TEXT.DATABASE_RESTORE_DESC}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Warning */}
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 mb-4 mt-6">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 dark:text-red-100 font-medium">{UI_TEXT.DATABASE_RESTORE_WARNING}</p>
                <p className="text-red-700 dark:text-red-300 text-sm mt-1">{UI_TEXT.DATABASE_RESTORE_WARNING_DESC}</p>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50">
            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-900 dark:text-gray-100 mb-2">{UI_TEXT.DATABASE_RESTORE_DROP}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{UI_TEXT.DATABASE_RESTORE_BROWSE}</p>
            <input
              type="file"
              accept=".json"
              className="hidden"
              id="restore-file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onFileSelect(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="restore-file">
              <Button variant="outline" as="span" className="cursor-pointer">
                {UI_TEXT.DATABASE_RESTORE_SELECT}
              </Button>
            </label>
            {selectedBackupFile && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {selectedBackupFile.name}
              </p>
            )}
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">{UI_TEXT.DATABASE_RESTORE_FORMAT}</p>
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
            <Button onClick={onRestore} variant="destructive" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{UI_TEXT.DATABASE_RESTORE_BUTTON}</span>
            </Button>
            <Button onClick={onValidate} variant="outline">
              <span>{UI_TEXT.DATABASE_RESTORE_VALIDATE}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>{UI_TEXT.DATABASE_EXPORT_TITLE}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{UI_TEXT.DATABASE_EXPORT_DESC}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" disabled>
              {UI_TEXT.DATABASE_EXPORT_PRODUCTS}
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              {UI_TEXT.DATABASE_EXPORT_TRANSACTIONS}
            </Button>
            <Button variant="ghost" className="w-full justify-start" disabled>
              {UI_TEXT.DATABASE_EXPORT_INVENTORY}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>{UI_TEXT.DATABASE_SCHEDULED_TITLE}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">{UI_TEXT.DATABASE_SCHEDULED_DESC}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">{UI_TEXT.DATABASE_SCHEDULED_AUTO}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
                {UI_TEXT.DATABASE_SCHEDULED_FREQUENCY}
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800" disabled>
                <option>{UI_TEXT.DATABASE_SCHEDULED_DAILY}</option>
                <option>{UI_TEXT.DATABASE_SCHEDULED_WEEKLY}</option>
                <option>{UI_TEXT.DATABASE_SCHEDULED_MONTHLY}</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle>{UI_TEXT.DATABASE_HISTORY_TITLE}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
            <p>{UI_TEXT.DATABASE_HISTORY_EMPTY}</p>
            <p className="text-sm mt-1">{UI_TEXT.DATABASE_HISTORY_EMPTY_DESC}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

DatabaseTab.propTypes = {
  /** Database statistics */
  databaseStats: PropTypes.shape({
    totalRecords: PropTypes.number.isRequired,
    storageUsed: PropTypes.string.isRequired,
    lastBackup: PropTypes.string.isRequired,
  }).isRequired,
  /** Selected backup file */
  selectedBackupFile: PropTypes.object,
  /** Callback when creating backup */
  onCreateBackup: PropTypes.func.isRequired,
  /** Callback when file is selected */
  onFileSelect: PropTypes.func.isRequired,
  /** Callback when restoring backup */
  onRestore: PropTypes.func.isRequired,
  /** Callback when validating backup */
  onValidate: PropTypes.func.isRequired,
};

DatabaseTab.defaultProps = {
  selectedBackupFile: null,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(DatabaseTab);

