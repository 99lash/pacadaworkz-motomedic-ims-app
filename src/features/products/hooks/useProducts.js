import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';
import { productService } from '../services';
import categoryService from '../../categories/services/categoryService';
import brandService from '../../brands/services/brandService';

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
  const [isImporting, setIsImporting] = useState(false);

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
      const [categoriesResult, brandsResult] = await Promise.all([
        categoryService.fetchCategories(),
        brandService.fetchBrands(),
      ]);

      setFilterOptions({
        categories: categoriesResult.success
          ? categoriesResult.data.map(cat => ({ value: cat.id, label: cat.name }))
          : [],
        brands: brandsResult.success
          ? brandsResult.data.map(brand => ({ value: brand.id, label: brand.name }))
          : [],
        statuses: PRODUCT_STATUSES,
      });
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
    setFormErrors(createInitialFormErrors());
    setIsFormDialogOpen(true);
  }, [filterOptions]);

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
    handlePageSizeChange: changePageSize,
    handlePageChange: goToPage,
  };
};

export default useProducts;
