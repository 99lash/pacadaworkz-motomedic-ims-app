/**
 * SettingsTabs Component
 * 
 * Tab navigation for settings sections.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { User as UserIcon, Lock, Database } from 'lucide-react';
import { TAB_TYPES, UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SettingsTabs displays tab navigation
 */
const SettingsTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: TAB_TYPES.PROFILE, label: UI_TEXT.TAB_PROFILE, icon: UserIcon },
    { id: TAB_TYPES.SECURITY, label: UI_TEXT.TAB_SECURITY, icon: Lock },
    { id: TAB_TYPES.DATABASE, label: UI_TEXT.TAB_DATABASE, icon: Database },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800" aria-label="Settings tabs">
      <div className="flex gap-8 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              aria-selected={isActive}
              aria-controls={`settings-tabpanel-${tab.id}`}
              role="tab"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

SettingsTabs.propTypes = {
  /** Currently active tab */
  activeTab: PropTypes.string.isRequired,
  /** Callback when tab changes */
  onTabChange: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(SettingsTabs);

