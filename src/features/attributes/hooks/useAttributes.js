import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { attributeService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateAttributeForm,
} from '../utils';

export const useAttributes = () => {
  const [attributes, setAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [attributeToDelete, setAttributeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const isFetchingAttributesRef = useRef(false);

  const fetchAllAttributes = useCallback(async () => {
    if (isFetchingAttributesRef.current) return;
    isFetchingAttributesRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const data = await attributeService.fetchAttributes();
      setAttributes(data);
    } catch (err) {
      setError(err);
      toast.error('Failed to fetch attributes.');
      console.error('Failed to fetch attributes:', err);
    } finally {
      setIsLoading(false);
      isFetchingAttributesRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAllAttributes();
  }, [fetchAllAttributes]);

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

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateAttributeForm(formData, attributes, selectedAttribute?.id);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    try {
      if (formMode === 'create') {
        await attributeService.createAttribute(formData);
        toast.success(UI_TEXT.TOAST_CREATE);
      } else {
        await attributeService.updateAttribute(selectedAttribute.id, formData);
        toast.success(UI_TEXT.TOAST_UPDATE);
      }
      closeFormDialog();
      fetchAllAttributes(); // Refresh the list
      return true;
    } catch (err) {
      toast.error(`Failed to ${formMode} attribute.`);
      console.error(`Failed to ${formMode} attribute:`, err);
      return false;
    }
  }, [formData, attributes, selectedAttribute, formMode, closeFormDialog, fetchAllAttributes]);

  const openDeleteDialog = useCallback((attribute) => {
    setAttributeToDelete(attribute);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setAttributeToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!attributeToDelete) return false;
    try {
      await attributeService.deleteAttribute(attributeToDelete.id);
      toast.success(UI_TEXT.TOAST_DELETE);
      closeDeleteDialog();
      fetchAllAttributes(); // Refresh the list
      return true;
    } catch (err) {
      toast.error('Failed to delete attribute.');
      console.error('Failed to delete attribute:', err);
      return false;
    }
  }, [attributeToDelete, closeDeleteDialog, fetchAllAttributes]);

  return {
    // Data
    attributes,
    isLoading,
    error,

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
