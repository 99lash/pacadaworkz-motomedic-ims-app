import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Shield, Check } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Textarea } from '../../../shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { UI_TEXT } from '../utils';

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Permission Button - Reusable button for individual permission actions
 */
const PermissionButton = memo(({ action, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
      className={`
      px-3 py-1.5 rounded-md text-xs font-medium transition-all
      ${isActive
        ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }
    `}
  >
    {action.label}
  </button>
));

PermissionButton.propTypes = {
  action: PropTypes.shape({
    action: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

/**
 * Permission Table Row - Clean, organized row component
 */
const PermissionTableRow = memo(({ module, permissions, onToggle, onSelectAll, hasPermission }) => {
  const moduleActions = module.actions.map((a) => a.action);
  const current = permissions.find((p) => p.module === module.module);
  const hasAll = current && moduleActions.every((action) => current.actions.includes(action));

  return (
    <tr className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span className="font-medium text-gray-900 dark:text-gray-100">{module.label}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {module.actions.map((action) => (
            <PermissionButton
              key={action.action}
              action={action}
              isActive={hasPermission(module.module, action.action)}
              onClick={() => onToggle(module.module, action.action)}
            />
          ))}
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <button
          type="button"
          onClick={() => onSelectAll(module.module)}
          className={`
            inline-flex items-center justify-center w-9 h-9 rounded-lg transition-all
            ${hasAll
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300 shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }
          `}
          aria-pressed={hasAll}
          aria-label={hasAll ? 'Deselect all' : 'Select all'}
        >
          <Check className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
});

PermissionTableRow.propTypes = {
  module: PropTypes.shape({
    module: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    actions: PropTypes.array.isRequired,
  }).isRequired,
  permissions: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const RoleFormDialog = ({
  isOpen,
  mode,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange,
  permissionModules,
  onPermissionToggle,
  onSelectAll,
  hasPermission,
}) => {
  const title = mode === 'create' ? UI_TEXT.FORM_TITLE_CREATE : UI_TEXT.FORM_TITLE_EDIT;

  // Handle dialog open/close state changes
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Configure role details and assign permissions to control system access.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
          {/* Basic Information */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="role-name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_NAME} <span className="text-destructive">*</span>
                </label>
                <Input
                  id="role-name"
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
                <label htmlFor="role-description" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_DESCRIPTION}
                </label>
                <Textarea
                  id="role-description"
                  value={formData.description}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_DESCRIPTION}
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {UI_TEXT.LABEL_PERMISSIONS} <span className="text-destructive">*</span>
                </h3>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  Select permissions for each module or use "Select All" to grant all actions.
                </p>
              </div>
              {formErrors.permissions && (
                <p className="text-sm text-destructive" role="alert">
                  {formErrors.permissions}
                </p>
              )}
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Module
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Permissions
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Select All
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissionModules.map((module) => (
                    <PermissionTableRow
                      key={module.module}
                      module={module}
                      permissions={formData.permissions}
                      onToggle={onPermissionToggle}
                      onSelectAll={onSelectAll}
                      hasPermission={hasPermission}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Footer */}
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
            {mode === 'create' ? UI_TEXT.BTN_ADD_ROLE : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

RoleFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        module: PropTypes.string.isRequired,
        actions: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ),
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  permissionModules: PropTypes.array.isRequired,
  onPermissionToggle: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  hasPermission: PropTypes.func.isRequired,
};

export default RoleFormDialog;

