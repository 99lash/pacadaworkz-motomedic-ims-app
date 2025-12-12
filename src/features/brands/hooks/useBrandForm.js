import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateBrandForm,
} from '../utils';

export const useBrandForm = (brands) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedBrand(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
  }, [resetForm]);

  const openEditDialog = useCallback((brand) => {
    setFormMode('edit');
    setSelectedBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
    });
    setFormErrors(INITIAL_FORM_ERRORS);
  }, []);

  const handleFormFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const { isValid, errors } = validateBrandForm(formData, brands, selectedBrand?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }
    return true;
  }, [formData, brands, selectedBrand]);

  return {
    formData,
    formErrors,
    formMode,
    selectedBrand,
    resetForm,
    openCreateDialog,
    openEditDialog,
    handleFormFieldChange,
    validateForm,
  };
};