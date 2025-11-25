/**
 * CategoryFormDialog Component
 * 
 * Dialog component for adding/editing categories.
 * Contains form with validation and accessibility features.
 */

import React, { memo, useId } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { Textarea } from '../../../shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { UI_TEXT, VALIDATION } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryFormDialog for adding/editing categories
 */
const CategoryFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  formErrors,
  onFieldChange,
  isEditing,
  isSaving,
}) => {
  // Generate unique IDs for accessibility
  const nameInputId = useId();
  const descInputId = useId();
  const nameErrorId = useId();
  const descErrorId = useId();
  
  // Determine dialog text based on mode
  const dialogTitle = isEditing ? UI_TEXT.DIALOG_EDIT_TITLE : UI_TEXT.DIALOG_ADD_TITLE;
  const dialogDescription = isEditing ? UI_TEXT.DIALOG_EDIT_DESC : UI_TEXT.DIALOG_ADD_DESC;
  const submitButtonText = isEditing ? UI_TEXT.BTN_UPDATE : UI_TEXT.BTN_SAVE;
  
  /**
   * Handles form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  /**
   * Handles dialog close with cleanup
   */
  const handleOpenChange = (open) => {
    if (!open && !isSaving) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-describedby="category-form-description"
      >
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription id="category-form-description">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Category Name Field */}
            <div className="space-y-2">
              <Label 
                htmlFor={nameInputId}
                className="flex items-center gap-1"
              >
                {UI_TEXT.LABEL_NAME}
                <span className="text-destructive" aria-hidden="true">*</span>
                <span className="sr-only">(required)</span>
              </Label>
              
              <Input
                id={nameInputId}
                type="text"
                placeholder={UI_TEXT.PLACEHOLDER_NAME}
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                className={formErrors.name ? 'border-destructive' : ''}
                aria-required="true"
                aria-invalid={!!formErrors.name}
                aria-describedby={formErrors.name ? nameErrorId : undefined}
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                autoFocus
                disabled={isSaving}
              />
              
              {formErrors.name && (
                <p 
                  id={nameErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {formErrors.name}
                </p>
              )}
              
              {/* Character count hint */}
              <p className="text-xs text-muted-foreground">
                {formData.name.length}/{VALIDATION.NAME_MAX_LENGTH} characters
              </p>
            </div>
            
            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor={descInputId}>
                {UI_TEXT.LABEL_DESCRIPTION}
                <span className="text-muted-foreground text-xs ml-1">(optional)</span>
              </Label>
              
              <Textarea
                id={descInputId}
                placeholder={UI_TEXT.PLACEHOLDER_DESCRIPTION}
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                className={formErrors.description ? 'border-destructive' : ''}
                aria-invalid={!!formErrors.description}
                aria-describedby={formErrors.description ? descErrorId : undefined}
                rows={3}
                maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                disabled={isSaving}
              />
              
              {formErrors.description && (
                <p 
                  id={descErrorId}
                  className="text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {formErrors.description}
                </p>
              )}
              
              {/* Character count hint */}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              {UI_TEXT.BTN_CANCEL}
            </Button>
            
            <Button
              type="submit"
              disabled={isSaving}
              aria-busy={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2" aria-hidden="true">⏳</span>
                  <span>Saving...</span>
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryFormDialog.propTypes = {
  /** Whether the dialog is open */
  isOpen: PropTypes.bool.isRequired,
  
  /** Callback to close the dialog */
  onClose: PropTypes.func.isRequired,
  
  /** Callback when form is submitted */
  onSubmit: PropTypes.func.isRequired,
  
  /** Current form data */
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  
  /** Form validation errors */
  formErrors: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  
  /** Callback to update form field */
  onFieldChange: PropTypes.func.isRequired,
  
  /** Whether we're editing an existing category */
  isEditing: PropTypes.bool,
  
  /** Whether a save operation is in progress */
  isSaving: PropTypes.bool,
};

CategoryFormDialog.defaultProps = {
  isEditing: false,
  isSaving: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategoryFormDialog);

