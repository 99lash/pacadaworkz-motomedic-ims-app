import React from 'react';
import PropTypes from 'prop-types';
import { Shield } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Switch } from '../../../shared/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { UI_TEXT } from '../utils';

const UserPermissionsDialog = ({
  user,
  isOpen,
  permissions,
  permissionModules,
  permissionActions,
  onClose,
  onPermissionToggle,
  onSave,
}) => {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  if (!user) return null;

  const canEditPermissions = user.role === 'Admin';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <div>
              <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">
                {UI_TEXT.PERMISSIONS_TITLE} - {user.name}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
                Configure user permissions for different system modules and actions.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium border-b border-gray-200 dark:border-gray-800 pb-2">
              <div className="text-gray-900 dark:text-gray-100">Module</div>
              {permissionActions.map((action) => (
                <div key={action} className="text-center text-gray-900 dark:text-gray-100 capitalize">
                  {action}
                </div>
              ))}
            </div>
            {permissionModules.map((module) => (
              <div
                key={module}
                className="grid grid-cols-5 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {module}
                </div>
                {permissionActions.map((action) => (
                  <div key={action} className="flex justify-center">
                    <Switch
                      checked={permissions[module]?.[action] || false}
                      onCheckedChange={() => onPermissionToggle(module, action)}
                      disabled={!canEditPermissions}
                      aria-label={`${module} ${action} permission`}
                    />
                  </div>
                ))}
              </div>
            ))}
            {!canEditPermissions && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                Note: Only Admin users can modify permissions.
              </p>
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
            onClick={onSave}
            disabled={!canEditPermissions}
            className="w-full sm:w-auto"
          >
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

UserPermissionsDialog.propTypes = {
  user: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  permissions: PropTypes.object.isRequired,
  permissionModules: PropTypes.array.isRequired,
  permissionActions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onPermissionToggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default UserPermissionsDialog;

