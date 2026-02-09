/**
 * SecurityTab Component
 * 
 * Security settings tab with password change form.
 * Follows accessibility best practices.
 */

import React, { memo, useState } from 'react';
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
const SecurityTab = ({ onUpdatePassword, isSaving }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
       toast.error('Password must be at least 8 characters');
       return;
    }

    const success = await onUpdatePassword({
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
      confirm_new_password: formData.confirmPassword,
    });

    if (success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="max-w-2xl pt-4">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="currentPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_CURRENT_PASSWORD}
          </label>
          <Input
            id="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_NEW_PASSWORD}
          </label>
          <Input
            id="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.SECURITY_CONFIRM_PASSWORD}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            required
            disabled={isSaving}
          />
        </div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Updating...' : UI_TEXT.SECURITY_UPDATE_PASSWORD}
        </Button>
      </form>
    </div>
  );
};

SecurityTab.propTypes = {
  onUpdatePassword: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

SecurityTab.defaultProps = {
  isSaving: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(SecurityTab);

