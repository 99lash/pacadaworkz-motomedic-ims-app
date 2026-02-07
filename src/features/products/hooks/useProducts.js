import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';
import { productService } from '../services';
import categoryService from '../../categories/services/categoryService';
import brandService from '../../brands/services/brandService';

import {
  UI_TEXT,
  DEBOUNCE,
  INITIAL_PRODUCT_FORM,
  INITIAL_PRODUCT_ERRORS,
  validateProductForm,
  sanitizeProductData,
  mapProductToFormState,
} from '../utils';

import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setFilterOptions,
  setSearchTerm,
  setSelectedCategory,
  setSelectedBrand,
  setSelectedStatus,
  setCurrentPage,
  setPageSize,
  setSaving,
  setDeleting,
  setExporting,
  setFormDialogOpen,
  setEditingProduct,
} from '../productsSlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  const [isImporting, setIsImporting] = useState(false);
  const dispatch = useDispatch();
  
  // Redux State
  const {
    products,
    totalItems,
    isLoading,
    error,
    lastFetched,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedStatus,
    filterOptions,
    isSaving,
    isDeleting,
    isExporting,
    isFormDialogOpen,
    editingProduct,
    currentPage,
    pageSize,
  } = useSelector((state) => state.products);

  // Local Form State (Transient)
  const [formData, setFormData] = useState(createInitialFormState);
  const [formErrors, setFormErrors] = useState(createInitialFormErrors);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const isInitialLoad = useRef(true);

  // pagination hook sync
  const pagination = usePagination({
    initialPage: currentPage,
    initialPageSize: pageSize,
    totalItems,
  });

  const {
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    goToPage,
    changePageSize,
  } = pagination;

  // Sync Redux pagination with local hook (if needed, or just use Redux directly)
  // We'll update Redux when these change
  const handlePageChange = useCallback((page) => {
    dispatch(setCurrentPage(page));
    goToPage(page);
  }, [dispatch, goToPage]);

  const handlePageSizeChange = useCallback((size) => {
    dispatch(setPageSize(size));
    changePageSize(size);
  }, [dispatch, changePageSize]);

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (!isInitialLoad.current && searchTerm !== debouncedSearchTerm) {
        dispatch(setCurrentPage(1));
        goToPage(1);
      }
    }, DEBOUNCE.SEARCH);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, goToPage, debouncedSearchTerm]);

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
  const loadProducts = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    // Simple cache check: if not forcing refresh, and data exists and is fresh
    // Note: We might want to re-fetch if filters changed. 
    // Ideally, we should track 'lastFetchedParams' to strictly cache.
    // For now, we'll fetch if any filter/page changes or if forced.
    
    dispatch(fetchProductsStart());

    try {
      const result = await productService.fetchProductsPaginated({
        page: currentPage,
        pageSize,
        search: debouncedSearchTerm,
        ...normalizedFilters,
      });

      if (result.success) {
        dispatch(fetchProductsSuccess({
          products: result.data,
          totalItems: result.pagination.totalItems
        }));
      } else {
        dispatch(fetchProductsFailure(result.error));
        toast.error(UI_TEXT.TOAST_LOAD_ERROR);
      }
    } catch (err) {
      dispatch(fetchProductsFailure(err.message));
      toast.error(UI_TEXT.TOAST_LOAD_ERROR);
    } finally {
      isInitialLoad.current = false;
    }
  }, [dispatch, currentPage, pageSize, debouncedSearchTerm, normalizedFilters]);

  // load filter options
  const loadFilterOptions = useCallback(async () => {
    if (filterOptions.categories.length > 0 && filterOptions.brands.length > 0) return;

    try {
      const [categoriesResult, brandsResult] = await Promise.all([
        categoryService.fetchCategories(),
        brandService.fetchBrands(),
      ]);

      dispatch(setFilterOptions({
        categories: categoriesResult.success
          ? categoriesResult.data.map(cat => ({ value: cat.id, label: cat.name }))
          : [],
        brands: brandsResult.success
          ? brandsResult.data.map(brand => ({ value: brand.id, label: brand.name }))
          : [],
      }));
    } catch (err) {
      console.error('Failed to load product filter options', err);
    }
  }, [dispatch, filterOptions.categories.length, filterOptions.brands.length]);

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
    dispatch(setEditingProduct(null));
  }, [dispatch]);

  // dialog control
  const openCreateDialog = useCallback(() => {
    resetForm();
    dispatch(setFormDialogOpen(true));
  }, [resetForm, dispatch]);

  const openEditDialog = useCallback((product) => {
    console.log('openEditDialog: Product to Edit', product);

    // Lookup IDs based on names since backend only returns names
    const foundCategory = filterOptions.categories.find(
      (c) => c.label === product.categoryName
    );
    const foundBrand = filterOptions.brands.find(
      (b) => b.label === product.brandName
    );

    const categoryId = foundCategory ? foundCategory.value : '';
    const brandId = foundBrand ? foundBrand.value : '';

    setEditingProduct(product);
    setFormData({
      ...mapProductToFormState(product),
      categoryId,
      brandId,
    });
    dispatch(setEditingProduct(product));
    setFormData(mapProductToFormState(product));
    setFormErrors(createInitialFormErrors());
    setIsFormDialogOpen(true);
  }, [filterOptions]);
    dispatch(setFormDialogOpen(true));
  }, [dispatch]);

  const closeFormDialog = useCallback(() => {
    dispatch(setFormDialogOpen(false));
    resetForm();
  }, [resetForm, dispatch]);

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

    dispatch(setSaving(true));
    try {
      const payload = sanitizeProductData(formData);
      const result = editingProduct
        ? await productService.updateProduct(editingProduct.id, payload)
        : await productService.createProduct(payload);

      if (result.success) {
        toast.success(editingProduct ? UI_TEXT.TOAST_UPDATE_SUCCESS : UI_TEXT.TOAST_CREATE_SUCCESS);
        await loadProducts(true);
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
      dispatch(setSaving(false));
    }
  }, [editingProduct, formData, validateForm, loadProducts, closeFormDialog, dispatch]);

  // delete product
  const handleDeleteProduct = useCallback(
    async (productId) => {
      dispatch(setDeleting(true));
      try {
        const result = await productService.deleteProduct(productId);
        if (result.success) {
          toast.success(UI_TEXT.TOAST_DELETE_SUCCESS);
          await loadProducts(true);
          return true;
        }

        toast.error(result.error || UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      } catch (err) {
        console.error('Failed to delete product', err);
        toast.error(UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      } finally {
        dispatch(setDeleting(false));
      }
    },
    [loadProducts, dispatch]
  );

  // export CSV
  const handleExportProducts = useCallback(async () => {
    dispatch(setExporting(true));
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
      dispatch(setExporting(false));
    }
  }, [debouncedSearchTerm, normalizedFilters]);

  // import CSV
  const handleImportProducts = useCallback(async (file) => {
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim()).map(row => {
          // Handle simple CSV (comma separated, no escaped commas)
          return row.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
        });

        if (rows.length < 2) {
          toast.error('CSV file is empty or missing data');
          setIsImporting(false);
          return;
        }

        const headers = rows[0].map(h => h.toLowerCase());
        const dataRows = rows.slice(1);
        
        let successCount = 0;
        let errorCount = 0;

        for (const row of dataRows) {
          const productData = {
            attributes: [],
          };
          
          headers.forEach((header, index) => {
            const value = row[index] || '';
            if (header.includes('sku')) productData.sku = value;
            else if (header.includes('name')) productData.name = value;
            else if (header.includes('category')) {
              const found = filterOptions.categories.find(c => c.label.toLowerCase() === value.toLowerCase());
              productData.categoryId = found ? found.value : '';
            }
            else if (header.includes('brand')) {
              const found = filterOptions.brands.find(b => b.label.toLowerCase() === value.toLowerCase());
              productData.brandId = found ? found.value : '';
            }
            else if (header.includes('selling') || header.includes('unit price')) productData.sellingPrice = value;
            else if (header.includes('cost')) productData.costPrice = value;
            else if (header.includes('description')) productData.description = value;
            else if (header.includes('reorder')) productData.reorderPoint = value;
          });

          // Validation & Defaults
          if (!productData.name || !productData.sku) {
            errorCount++;
            continue;
          }
          
          if (!productData.reorderPoint) productData.reorderPoint = '10';
          if (!productData.costPrice) productData.costPrice = '0';
          if (!productData.sellingPrice) productData.sellingPrice = '0';

          const result = await productService.createProduct(productData);
          if (result.success) successCount++;
          else errorCount++;
        }

        if (successCount > 0) {
          toast.success(`${successCount} products imported successfully`);
          await loadProducts();
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} products failed to import`);
        }
      } catch (err) {
        console.error('Import failed', err);
        toast.error(UI_TEXT.TOAST_IMPORT_ERROR);
      } finally {
        setIsImporting(false);
        // Reset file input if needed (handled in component)
      }
    };

    reader.onerror = () => {
      toast.error(UI_TEXT.TOAST_IMPORT_ERROR);
      setIsImporting(false);
    };

    reader.readAsText(file);
  }, [filterOptions, loadProducts]);
  }, [debouncedSearchTerm, normalizedFilters, dispatch]);

  // filter handlers
  const handleCategoryFilterChange = useCallback(
    (value) => {
      dispatch(setSelectedCategory(value));
      dispatch(setCurrentPage(1));
      goToPage(1);
    },
    [dispatch, goToPage]
  );

  const handleBrandFilterChange = useCallback(
    (value) => {
      dispatch(setSelectedBrand(value));
      dispatch(setCurrentPage(1));
      goToPage(1);
    },
    [dispatch, goToPage]
  );

  const handleStatusFilterChange = useCallback(
    (value) => {
      dispatch(setSelectedStatus(value));
      dispatch(setCurrentPage(1));
      goToPage(1);
    },
    [dispatch, goToPage]
  );

  const handleSearchChange = useCallback((value) => {
    dispatch(setSearchTerm(value));
  }, [dispatch]);

  return {
    products,
    totalItems,
    searchTerm,
    setSearchTerm: handleSearchChange,
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
    isImporting,
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
    handleImportProducts,
    handleCategoryFilterChange,
    handleBrandFilterChange,
    handleStatusFilterChange,
    handlePageSizeChange,
    handlePageChange,
  };
};

export default useProducts;
