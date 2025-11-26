import React from 'react';
import { Shield } from 'lucide-react';
import { UI_TEXT } from '../utils';

const RoleInfoBanner = () => (
  <div className="bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-blue-900 dark:text-blue-100 font-medium">{UI_TEXT.INFO_TITLE}</p>
      <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
        {UI_TEXT.INFO_DESCRIPTION}
      </p>
    </div>
  </div>
);

export default RoleInfoBanner;

