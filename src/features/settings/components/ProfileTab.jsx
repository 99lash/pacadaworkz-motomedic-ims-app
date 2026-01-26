/**
 * ProfileTab Component
 * 
 * Profile settings tab with user information form.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../../../shared/components/ui/input';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProfileTab displays profile form
 */
const ProfileTab = ({ user, profileData, isSaving, onFieldChange, onSave }) => {
  return (
    <form onSubmit={onSave} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.PROFILE_FIRST_NAME}
          </label>
          <Input
            id="firstName"
            type="text"
            value={profileData.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.PROFILE_LAST_NAME}
          </label>
          <Input
            id="lastName"
            type="text"
            value={profileData.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.PROFILE_USERNAME}
          </label>
          <Input
            id="username"
            type="text"
            value={profileData.username}
            onChange={(e) => onFieldChange('username', e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
            {UI_TEXT.PROFILE_EMAIL}
          </label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <Card>
          <CardContent className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <p className="text-blue-900 dark:text-blue-100">
              {UI_TEXT.PROFILE_ROLE}: <span className="font-medium">
                {(typeof user?.role === 'object' ? user?.role?.role_name : user?.role)?.toUpperCase() || 'USER'}
              </span>
            </p>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              {UI_TEXT.PROFILE_ROLE_HELP}
            </p>
          </CardContent>
        </Card>
      </div>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? 'Saving...' : UI_TEXT.PROFILE_SAVE_CHANGES}
      </Button>
    </form>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ProfileTab.propTypes = {
  /** Current user object */
  user: PropTypes.object.isRequired,
  /** Profile form data */
  profileData: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  /** Whether form is saving */
  isSaving: PropTypes.bool,
  /** Callback when field changes */
  onFieldChange: PropTypes.func.isRequired,
  /** Callback when form is submitted */
  onSave: PropTypes.func.isRequired,
};

ProfileTab.defaultProps = {
  isSaving: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ProfileTab);

