import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { brandService } from '../services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validateBrandForm,
} from '../utils';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

export const useBrands = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const [brands, setBrands] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
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
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const isInitialLoad = useRef(true);
  const isFetchingBrandsRef = useRef(false);

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

  const fetchBrandsPaginated = useCallback(async () => {
    if (isFetchingBrandsRef.current) return;
    isFetchingBrandsRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const { data, success, pagination: brandPagination, error: fetchError } = await brandService.fetchBrandsPaginated({ 
        page: currentPage, 
        pageSize: pageSize,
        search: debouncedSearchTerm,
      });
      if (success) {
        setBrands(data);
        setTotalItems(brandPagination.totalItems);
      } else {
        setError(fetchError);
        toast.error(UI_TEXT.TOAST_FETCH_ERROR);
      }
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingBrandsRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchBrandsPaginated();
  }, [fetchBrandsPaginated]);

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

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
        await fetchBrandsPaginated();
        closeFormDialog();
        toast.success(UI_TEXT.TOAST_CREATE);
      } else {
        toast.error(createError || UI_TEXT.TOAST_CREATE_ERROR);
      }
    } else {
      const { success, error: updateError } = await brandService.updateBrand(selectedBrand.id, formData);
      if (success) {
        await fetchBrandsPaginated();
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
      await fetchBrandsPaginated();
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

    // Search
    searchTerm,
    setSearchTerm,
  };
};

export default useBrands;
