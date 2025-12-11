import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supplierService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateSupplierForm,
} from '../utils';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  // Fetch suppliers data
  const fetchSuppliersData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await supplierService.fetchAllSuppliers();

      if (result.success) {
        setSuppliers(result.data);
      } else {
        setSuppliers([]);
        toast.error(result.error || 'Failed to fetch suppliers');
      }
    } catch {
      setSuppliers([]);
      toast.error('Failed to fetch suppliers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchSuppliersData();
  }, [fetchSuppliersData]);

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

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateSupplierForm(formData, suppliers, selectedSupplier?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    try {
      if (formMode === 'create') {
        const result = await supplierService.createSupplier(formData);
        if (result.success) {
          await fetchSuppliersData();
          closeFormDialog();
          toast.success(UI_TEXT.TOAST_CREATE);
          return true;
        } else {
          toast.error(result.error || UI_TEXT.TOAST_CREATE_ERROR);
          return false;
        }
      } else {
        const result = await supplierService.updateSupplier(selectedSupplier.id, formData);
        if (result.success) {
          await fetchSuppliersData();
          closeFormDialog();
          toast.success(UI_TEXT.TOAST_UPDATE);
          return true;
        } else {
          toast.error(result.error || UI_TEXT.TOAST_UPDATE_ERROR);
          return false;
        }
      }
    } catch {
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }
  }, [formData, suppliers, selectedSupplier, formMode, closeFormDialog, fetchSuppliersData]);

  const openDeleteDialog = useCallback((supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setSupplierToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!supplierToDelete) return false;

    try {
      const result = await supplierService.deleteSupplier(supplierToDelete.id);
      if (result.success) {
        await fetchSuppliersData();
        closeDeleteDialog();
        toast.success(UI_TEXT.TOAST_DELETE);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      }
    } catch {
      toast.error(UI_TEXT.TOAST_DELETE_ERROR);
      return false;
    }
  }, [supplierToDelete, closeDeleteDialog, fetchSuppliersData]);

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

