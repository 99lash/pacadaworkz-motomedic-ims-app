import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { brandService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateBrandForm,
} from '../utils';

export const useBrands = () => {
  const [brands, setBrands] = useState(() => brandService.fetchBrands());
  const isLoading = false;

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedBrand(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((brand) => {
    setFormMode('edit');
    setSelectedBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
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
    const { isValid, errors } = validateBrandForm(formData, brands, selectedBrand?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    if (formMode === 'create') {
      brandService.createBrand(formData);
      setBrands(brandService.fetchBrands());
      closeFormDialog();
      toast.success(UI_TEXT.TOAST_CREATE);
    } else {
      const updated = brandService.updateBrand(selectedBrand.id, formData);
      if (updated) {
        setBrands(brandService.fetchBrands());
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      }
    }
    return true;
  }, [formData, brands, selectedBrand, formMode, closeFormDialog]);

  const openDeleteDialog = useCallback((brand) => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setBrandToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!brandToDelete) return false;
    const success = brandService.deleteBrand(brandToDelete.id);
    if (success) {
      setBrands(brandService.fetchBrands());
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    }
    return false;
  }, [brandToDelete, closeDeleteDialog]);

  return {
    // Data
    brands,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedBrand,

    // Delete state
    isDeleteOpen,
    brandToDelete,

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

export default useBrands;

