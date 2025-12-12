import { useCallback } from 'react';
import { useBrandsData } from './useBrandsData';
import { useBrandForm } from './useBrandForm';
import { useBrandDialogs } from './useBrandDialogs';

export const useBrands = () => {
  const brandsData = useBrandsData();
  const brandForm = useBrandForm(brandsData.brands);
  const brandDialogs = useBrandDialogs();

  const handleSubmit = useCallback(async () => {
    if (!brandForm.validateForm()) {
      return false;
    }

    let result;
    if (brandForm.formMode === 'create') {
      result = await brandsData.createBrand(brandForm.formData);
    } else {
      result = await brandsData.updateBrand(brandForm.selectedBrand.id, brandForm.formData);
    }

    if (result.success) {
      brandDialogs.closeFormDialog();
      return true;
    }
    return false;
  }, [brandForm, brandsData, brandDialogs]);

  const handleDelete = useCallback(async () => {
    if (!brandDialogs.brandToDelete) return false;

    const result = await brandsData.deleteBrand(brandDialogs.brandToDelete.id);
    if (result.success) {
      brandDialogs.closeDeleteDialog();
      return true;
    }
    return false;
  }, [brandsData, brandDialogs]);

  const openCreateDialog = useCallback(() => {
    brandForm.openCreateDialog();
    brandDialogs.openFormDialog();
  }, [brandForm, brandDialogs]);

  const openEditDialog = useCallback((brand) => {
    brandForm.openEditDialog(brand);
    brandDialogs.openFormDialog();
  }, [brandForm, brandDialogs]);

  const closeFormDialog = useCallback(() => {
    brandDialogs.closeFormDialog();
    brandForm.resetForm();
  }, [brandDialogs, brandForm]);

  return {
    // Data
    brands: brandsData.brands,
    isLoading: brandsData.isLoading,
    error: brandsData.error,

    // Form state
    formData: brandForm.formData,
    formErrors: brandForm.formErrors,
    formMode: brandForm.formMode,
    isFormOpen: brandDialogs.isFormOpen,
    selectedBrand: brandForm.selectedBrand,

    // Delete state
    isDeleteOpen: brandDialogs.isDeleteOpen,
    brandToDelete: brandDialogs.brandToDelete,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange: brandForm.handleFormFieldChange,
    handleSubmit,
    openDeleteDialog: brandDialogs.openDeleteDialog,
    closeDeleteDialog: brandDialogs.closeDeleteDialog,
    handleDelete,
  };
};

export default useBrands;

