/**
 * AttributeFormDialog Component
 * 
 * Dialog for creating and editing attributes.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
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
import { Label } from '../../../shared/components/ui/label';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AttributeFormDialog displays form for creating/editing attributes
 */
const AttributeFormDialog = ({
  isOpen,
  mode,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  const title = mode === 'create' ? UI_TEXT.FORM_TITLE_CREATE : UI_TEXT.FORM_TITLE_EDIT;
  const description = mode === 'create' 
    ? UI_TEXT.FORM_DESCRIPTION_CREATE 
    : UI_TEXT.FORM_DESCRIPTION_EDIT;

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 px-2 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_NAME} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
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
              <Label htmlFor="description" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_DESCRIPTION}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_DESCRIPTION}
                rows={3}
              />
              {formErrors.description && (
                <p className="text-sm text-destructive mt-1.5" role="alert">
                  {formErrors.description}
                </p>
              )}
            </div>
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
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

AttributeFormDialog.propTypes = {
  /** Whether dialog is open */
  isOpen: PropTypes.bool.isRequired,
  /** Form mode: 'create' or 'edit' */
  mode: PropTypes.oneOf(['create', 'edit']).isRequired,
  /** Form data */
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  /** Form validation errors */
  formErrors: PropTypes.object.isRequired,
  /** Callback when dialog closes */
  onClose: PropTypes.func.isRequired,
  /** Callback when form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Callback when field value changes */
  onFieldChange: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(AttributeFormDialog);

