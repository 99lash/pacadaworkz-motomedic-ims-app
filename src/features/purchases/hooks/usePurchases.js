import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { purchaseService } from '../services';
import supplierService from '../../suppliers/services/supplierService';
import productService from '../../products/services/productService';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validatePurchaseOrderForm,
} from '../utils';

import { usePagination, DEFAULT_PAGE_SIZE } from '../../../shared/hooks';

export const usePurchases = ({ initialPageSize = DEFAULT_PAGE_SIZE } = {}) => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState(null);
  const [purchaseOrderToReceive, setPurchaseOrderToReceive] = useState(null);

  // Form state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  const isInitialLoad = useRef(true);
  const isFetchingDataRef = useRef(false);

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

  const fetchData = useCallback(async (silent = false) => {
    if (isFetchingDataRef.current) return;
    isFetchingDataRef.current = true;
    if (!silent) setIsLoading(true);
    try {
      const [purchasesResult, suppliersResponse, productsResponse] = await Promise.all([
        purchaseService.fetchPurchaseOrdersPaginated({
          page: currentPage,
          pageSize: pageSize,
          search: debouncedSearchTerm,
        }),
        supplierService.fetchSuppliers(),
        productService.fetchProducts(),
      ]);

      if (purchasesResult.success) {
        setPurchaseOrders(purchasesResult.data);
        setTotalItems(purchasesResult.pagination.totalItems);
      }
      
      if (suppliersResponse.success) {
        setSuppliers(suppliersResponse.data);
      }
      
      if (productsResponse.success) {
        setProducts(productsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      if (!silent) setIsLoading(false);
      isInitialLoad.current = false;
      isFetchingDataRef.current = false;
    }
  }, [currentPage, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = useCallback((newPage) => {
    goToPage(newPage);
  }, [goToPage]);

  const handlePageSizeChange = useCallback((newSize) => {
    changePageSize(newSize);
  }, [changePageSize]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors(INITIAL_FORM_ERRORS);
    setSelectedPurchaseOrder(null);
  }, []);

  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    resetForm();
    setIsFormOpen(true);
  }, [resetForm]);

  const openEditDialog = useCallback((purchaseOrder) => {
    setFormMode('edit');
    setSelectedPurchaseOrder(purchaseOrder);
    setFormData({
      supplierId: String(purchaseOrder.supplierId || ''),
      expectedDeliveryDate: purchaseOrder.expectedDeliveryDate || '',
      notes: purchaseOrder.notes || '',
      items: (purchaseOrder.items || []).map(item => ({
        productId: String(item.productId),
        quantityOrdered: item.quantityOrdered,
        costPrice: item.costPrice,
      })),
    });
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

  const handleAddItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantityOrdered: 1, costPrice: 0 }],
    }));
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return { ...prev, items: updatedItems };
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validatePurchaseOrderForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return false;
    }

    try {
      if (formMode === 'edit' && selectedPurchaseOrder) {
        await purchaseService.updatePurchaseOrder(selectedPurchaseOrder.id, formData);
        toast.success(UI_TEXT.TOAST_UPDATE || 'Purchase order updated successfully');
      } else {
        await purchaseService.createPurchaseOrder(formData);
        toast.success(UI_TEXT.TOAST_CREATE);
      }
      
      await fetchData(true); // Silent refresh
      closeFormDialog();
      return true;
    } catch (error) {
      toast.error(error.message || `Failed to ${formMode} purchase order`);
      return false;
    }
  }, [formData, formMode, selectedPurchaseOrder, closeFormDialog, fetchData]);

  const openReceiveDialog = useCallback((purchaseOrder) => {
    setPurchaseOrderToReceive(purchaseOrder);
    setIsReceiveOpen(true);
  }, []);

  const closeReceiveDialog = useCallback(() => {
    setPurchaseOrderToReceive(null);
    setIsReceiveOpen(false);
  }, []);

  const openDetailsDialog = useCallback((purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsDetailsOpen(true);
  }, []);

  const closeDetailsDialog = useCallback(() => {
    setSelectedPurchaseOrder(null);
    setIsDetailsOpen(false);
  }, []);

  const handleMarkAsReceived = useCallback(async () => {
    if (!purchaseOrderToReceive) return false;

    try {
      const updated = await purchaseService.markPurchaseOrderAsReceived(purchaseOrderToReceive.id);
      if (updated) {
        await fetchData(true); // Silent refresh
        closeReceiveDialog();
        toast.success(UI_TEXT.TOAST_RECEIVED);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking purchase order as received:', error);
      toast.error('Failed to update purchase order');
      return false;
    }
  }, [purchaseOrderToReceive, closeReceiveDialog, fetchData]);

  const openDeleteDialog = useCallback((purchaseOrder) => {
    setPurchaseOrderToDelete(purchaseOrder);
    setIsDeleteOpen(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setPurchaseOrderToDelete(null);
    setIsDeleteOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!purchaseOrderToDelete) return false;
    
    try {
      const success = await purchaseService.deletePurchaseOrder(purchaseOrderToDelete.id);
      if (success) {
        await fetchData(true); // Silent refresh
        closeDeleteDialog();
        toast.success(UI_TEXT.TOAST_DELETE);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast.error('Failed to delete purchase order');
      return false;
    }
  }, [purchaseOrderToDelete, closeDeleteDialog, fetchData]);

  const getStatusBadge = useCallback((status) => {
    switch (status) {
      case 'received':
        return { label: UI_TEXT.STATUS_RECEIVED, className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'partial':
        return { label: UI_TEXT.STATUS_PARTIAL, className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      case 'pending':
      default:
        return { label: UI_TEXT.STATUS_PENDING, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
  }, []);

  return {
    // Data
    purchaseOrders,
    totalItems,
    suppliers,
    products,
    isLoading,

    // Pagination
    currentPage,
    pageSize,
    totalPages,
    hasPrevPage,
    hasNextPage,
    paginationInfo,
    handlePageChange,
    handlePageSizeChange,

    // Search
    searchTerm,
    setSearchTerm,

    // Form state
    formData,
    formErrors,
    formMode,
    isFormOpen,
    selectedPurchaseOrder,

    // Delete state
    isDeleteOpen,
    purchaseOrderToDelete,

    // Receive state
    isReceiveOpen,
    purchaseOrderToReceive,

    // Details state
    isDetailsOpen,

    // Actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmit,
    openReceiveDialog,
    closeReceiveDialog,
    openDetailsDialog,
    closeDetailsDialog,
    handleMarkAsReceived,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    getStatusBadge,
  };
};

export default usePurchases;
