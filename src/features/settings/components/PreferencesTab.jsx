/**
 * PreferencesTab Component
 * 
 * Display preferences tab with theme settings.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * PreferencesTab displays display preferences
 */
const PreferencesTab = () => {
  return (
    <div className="max-w-2xl">
      <h3 className="text-gray-900 dark:text-gray-100 mb-4">{UI_TEXT.PREFERENCES_TITLE}</h3>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 font-medium">{UI_TEXT.PREFERENCES_DARK_MODE}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{UI_TEXT.PREFERENCES_DARK_MODE_DESC}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(PreferencesTab);

