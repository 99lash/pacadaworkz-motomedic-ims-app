/**
 * CategoryDeleteDialog Component
 * 
 * Confirmation dialog for deleting a category.
 * Implements HCI principle of confirming destructive actions.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../shared/components/ui/alert-dialog';
import { UI_TEXT } from '../utils';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryDeleteDialog shows a confirmation before deleting
 */
const CategoryDeleteDialog = ({
  category,
  onConfirm,
  isDeleting,
  trigger,
}) => {
  const hasProducts = category.productCount > 0;
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button 
            variant="ghost" 
            size="icon"
            aria-label={`Delete ${category.name}`}
            title={`Delete ${category.name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </AlertDialogTrigger>
      
      <AlertDialogContent role="alertdialog" aria-labelledby="delete-dialog-title">
        <AlertDialogHeader>
          <AlertDialogTitle id="delete-dialog-title" className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
            {UI_TEXT.DIALOG_DELETE_TITLE}
          </AlertDialogTitle>
          
          <AlertDialogDescription id="delete-dialog-description">
            Are you sure you want to delete &quot;{category.name}&quot;?
            {hasProducts && (
              <span className="block mt-2 text-destructive font-medium">
                <AlertTriangle className="inline h-4 w-4 mr-1" aria-hidden="true" />
                This category has {category.productCount} products assigned to it.
                You must reassign these products before deleting.
              </span>
            )}
            {!hasProducts && (
              <span className="block mt-2">
                This action cannot be undone.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {UI_TEXT.BTN_CANCEL}
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting || hasProducts}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            aria-describedby={hasProducts ? 'delete-blocked-reason' : undefined}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Deleting...
              </>
            ) : (
              UI_TEXT.BTN_DELETE
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
        
        {hasProducts && (
          <p id="delete-blocked-reason" className="sr-only">
            Cannot delete because category has products
          </p>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryDeleteDialog.propTypes = {
  /** Category object to delete */
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    productCount: PropTypes.number.isRequired,
  }).isRequired,
  
  /** Callback when delete is confirmed */
  onConfirm: PropTypes.func.isRequired,
  
  /** Whether delete operation is in progress */
  isDeleting: PropTypes.bool,
  
  /** Custom trigger element */
  trigger: PropTypes.node,
};

CategoryDeleteDialog.defaultProps = {
  isDeleting: false,
  trigger: null,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategoryDeleteDialog);

