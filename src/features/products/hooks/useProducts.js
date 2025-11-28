import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';
import { productService } from '../services';

import {
  UI_TEXT,
  DEBOUNCE,
  PRODUCT_STATUSES,
  INITIAL_PRODUCT_FORM,
  INITIAL_PRODUCT_ERRORS,
  validateProductForm,
  sanitizeProductData,
  mapProductToFormState,
} from '../utils';

// helpers
const createInitialFormState = () => ({ ...INITIAL_PRODUCT_FORM });
const createInitialFormErrors = () => ({ ...INITIAL_PRODUCT_ERRORS });

export const useProducts = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  // base state
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);

  // filters
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState(PRODUCT_STATUSES[0]?.value || 'all');

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    brands: [],
    statuses: PRODUCT_STATUSES,
  });

  // ui state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // dialog + form
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(createInitialFormState);
  const [formErrors, setFormErrors] = useState(createInitialFormErrors);

  const isInitialLoad = useRef(true);

  // pagination
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

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (!isInitialLoad.current) goToPage(1);
    }, DEBOUNCE.SEARCH);

    return () => clearTimeout(timer);
  }, [searchTerm, goToPage]);

  // normalized filters
  const normalizedFilters = useMemo(
    () => ({
      categoryId: selectedCategory === 'all' ? '' : selectedCategory,
      brandId: selectedBrand === 'all' ? '' : selectedBrand,
      status: selectedStatus === 'all' ? '' : selectedStatus,
    }),
    [selectedCategory, selectedBrand, selectedStatus]
  );

  // load products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await productService.fetchProductsPaginated({
        page: currentPage,
        pageSize,
        search: debouncedSearchTerm,
        ...normalizedFilters,
      });

      if (result.success) {
        setProducts(result.data);
        setTotalItems(result.pagination.totalItems);
      } else {
        setError(result.error);
        toast.error(UI_TEXT.TOAST_LOAD_ERROR);
      }
    } catch (err) {
      setError(err.message);
      toast.error(UI_TEXT.TOAST_LOAD_ERROR);
    } finally {
      setIsLoading(false);
      isInitialLoad.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm, normalizedFilters]);

  // load filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const result = await productService.fetchFilterOptions();
      if (result.success) {
        setFilterOptions({
          categories: result.data.categories || [],
          brands: result.data.brands || [],
          statuses: PRODUCT_STATUSES,
        });
      }
    } catch (err) {
      console.error('Failed to load product filter options', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // reset form
  const resetForm = useCallback(() => {
    setFormData(createInitialFormState());
    setFormErrors(createInitialFormErrors());
    setEditingProduct(null);
  }, []);

  // dialog control
  const openCreateDialog = useCallback(() => {
    resetForm();
    setIsFormDialogOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((product) => {
    setEditingProduct(product);
    setFormData(mapProductToFormState(product));
    setFormErrors(createInitialFormErrors());
    setIsFormDialogOpen(true);
  }, []);

  const closeFormDialog = useCallback(() => {
    setIsFormDialogOpen(false);
    resetForm();
  }, [resetForm]);

  // form change
  const handleFormFieldChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [formErrors]
  );

  const handleAttributesChange = useCallback((attributes) => {
    setFormData((prev) => ({ ...prev, attributes }));
  }, []);

  // validation
  const validateForm = useCallback(() => {
    const { isValid, errors } = validateProductForm(formData);
    setFormErrors(errors);
    return isValid;
  }, [formData]);

  // save product
  const handleSubmitProduct = useCallback(async () => {
    if (!validateForm()) return false;

    setIsSaving(true);
    try {
      const payload = sanitizeProductData(formData);
      const result = editingProduct
        ? await productService.updateProduct(editingProduct.id, payload)
        : await productService.createProduct(payload);

      if (result.success) {
        toast.success(editingProduct ? UI_TEXT.TOAST_UPDATE_SUCCESS : UI_TEXT.TOAST_CREATE_SUCCESS);
        await loadProducts();
        closeFormDialog();
        return true;
      }

      toast.error(result.error || UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } catch (err) {
      console.error('Failed to save product', err);
      toast.error(UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [editingProduct, formData, validateForm, loadProducts, closeFormDialog]);

  // delete product
  const handleDeleteProduct = useCallback(
    async (productId) => {
      setIsDeleting(true);
      try {
        const result = await productService.deleteProduct(productId);
        if (result.success) {
          toast.success(UI_TEXT.TOAST_DELETE_SUCCESS);
          await loadProducts();
          return true;
        }

        toast.error(result.error || UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      } catch (err) {
        console.error('Failed to delete product', err);
        toast.error(UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [loadProducts]
  );

  // export CSV
  const handleExportProducts = useCallback(async () => {
    setIsExporting(true);
    try {
      const result = await productService.exportProductsAsCsv({
        search: debouncedSearchTerm,
        ...normalizedFilters,
      });

      if (result.success) {
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', result.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success(UI_TEXT.TOAST_EXPORT_SUCCESS);
        return true;
      }

      toast.error(result.error || UI_TEXT.TOAST_EXPORT_ERROR);
      return false;
    } catch (err) {
      console.error('Failed to export products', err);
      toast.error(UI_TEXT.TOAST_EXPORT_ERROR);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [debouncedSearchTerm, normalizedFilters]);

  // filter handlers
  const handleCategoryFilterChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      goToPage(1);
    },
    [goToPage]
  );

  const handleBrandFilterChange = useCallback(
    (value) => {
      setSelectedBrand(value);
      goToPage(1);
    },
    [goToPage]
  );

  const handleStatusFilterChange = useCallback(
    (value) => {
      setSelectedStatus(value);
      goToPage(1);
    },
    [goToPage]
  );

  return {
    products,
    totalItems,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    filterOptions,
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    isLoading,
    isSaving,
    isDeleting,
    isExporting,
    error,
    isFormDialogOpen,
    isEditing: Boolean(editingProduct),
    formData,
    formErrors,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAttributesChange,
    handleSubmitProduct,
    handleDeleteProduct,
    handleExportProducts,
    handleCategoryFilterChange,
    handleBrandFilterChange,
    handleStatusFilterChange,
    handlePageSizeChange: changePageSize,
    handlePageChange: goToPage,
  };
};

export default useProducts;
