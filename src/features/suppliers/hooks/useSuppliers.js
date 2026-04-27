import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { supplierService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateSupplierForm,
} from '../utils';

import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

export const useSuppliers = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const [suppliers, setSuppliers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isSaving, setIsSaving] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const isInitialLoad = useRef(true);
  const isFetchingSuppliersRef = useRef(false);

  const isEditing = !!selectedSupplier;

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

  // Debounced search - trims and only triggers if content changed
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedSearch = searchTerm.trim();
      if (trimmedSearch !== debouncedSearchTerm) {
        setDebouncedSearchTerm(trimmedSearch);
        if (!isInitialLoad.current) {
          goToPage(1);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearchTerm, goToPage]);

  const loadSuppliers = useCallback(async () => {
    if (isFetchingSuppliersRef.current) return;
    isFetchingSuppliersRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const response = await supplierService.fetchSuppliersPaginated({
        page: currentPage,
        pageSize: pageSize,
        search: debouncedSearchTerm,
      });
      if (response.success) {
        setSuppliers(response.data);
        setTotalItems(response.pagination.totalItems);
      } else {
        setError(response.error);
        toast.error(response.error);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingSuppliersRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedSupplier(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback(async (supplier) => {
    resetForm();
    const response = await supplierService.fetchSupplierById(supplier.id);
    if (response.success) {
      setSelectedSupplier(response.data);
      setFormData({
        companyName: response.data.companyName || '',
        contactPerson: response.data.contactPerson || '',
        phone: response.data.phone || '',
        email: response.data.email || '',
        address: response.data.address || '',
        paymentTerms: response.data.paymentTerms || '',
      });
      setIsFormOpen(true);
    } else {
      toast.error(response.error);
    }
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

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateSupplierForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    setIsSaving(true);

    let response;
    if (isEditing) {
      response = await supplierService.updateSupplier(selectedSupplier.id, formData);
    } else {
      response = await supplierService.createSupplier(formData);
    }

    setIsSaving(false);

    if (response.success) {
      toast.success(isEditing ? UI_TEXT.TOAST_UPDATE : UI_TEXT.TOAST_CREATE);
      closeFormDialog();
      await loadSuppliers();
      return true;
    }

    toast.error(response.error);
    return false;
  }, [formData, isEditing, selectedSupplier, closeFormDialog, loadSuppliers]);

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
    const response = await supplierService.deleteSupplier(supplierToDelete.id);
    if (response.success) {
      toast.success(UI_TEXT.TOAST_DELETE);
      closeDeleteDialog();
      await loadSuppliers();
      return true;
    }
    toast.error(response.error);
    return false;
  }, [supplierToDelete, closeDeleteDialog, loadSuppliers]);

  return {
    // Data
    suppliers,
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
    isEditing,
    isSaving,
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

    // Search
    searchTerm,
    setSearchTerm,
  };
};

export default useSuppliers;
