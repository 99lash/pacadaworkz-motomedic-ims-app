import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { brandService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateBrandForm,
} from '../utils';

export const useBrands = () => {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, success, error: fetchError } = await brandService.fetchBrands();
    if (success) {
      setBrands(data);
    } else {
      setError(fetchError);
      toast.error(UI_TEXT.TOAST_FETCH_ERROR);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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

  const handleSubmit = async () => {
    const { isValid, errors } = validateBrandForm(formData, brands, selectedBrand?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    if (formMode === 'create') {
      const { success, error: createError } = await brandService.createBrand(formData);
      if (success) {
        await fetchBrands();
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_CREATE);
      } else {
        toast.error(createError || UI_TEXT.TOAST_CREATE_ERROR);
      }
    } else {
      const { success, error: updateError } = await brandService.updateBrand(selectedBrand.id, formData);
      if (success) {
        await fetchBrands();
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      } else {
        toast.error(updateError || UI_TEXT.TOAST_UPDATE_ERROR);
      }
    }
    return true;
  };

  const openDeleteDialog = useCallback((brand) => {
    setBrandToDelete(brand);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setBrandToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = async () => {
    if (!brandToDelete) return false;
    const { success, error: deleteError } = await brandService.deleteBrand(brandToDelete.id);
    if (success) {
      await fetchBrands();
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    } else {
      toast.error(deleteError || UI_TEXT.TOAST_DELETE_ERROR);
    }
    return false;
  };

  return {
    // Data
    brands,
    isLoading,
    error,

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

