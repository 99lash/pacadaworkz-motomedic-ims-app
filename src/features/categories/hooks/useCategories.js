/**
 * useCategories Hook
 * 
 * Custom hook that encapsulates all category-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { categoryService } from '../services';
import { validateCategoryForm, sanitizeCategoryData, UI_TEXT, DEBOUNCE } from '../utils';

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
 * Categories management hook
 * @returns {Object} Categories state and handlers
 */
export const useCategories = () => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  
  // Data state
  const [categories, setCategories] = useState([]);
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
  
  // ---------------------------------------------------------------------------
  // DEBOUNCED SEARCH
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE.SEARCH);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // ---------------------------------------------------------------------------
  // FILTERED CATEGORIES (Memoized)
  // ---------------------------------------------------------------------------
  const filteredCategories = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return categories;
    }
    
    const searchLower = debouncedSearchTerm.toLowerCase();
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower)
    );
  }, [categories, debouncedSearchTerm]);
  
  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  
  /**
   * Loads categories from the server
   */
  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await categoryService.fetchCategories();
      
      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.error);
        toast.error(UI_TEXT.TOAST_LOAD_ERROR);
      }
    } catch (err) {
      setError(err.message);
      toast.error(UI_TEXT.TOAST_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  // ---------------------------------------------------------------------------
  // FORM HANDLERS
  // ---------------------------------------------------------------------------
  
  /**
   * Updates form field value
   */
  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);
  
  /**
   * Validates the form
   */
  const validateForm = useCallback(() => {
    const { isValid, errors } = validateCategoryForm(
      formData,
      categories,
      editingCategory?.id
    );
    
    setFormErrors(errors);
    return isValid;
  }, [formData, categories, editingCategory]);
  
  /**
   * Resets form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setEditingCategory(null);
  }, []);
  
  // ---------------------------------------------------------------------------
  // DIALOG HANDLERS
  // ---------------------------------------------------------------------------
  
  /**
   * Opens the add category dialog
   */
  const openAddDialog = useCallback(() => {
    resetForm();
    setIsAddDialogOpen(true);
  }, [resetForm]);
  
  /**
   * Closes the add category dialog
   */
  const closeAddDialog = useCallback(() => {
    setIsAddDialogOpen(false);
    resetForm();
  }, [resetForm]);
  
  /**
   * Opens the edit category dialog
   */
  const openEditDialog = useCallback((category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    setIsEditDialogOpen(true);
  }, []);
  
  /**
   * Closes the edit category dialog
   */
  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    resetForm();
  }, [resetForm]);
  
  // ---------------------------------------------------------------------------
  // CRUD OPERATIONS
  // ---------------------------------------------------------------------------
  
  /**
   * Creates a new category
   */
  const handleAddCategory = useCallback(async () => {
    if (!validateForm()) return false;
    
    setIsSaving(true);
    
    try {
      const sanitizedData = sanitizeCategoryData(formData);
      const result = await categoryService.createCategory(sanitizedData);
      
      if (result.success) {
        setCategories((prev) => [...prev, result.data]);
        closeAddDialog();
        toast.success(UI_TEXT.TOAST_ADD_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_SAVE_ERROR);
        return false;
      }
    } catch (err) {
      toast.error(UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, formData, closeAddDialog]);
  
  /**
   * Updates an existing category
   */
  const handleEditCategory = useCallback(async () => {
    if (!validateForm() || !editingCategory) return false;
    
    setIsSaving(true);
    
    try {
      const sanitizedData = sanitizeCategoryData(formData);
      const result = await categoryService.updateCategory(editingCategory.id, sanitizedData);
      
      if (result.success) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingCategory.id ? result.data : cat))
        );
        closeEditDialog();
        toast.success(UI_TEXT.TOAST_UPDATE_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_SAVE_ERROR);
        return false;
      }
    } catch (err) {
      toast.error(UI_TEXT.TOAST_SAVE_ERROR);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [validateForm, formData, editingCategory, closeEditDialog]);
  
  /**
   * Deletes a category
   */
  const handleDeleteCategory = useCallback(async (categoryId) => {
    setIsDeleting(true);
    
    try {
      const result = await categoryService.deleteCategory(categoryId);
      
      if (result.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        toast.success(UI_TEXT.TOAST_DELETE_SUCCESS);
        return true;
      } else {
        toast.error(result.error || UI_TEXT.TOAST_DELETE_ERROR);
        return false;
      }
    } catch (err) {
      toast.error(UI_TEXT.TOAST_DELETE_ERROR);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);
  
  // ---------------------------------------------------------------------------
  // RETURN VALUE
  // ---------------------------------------------------------------------------
  return {
    // Data
    categories,
    filteredCategories,
    
    // Search
    searchTerm,
    setSearchTerm,
    
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

