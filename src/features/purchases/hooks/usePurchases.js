import { useReducer, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { purchaseService } from '../services';
import { supplierService } from '../../suppliers/services';
import { productService } from '../../products/services';
import {
  INITIAL_FORM_STATE,
  INITIAL_FORM_ERRORS,
  UI_TEXT,
  validatePurchaseOrderForm,
} from '../utils';

const initialState = {
  purchaseOrders: [],
  suppliers: [],
  products: [],
  isLoading: true,
  error: null,
  isFormOpen: false,
  isDeleteOpen: false,
  formMode: 'create',
  selectedPurchaseOrder: null,
  purchaseOrderToDelete: null,
  formData: INITIAL_FORM_STATE,
  formErrors: INITIAL_FORM_ERRORS,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        purchaseOrders: action.payload.purchaseOrders,
        suppliers: action.payload.suppliers,
        products: action.payload.products,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    
    case 'SET_PURCHASE_ORDERS':
      return { ...state, purchaseOrders: action.payload };

    case 'OPEN_CREATE_DIALOG':
      return { ...state, isFormOpen: true, formMode: 'create', formData: INITIAL_FORM_STATE, formErrors: INITIAL_FORM_ERRORS };
    case 'CLOSE_FORM_DIALOG':
      return { ...state, isFormOpen: false, selectedPurchaseOrder: null };
    
    case 'SET_FORM_FIELD':
      return { ...state, formData: { ...state.formData, [action.payload.field]: action.payload.value }, formErrors: { ...state.formErrors, [action.payload.field]: '' } };
    case 'SET_FORM_ERRORS':
      return { ...state, formErrors: action.payload };
    case 'ADD_ITEM':
      return { ...state, formData: { ...state.formData, items: [...state.formData.items, { productId: '', quantityOrdered: 1, costPrice: 0 }] } };
    case 'REMOVE_ITEM':
      return { ...state, formData: { ...state.formData, items: state.formData.items.filter((_, i) => i !== action.payload) } };
    case 'SET_ITEM_FIELD': {
      const updatedItems = [...state.formData.items];
      updatedItems[action.payload.index] = { ...updatedItems[action.payload.index], [action.payload.field]: action.payload.value };
      return { ...state, formData: { ...state.formData, items: updatedItems } };
    }

    default:
      return state;
  }
}


export const usePurchases = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    purchaseOrders, suppliers, products, isLoading,
    isFormOpen, formData, formErrors
  } = state;

  const loadInitialData = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [poResult, supplierResult, productResult] = await Promise.all([
        purchaseService.fetchPurchaseOrders(),
        supplierService.fetchSuppliers(),
        productService.fetchProducts(),
      ]);

      if (poResult.success && supplierResult.success && productResult.success) {
        dispatch({ type: 'FETCH_SUCCESS', payload: {
          purchaseOrders: poResult.data,
          suppliers: supplierResult.data,
          products: productResult.data,
        }});
      } else {
        throw new Error('Failed to load initial data');
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
      toast.error('Could not load data. Please refresh the page.');
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const openCreateDialog = useCallback(() => dispatch({ type: 'OPEN_CREATE_DIALOG' }), []);
  const closeFormDialog = useCallback(() => dispatch({ type: 'CLOSE_FORM_DIALOG' }), []);

  const handleFormFieldChange = useCallback((field, value) => {
    dispatch({ type: 'SET_FORM_FIELD', payload: { field, value } });
  }, []);

  const handleAddItem = useCallback(() => dispatch({ type: 'ADD_ITEM' }), []);
  const handleRemoveItem = useCallback((index) => dispatch({ type: 'REMOVE_ITEM', payload: index }), []);

  const handleItemChange = useCallback((index, field, value) => {
    dispatch({ type: 'SET_ITEM_FIELD', payload: { index, field, value } });
  }, []);

  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validatePurchaseOrderForm(formData);
    if (!isValid) {
      dispatch({ type: 'SET_FORM_ERRORS', payload: errors });
      toast.error(UI_TEXT.TOAST_FORM_ERROR);
      return;
    }

    const result = await purchaseService.createPurchaseOrder(formData);

    if (result.success) {
      const newPurchaseOrders = [result.data, ...purchaseOrders];
      dispatch({ type: 'SET_PURCHASE_ORDERS', payload: newPurchaseOrders });
      closeFormDialog();
      toast.success(UI_TEXT.TOAST_CREATE);
    } else {
      toast.error(result.error || 'Failed to create purchase order.');
    }
  }, [formData, purchaseOrders, closeFormDialog]);

  const handleMarkAsReceived = useCallback(async (purchaseOrder) => {
    if (!window.confirm('Mark this purchase order as received? This will update stock levels.')) {
      return;
    }

    const result = await purchaseService.markPurchaseOrderAsReceived(purchaseOrder.id);

    if (result.success) {
      const updatedOrders = purchaseOrders.map(po => po.id === purchaseOrder.id ? result.data : po);
      dispatch({ type: 'SET_PURCHASE_ORDERS', payload: updatedOrders });
      toast.success(UI_TEXT.TOAST_RECEIVED);
    } else {
      toast.error(result.error || 'Failed to mark as received.');
    }
  }, [purchaseOrders]);

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
    suppliers,
    products,
    isLoading,

    // Form state
    formData,
    formErrors,
    isFormOpen,

    // Actions
    openCreateDialog,
    closeFormDialog,
    handleFormFieldChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmit,
    handleMarkAsReceived,
    getStatusBadge,
  };
};

export default usePurchases;


