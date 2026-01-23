import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { supplierService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateSupplierForm,
} from '../utils';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState(() => supplierService.fetchSuppliers());
  const isLoading = false;

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedSupplier(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((supplier) => {
    setFormMode('edit');
    setSelectedSupplier(supplier);
    setFormData({
      companyName: supplier.companyName || '',
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      paymentTerms: supplier.paymentTerms || '',
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsFormOpen(true);
  }, []);

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

  const handleSubmit = useCallback(() => {
    const { isValid, errors } = validateSupplierForm(formData, suppliers, selectedSupplier?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    if (formMode === 'create') {
      supplierService.createSupplier(formData);
      setSuppliers(supplierService.fetchSuppliers());
      closeFormDialog();
      toast.success(UI_TEXT.TOAST_CREATE);
    } else {
      const updated = supplierService.updateSupplier(selectedSupplier.id, formData);
      if (updated) {
        setSuppliers(supplierService.fetchSuppliers());
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      }
    }
    return true;
  }, [formData, suppliers, selectedSupplier, formMode, closeFormDialog]);

  const openDeleteDialog = useCallback((supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setSupplierToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!supplierToDelete) return false;
    const success = supplierService.deleteSupplier(supplierToDelete.id);
    if (success) {
      setSuppliers(supplierService.fetchSuppliers());
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    }
    return false;
  }, [supplierToDelete, closeDeleteDialog]);

  return {
    // Data
    suppliers,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedSupplier,

    // Delete state
    isDeleteOpen,
    supplierToDelete,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
  };
};

export default useSuppliers;

