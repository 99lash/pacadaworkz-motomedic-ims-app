/**
 * SecurityTab Component
 * 
 * Security settings tab with password change form.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../shared/components/ui/input';
import { Button } from '../../../shared/components/ui/button';
import { toast } from 'sonner';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * SecurityTab displays security settings
 */
const SecurityTab = () => {
  const handleUpdatePassword = () => {
    toast.info(UI_TEXT.SECURITY_COMING_SOON);
  };

  return (
    <div className="max-w-2xl">
      <h3 className="text-gray-900 dark:text-gray-100 mb-4">{UI_TEXT.SECURITY_TITLE}</h3>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
        <div>
          <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_CURRENT_PASSWORD}
          </label>
          <Input
            id="currentPassword"
            type="password"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_NEW_PASSWORD}
          </label>
          <Input
            id="newPassword"
            type="password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_CONFIRM_PASSWORD}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            required
          />
        </div>
        <Button type="submit">
          {UI_TEXT.SECURITY_UPDATE_PASSWORD}
        </Button>
      </form>
    </div>
  );
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(SecurityTab);

