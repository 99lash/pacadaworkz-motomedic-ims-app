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
import { UI_TEXT } from '../utils';

const PurchaseReceiveDialog = ({ isOpen, onClose, onConfirm, purchaseOrder }) => {
  if (!purchaseOrder) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{UI_TEXT.RECEIVE_TITLE}</AlertDialogTitle>
          <AlertDialogDescription>
            {UI_TEXT.RECEIVE_DESCRIPTION}
            <br /><br />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              PO #{String(purchaseOrder.id).slice(0, 8)} - {purchaseOrder.supplierName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Confirm Receipt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

PurchaseReceiveDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.object,
};

export default PurchaseReceiveDialog;
