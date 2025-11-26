import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { purchaseService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validatePurchaseOrderForm,
} from '../utils';

export const usePurchases = () => {
  const [purchaseOrders, setPurchaseOrders] = useState(() => purchaseService.fetchPurchaseOrders());
  const [suppliers] = useState(() => purchaseService.fetchSuppliers());
  const [products] = useState(() => purchaseService.fetchProducts());
  const isLoading = false;

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedPurchaseOrder(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const closeFormDialog = useCallback(() => {
    setIsFormOpen(false);
    resetForm();
  }, [resetForm]);

  const handleFormFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const handleAddItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantityOrdered: 1, costPrice: 0 }],
    }));
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const { isValid, errors } = validatePurchaseOrderForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    purchaseService.createPurchaseOrder(formData);
    setPurchaseOrders(purchaseService.fetchPurchaseOrders());
    closeFormDialog();
    toast.success(UI_TEXT.TOAST_CREATE);
    return true;
  }, [formData, closeFormDialog]);

  const handleMarkAsReceived = useCallback((purchaseOrder) => {
    if (!window.confirm('Mark this purchase order as received?')) {
      return false;
    }

    const updated = purchaseService.markPurchaseOrderAsReceived(purchaseOrder.id);
    if (updated) {
      setPurchaseOrders(purchaseService.fetchPurchaseOrders());
      toast.success(UI_TEXT.TOAST_RECEIVED);
      return true;
    }
    return false;
  }, []);

  const openDeleteDialog = useCallback((purchaseOrder) => {
    setPurchaseOrderToDelete(purchaseOrder);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setPurchaseOrderToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!purchaseOrderToDelete) return false;
    const success = purchaseService.deletePurchaseOrder(purchaseOrderToDelete.id);
    if (success) {
      setPurchaseOrders(purchaseService.fetchPurchaseOrders());
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    }
    return false;
  }, [purchaseOrderToDelete, closeDeleteDialog]);

  const getStatusBadge = useCallback((status) => {
    switch (status) {
      case 'received':
        return { label: UI_TEXT.STATUS_RECEIVED, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'partial':
        return { label: UI_TEXT.STATUS_PARTIAL, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      case 'pending':
      default:
        return { label: UI_TEXT.STATUS_PENDING, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
  }, []);

  return {
    // Data
    purchaseOrders,
    suppliers,
    products,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedPurchaseOrder,

    // Delete state
    isDeleteOpen,
    purchaseOrderToDelete,

    // Actions
    openCreateDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmit,
    handleMarkAsReceived,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    getStatusBadge,
  };
};

export default usePurchases;

