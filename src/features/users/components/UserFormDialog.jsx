import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { Label } from '../../../shared/components/ui/label';
import { UI_TEXT, USER_ROLES, USER_STATUSES } from '../utils';

const UserFormDialog = ({
  isOpen,
  mode,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  const title = mode === 'create' ? UI_TEXT.FORM_TITLE_CREATE : UI_TEXT.FORM_TITLE_EDIT;

  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Create a new user account with specified role and permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 px-2 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <div>
              <Label htmlFor="userName" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_NAME} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="userName"
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_NAME}
                aria-invalid={Boolean(formErrors.name)}
                className={formErrors.name ? 'border-destructive' : ''}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive mt-1.5" role="alert">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="userEmail" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_EMAIL} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_EMAIL}
                aria-invalid={Boolean(formErrors.email)}
                className={formErrors.email ? 'border-destructive' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-destructive mt-1.5" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userRole" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_ROLE} <span className="text-destructive">*</span>
                </Label>
                <select
                  id="userRole"
                  value={formData.role}
                  onChange={(e) => onFieldChange('role', e.target.value)}
                  aria-invalid={Boolean(formErrors.role)}
                  className={`
                    flex h-10 w-full rounded-md border px-3 py-2 text-sm
                    ${formErrors.role
                      ? 'border-destructive'
                      : 'border-gray-200 dark:border-gray-800'
                    }
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                  `}
                >
                  <option value="">{UI_TEXT.PLACEHOLDER_ROLE}</option>
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.role}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="userStatus" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_STATUS}
                </Label>
                <select
                  id="userStatus"
                  value={formData.status}
                  onChange={(e) => onFieldChange('status', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                >
                  {USER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {mode === 'create' && (
              <div>
                <Label htmlFor="tempPassword" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_PASSWORD} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tempPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => onFieldChange('password', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_PASSWORD}
                  aria-invalid={Boolean(formErrors.password)}
                  className={formErrors.password ? 'border-destructive' : ''}
                />
                {formErrors.password && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.password}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="w-full sm:w-auto"
          >
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

UserFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    password: PropTypes.string,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default UserFormDialog;

