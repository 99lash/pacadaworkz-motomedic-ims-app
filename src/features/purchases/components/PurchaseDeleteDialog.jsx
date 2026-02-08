import React from 'react';
import PropTypes from 'prop-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../shared/components/ui/alert-dialog';

const PurchaseDeleteDialog = ({ isOpen, onClose, onConfirm, purchaseOrder }) => {
  if (!purchaseOrder) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete PO #{String(purchaseOrder.id).slice(0, 8)}? 
            This action cannot be undone and will remove all associated purchase data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

PurchaseDeleteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.object,
};

export default PurchaseDeleteDialog;
