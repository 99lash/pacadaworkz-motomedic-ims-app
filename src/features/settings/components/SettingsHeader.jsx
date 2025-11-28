/**
 * SettingsHeader Component
 * 
 * Page header with title and subtitle.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SettingsHeader displays page title and subtitle
 */
const SettingsHeader = () => {
  return (
    <header>
      <div className="flex items-center gap-3 mb-2">
        <SettingsIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" aria-hidden="true" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {UI_TEXT.PAGE_TITLE}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground dark:text-gray-400">
        {UI_TEXT.PAGE_SUBTITLE}
      </p>
    </header>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(SettingsHeader);

