/**
 * useCategories Hook
 * 
 * Custom hook that encapsulates all category-related state management
 * and business logic. Separates concerns from UI components.
 * 
 * Features:
 * - Paginated data fetching
 * - Server-side search (debounced)
 * - CRUD operations
 * - Loading and error states
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { categoryService } from '../services';
import { validateCategoryForm, sanitizeCategoryData, UI_TEXT, DEBOUNCE } from '../utils';
import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

// =============================================================================
// INITIAL STATE
// =============================================================================

const INITIAL_FORM_STATE = {
  name: '',
  description: '',
};

const INITIAL_FORM_ERRORS = {
  name: '',
  description: '',
};

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * Categories management hook with pagination
 * @param {Object} options - Hook options
 * @param {number} options.initialPageSize - Initial items per page
 * @returns {Object} Categories state and handlers
 */
export const useCategories = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  // Data state
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [allCategories, setAllCategories] = useState([]); // For validation

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);

  // Ref to track if initial load is complete
  const isInitialLoad = useRef(true);
  const isFetchingCategoriesRef = useRef(false);

  // ---------------------------------------------------------------------------
  // PAGINATION HOOK
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // DEBOUNCED SEARCH
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      // Reset to page 1 when search changes
      if (!isInitialLoad.current) {
        goToPage(1);
      }
    }, DEBOUNCE.SEARCH);

    return () => clearTimeout(timer);
  }, [searchTerm, goToPage]);

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------

  /**
   * Loads categories with pagination and search
   */
  const loadCategories = useCallback(async () => {
    if (isFetchingCategoriesRef.current) {
      return;
    }

    isFetchingCategoriesRef.current = true;
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.fetchCategoriesPaginated({
        page: currentPage,
        pageSize,
        search: debouncedSearchTerm,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (result.success) {
        setCategories(result.data);
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
      isFetchingCategoriesRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  /**
   * Loads all categories for validation (name uniqueness check)
   */
  const loadAllCategories = useCallback(async () => {
    try {
      const result = await categoryService.fetchCategories();
      if (result.success) {
        setAllCategories(result.data);
      }
    } catch (err) {
      console.error('Failed to load all categories for validation:', err);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // FORM HANDLERS
  // ---------------------------------------------------------------------------

  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const { isValid, errors } = validateCategoryForm(
      formData,
      allCategories,
      editingCategory?.id
    );
    setFormErrors(errors);
    return isValid;
  }, [formData, allCategories, editingCategory]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setEditingCategory(null);
  }, []);

  // Initial load and reload on pagination/search changes
  useEffect(() => {
    loadCategories();
  }, [currentPage, pageSize, debouncedSearchTerm]);

  // Clean up dialog states when component unmounts
  useEffect(() => {
    return () => {
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      resetForm();
    };
  }, [resetForm]);

  // ---------------------------------------------------------------------------
  // DIALOG HANDLERS
  // ---------------------------------------------------------------------------

  const openAddDialog = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
    loadAllCategories();
  }, [resetForm, loadAllCategories]);

  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
    resetForm();
  }, [resetForm]);

  const openEditDialog = useCallback((category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsEditDialogOpen(true);
    loadAllCategories();
  }, [loadAllCategories]);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    resetForm();
  }, [resetForm]);

  // ---------------------------------------------------------------------------
  // CRUD OPERATIONS
  // ---------------------------------------------------------------------------

  const handleAddCategory = useCallback(async () => {
    if (!validateForm()) return false;

    setIsSaving(true);

    try {
      const sanitizedData = sanitizeCategoryData(formData);
      const result = await categoryService.createCategory(sanitizedData);

      if (result.success) {
        // Refresh data to show new category
        await loadCategories();
        await loadAllCategories();
        closeAddDialog();
        toast.success(UI_TEXT.TOAST_ADD_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_SAVE_ERROR);
        return false;
      }
    } catch {
      toast.error(UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, formData, closeAddDialog, loadCategories, loadAllCategories]);

  const handleEditCategory = useCallback(async () => {
    if (!validateForm() || !editingCategory) return false;

    setIsSaving(true);

    try {
      const sanitizedData = sanitizeCategoryData(formData);
      const result = await categoryService.updateCategory(editingCategory.id, sanitizedData);

      if (result.success) {
        // Update local state
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? result.data : cat))
        );
        await loadAllCategories();
        closeEditDialog();
        toast.success(UI_TEXT.TOAST_UPDATE_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_SAVE_ERROR);
        return false;
      }
    } catch {
      toast.error(UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, formData, editingCategory, closeEditDialog, loadAllCategories]);

  const handleDeleteCategory = useCallback(async (categoryId) => {
    setIsDeleting(true);

    try {
      const result = await categoryService.deleteCategory(categoryId);

      if (result.success) {
        // Refresh data
        await loadCategories();
        await loadAllCategories();
        toast.success(UI_TEXT.TOAST_DELETE_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      }
    } catch {
      toast.error(UI_TEXT.TOAST_DELETE_ERROR);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [loadCategories, loadAllCategories]);

  // ---------------------------------------------------------------------------
  // PAGINATION HANDLERS
  // ---------------------------------------------------------------------------

  const handlePageChange = useCallback((page) => {
    goToPage(page);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

  // ---------------------------------------------------------------------------
  // RETURN VALUE
  // ---------------------------------------------------------------------------

  return {
    // Data
    categories,
    totalItems,

    // Search
    searchTerm,
    setSearchTerm,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Loading states
    isLoading,
    isSaving,
    isDeleting,

    // Error
    error,

    // Dialog states
    isAddDialogOpen,
    isEditDialogOpen,
    editingCategory,

    // Form
    formData,
    formErrors,
    handleFormChange,

    // Dialog handlers
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    closeEditDialog,

    // CRUD handlers
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,

    // Refresh
    refreshCategories: loadCategories,
  };
};

export default useCategories;
