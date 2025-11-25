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

const ProductDeleteDialog = ({ product, onConfirm, isDeleting }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${product.name}`}
        title={`Delete ${product.name}`}
        className="text-destructive hover:text-destructive focus-visible:ring-destructive"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
          {UI_TEXT.DIALOG_DELETE_TITLE}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {UI_TEXT.DIALOG_DELETE_DESC.replace('{product}', product.name)}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>{UI_TEXT.BTN_CANCEL}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isDeleting}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isDeleting ? UI_TEXT.BTN_DELETING : UI_TEXT.BTN_DELETE}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

ProductDeleteDialog.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

ProductDeleteDialog.defaultProps = {
  isDeleting: false,
};

export default memo(ProductDeleteDialog);

