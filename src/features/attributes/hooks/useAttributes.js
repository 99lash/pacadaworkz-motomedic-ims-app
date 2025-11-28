/**
 * useAttributes Hook
 * 
 * Custom hook that encapsulates all attribute-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { attributeService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateAttributeForm,
} from '../utils';

export const useAttributes = () => {
  const [attributes, setAttributes] = useState(() => attributeService.fetchAttributes());
  const isLoading = false;

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [attributeToDelete, setAttributeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedAttribute(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((attribute) => {
    setFormMode('edit');
    setSelectedAttribute(attribute);
    setFormData({
      name: attribute.name || '',
      description: attribute.description || '',
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
    const { isValid, errors } = validateAttributeForm(formData, attributes, selectedAttribute?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    if (formMode === 'create') {
      attributeService.createAttribute(formData);
      setAttributes(attributeService.fetchAttributes());
      closeFormDialog();
      toast.success(UI_TEXT.TOAST_CREATE);
    } else {
      const updated = attributeService.updateAttribute(selectedAttribute.id, formData);
      if (updated) {
        setAttributes(attributeService.fetchAttributes());
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_UPDATE);
      }
    }
    return true;
  }, [formData, attributes, selectedAttribute, formMode, closeFormDialog]);

  const openDeleteDialog = useCallback((attribute) => {
    setAttributeToDelete(attribute);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setAttributeToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(() => {
    if (!attributeToDelete) return false;
    const success = attributeService.deleteAttribute(attributeToDelete.id);
    if (success) {
      setAttributes(attributeService.fetchAttributes());
      closeDeleteDialog();
      toast.success(UI_TEXT.TOAST_DELETE);
      return true;
    }
    return false;
  }, [attributeToDelete, closeDeleteDialog]);

  return {
    // Data
    attributes,
    isLoading,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedAttribute,

    // Delete state
    isDeleteOpen,
    attributeToDelete,

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

export default useAttributes;

