import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { attributeService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateAttributeForm,
} from '../utils';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

export const useAttributes = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const [attributes, setAttributes] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isValuesOpen, setIsValuesOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [attributeToDelete, setAttributeToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  // Values state
  const [valueInput, setValueInput] = useState('');
  const [editingValueId, setEditingValueId] = useState(null);
  const [isValueLoading, setIsValueLoading] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const isInitialLoad = useRef(true);
  const isFetchingAttributesRef = useRef(false);

  // Pagination hook
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize,
    totalItems,
  });

  const {
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    goToPage,
    changePageSize,
  } = pagination;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (!isInitialLoad.current) {
        goToPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, goToPage]);

  const fetchAttributesPaginated = useCallback(async () => {
    if (isFetchingAttributesRef.current) return;
    isFetchingAttributesRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const result = await attributeService.fetchAttributesPaginated({
        page: currentPage,
        pageSize: pageSize,
        search: debouncedSearchTerm,
      });
      if (result.success) {
        setAttributes(result.data);
        setTotalItems(result.pagination.totalItems);
      }
    } catch (err) {
      setError(err);
      toast.error('Failed to fetch attributes.');
      console.error('Failed to fetch attributes:', err);
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingAttributesRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchAttributesPaginated();
  }, [fetchAttributesPaginated]);

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

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
      fetchAttributesPaginated(); // Refresh the list
      return true;
    } catch (err) {
      toast.error(`Failed to ${formMode} attribute.`);
      console.error(`Failed to ${formMode} attribute:`, err);
      return false;
    }
  }, [formData, attributes, selectedAttribute, formMode, closeFormDialog, fetchAttributesPaginated]);

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
      fetchAttributesPaginated(); // Refresh the list
      return true;
    } catch (err) {
      toast.error('Failed to delete attribute.');
      console.error('Failed to delete attribute:', err);
      return false;
    }
  }, [attributeToDelete, closeDeleteDialog, fetchAttributesPaginated]);

  // Attribute Values Handlers
  const openValuesDialog = useCallback((attribute) => {
    setSelectedAttribute(attribute);
    setIsValuesOpen(true);
    setValueInput('');
    setEditingValueId(null);
  }, []);

  const closeValuesDialog = useCallback(() => {
    setIsValuesOpen(false);
    setSelectedAttribute(null);
    setValueInput('');
    setEditingValueId(null);
  }, []);

  const handleValueSubmit = useCallback(async () => {
    if (!valueInput.trim() || !selectedAttribute) return;

    setIsValueLoading(true);
    try {
      if (editingValueId) {
        await attributeService.updateAttributeValue(editingValueId, { value: valueInput.trim() });
        toast.success(UI_TEXT.TOAST_VALUE_UPDATE);
      } else {
        await attributeService.addAttributeValue(selectedAttribute.id, { value: valueInput.trim() });
        toast.success(UI_TEXT.TOAST_VALUE_ADD);
      }
      
      setValueInput('');
      setEditingValueId(null);
      
      // Refresh attribute details to show new values
      const updated = await attributeService.fetchAttributeById(selectedAttribute.id);
      if (updated) {
        setSelectedAttribute(updated);
        // Also refresh the main list to update counts
        fetchAttributesPaginated();
      }
    } catch (err) {
      toast.error('Failed to save attribute value.');
      console.error('Failed to save attribute value:', err);
    } finally {
      setIsValueLoading(false);
    }
  }, [valueInput, selectedAttribute, editingValueId, fetchAttributesPaginated]);

  const handleEditValue = useCallback((val) => {
    setValueInput(val.value);
    setEditingValueId(val.id);
  }, []);

  const handleDeleteValue = useCallback(async (valueId) => {
    if (!window.confirm('Are you sure you want to delete this value?')) return;

    setIsValueLoading(true);
    try {
      await attributeService.deleteAttributeValue(valueId);
      toast.success(UI_TEXT.TOAST_VALUE_DELETE);
      
      // Refresh attribute details
      const updated = await attributeService.fetchAttributeById(selectedAttribute.id);
      if (updated) {
        setSelectedAttribute(updated);
        fetchAttributesPaginated();
      }
    } catch (err) {
      toast.error('Failed to delete attribute value.');
      console.error('Failed to delete attribute value:', err);
    } finally {
      setIsValueLoading(false);
    }
  }, [selectedAttribute, fetchAttributesPaginated]);

  return {
    // Data
    attributes,
    totalItems,
    isLoading,
    error,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedAttribute,

    // Delete state
    isDeleteOpen,
    attributeToDelete,

    // Values state
    isValuesOpen,
    valueInput,
    setValueInput,
    editingValueId,
    isValueLoading,
    openValuesDialog,
    closeValuesDialog,
    handleValueSubmit,
    handleEditValue,
    handleDeleteValue,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleSubmit,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,

    // Search
    searchTerm,
    setSearchTerm,
  };
};

export default useAttributes;

