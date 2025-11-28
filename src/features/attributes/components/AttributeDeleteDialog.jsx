/**
 * AttributeDeleteDialog Component
 * 
 * Confirmation dialog for deleting attributes.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
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
// COMPONENT
// =============================================================================

/**
 * AttributeDeleteDialog displays delete confirmation
 */
const AttributeDeleteDialog = ({ attribute, isOpen, onClose, onConfirm }) => {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  if (!attribute) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle className="text-lg text-gray-900 dark:text-gray-100">
                {UI_TEXT.DELETE_TITLE}
              </DialogTitle>
              <DialogDescription className="mt-1 text-gray-600 dark:text-gray-400">
                {UI_TEXT.DELETE_DESCRIPTION}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {UI_TEXT.DELETE_CONFIRM} <strong>{attribute.name}</strong>? {UI_TEXT.DELETE_WARNING}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete Attribute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

AttributeDeleteDialog.propTypes = {
  /** Attribute to delete */
  attribute: PropTypes.object,
  /** Whether dialog is open */
  isOpen: PropTypes.bool.isRequired,
  /** Callback when dialog closes */
  onClose: PropTypes.func.isRequired,
  /** Callback when delete is confirmed */
  onConfirm: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(AttributeDeleteDialog);

