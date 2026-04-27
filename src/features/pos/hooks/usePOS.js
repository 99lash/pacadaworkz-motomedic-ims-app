/**
 * usePOS Hook
 * 
 * Custom hook that encapsulates all POS-related state management
 * and business logic. Separates concerns from UI components.
 * Manages state via Redux.
 */

import { useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { posService } from '../services';
import { calculateSubtotal, calculateTotal, calculateChange, filterProducts } from '../utils';
import { UI_TEXT, PAYMENT_METHODS } from '../utils';
import * as cartService from '../services/cartService.js';
import {
  fetchPosDataStart,
  fetchPosDataSuccess,
  fetchPosDataFailure,
  setCartLoading,
  updateCart,
  updateProducts,
  setSearchTerm,
  setSelectedCategoryIds,
  setDiscount,
  setDiscountType,
  setPaymentMethod,
  setAmountPaid,
  setShowCheckout,
} from '../posSlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Activity logger - optional utility
const logActivity = () => {
  // Activity logging can be implemented here when the utility is available
};

export const usePOS = (user) => {
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);
  const isLoadingCartRef = useRef(false);
  
  // Select state from Redux
  const {
    products,
    categories,
    brands,
    cart,
    isLoading,
    isCartLoading,
    lastFetched,
    searchTerm,
    selectedCategoryIds,
    discount,
    discountType,
    paymentMethod,
    amountPaid,
    showCheckout,
  } = useSelector((state) => state.pos);

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadCart = useCallback(async () => {
    if (isLoadingCartRef.current) {
      return;
    }

    isLoadingCartRef.current = true;
    dispatch(setCartLoading(true));
    try {
      const cartResponse = await cartService.getCart();
      const cartData = cartResponse?.data?.cart || cartResponse?.data;
      const newCart = cartData?.cart_items || [];
      
      dispatch(updateCart(newCart));
      
      // Sync discount states from backend if available
      if (cartData?.discount !== undefined) {
        dispatch(setDiscount(parseFloat(cartData.discount)));
      }
      if (cartData?.discount_type) {
        dispatch(setDiscountType(cartData.discount_type));
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
      toast.error('Failed to load cart');
    } finally {
      dispatch(setCartLoading(false));
      isLoadingCartRef.current = false;
    }
  }, [dispatch]);

  const loadInitialData = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    if (!isSilent) dispatch(fetchPosDataStart());
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        posService.fetchProducts(),
        posService.fetchCategories(),
        posService.fetchBrands(),
      ]);
      
      dispatch(fetchPosDataSuccess({
        products: productsData,
        categories: categoriesData,
        brands: brandsData,
      }));
    } catch (error) {
      console.error('Error loading initial POS data:', error);
      toast.error('Failed to load products');
      dispatch(fetchPosDataFailure('Failed to load products'));
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch]);

  useEffect(() => {
    const now = Date.now();
    if (!lastFetched || (now - lastFetched >= CACHE_DURATION)) {
      loadInitialData();
    }
    loadCart();
  }, [loadInitialData, loadCart, lastFetched]);

  // ---------------------------------------------------------------------------
  // CART OPERATIONS
  // ---------------------------------------------------------------------------

  const addToCart = useCallback(
    async (product) => {
      try {
        const existingItem = cart.find((item) => item.product.id == product.id);
        const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;
        const response = await cartService.addToCart(product.id, quantityToAdd);
        
        if (response.success && response.data) {
          const newItem = response.data;
          const updatedStock = newItem.product?.current_stock;

          // 1. Update Cart State
          const itemIndex = cart.findIndex(item => item.product.id == product.id);
          let updatedCart;
          if (itemIndex > -1) {
            updatedCart = [...cart];
            updatedCart[itemIndex] = { 
              ...updatedCart[itemIndex], 
              ...newItem,
              product: { ...updatedCart[itemIndex].product, ...newItem.product }
            };
          } else {
            updatedCart = [...cart, newItem];
          }
          dispatch(updateCart(updatedCart));

          // 2. Update Products State (Reflect stock in grid)
          if (updatedStock !== undefined) {
            const updatedProductsList = products.map(p => 
              p.id == product.id ? { ...p, currentStock: updatedStock } : p
            );
            dispatch(updateProducts(updatedProductsList));
          }
        }
        
        toast.success(UI_TEXT.ADDED_TO_CART);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
    [cart, products, dispatch]
  );

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      // 1. Find the item BEFORE removing it
      const itemToRemove = cart.find(item => item.id == cartItemId);
      const response = await cartService.removeFromCart(cartItemId);
      
      if (response.success) {
        // 2. Update Cart State
        const updatedCart = cart.filter(item => item.id != cartItemId);
        dispatch(updateCart(updatedCart));
        
        // 3. Manual Stock Update
        if (itemToRemove) {
          const updatedProductsList = products.map(p => 
            p.id == itemToRemove.product.id 
              ? { ...p, currentStock: p.currentStock + itemToRemove.quantity } 
              : p
          );
          dispatch(updateProducts(updatedProductsList));
        }
      }
      toast.success('Item removed from cart.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }, [cart, products, dispatch]);


  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const cartItem = cart.find((item) => item.product.id == productId);
      if (!cartItem) {
        toast.error('Item not found in cart.');
        return;
      }
      const cartItemId = cartItem.id;

      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      try {
        const response = await cartService.updateCartItem(cartItemId, quantity);
        if (response.success && response.data) {
          const updatedItem = response.data;
          const updatedStock = updatedItem.product?.current_stock;

          // 1. Update Cart State
          const updatedCart = cart.map(item => 
            item.id == cartItemId 
              ? { ...item, ...updatedItem, product: { ...item.product, ...updatedItem.product } }
              : item
          );
          dispatch(updateCart(updatedCart));

          // 2. Update Products State
          if (updatedStock !== undefined) {
            const updatedProductsList = products.map(p => 
              p.id == productId ? { ...p, currentStock: updatedStock } : p
            );
            dispatch(updateProducts(updatedProductsList));
          }
        }
        toast.success('Cart item quantity updated.');
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast.error(error.response?.data?.message || 'Failed to update item quantity');
      }
    },
    [cart, products, removeFromCart, dispatch]
  );

  const clearCart = useCallback(async () => {
    try {
      const currentCart = [...cart];
      await cartService.clearCart();
      
      // Update Products
      const updatedProductsList = [...products];
      currentCart.forEach(cartItem => {
        const productIndex = updatedProductsList.findIndex(p => p.id == cartItem.product.id);
        if (productIndex > -1) {
          updatedProductsList[productIndex] = {
            ...updatedProductsList[productIndex],
            currentStock: updatedProductsList[productIndex].currentStock + cartItem.quantity
          };
        }
      });
      dispatch(updateProducts(updatedProductsList));

      dispatch(updateCart([])); 
      toast.success('Cart cleared.');
      dispatch(setDiscount(0));
      dispatch(setAmountPaid(0));
      dispatch(setShowCheckout(false));
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  }, [cart, products, dispatch]);


  // ---------------------------------------------------------------------------
  // CALCULATIONS
  // ---------------------------------------------------------------------------

  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);

  const total = useMemo(() => calculateTotal(subtotal, discount, discountType), [subtotal, discount, discountType]);

  const change = useMemo(() => {
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      return calculateChange(amountPaid, total);
    }
    return 0;
  }, [paymentMethod, amountPaid, total]);

  // ---------------------------------------------------------------------------
  // FILTERED PRODUCTS
  // ---------------------------------------------------------------------------

  const filteredProducts = useMemo(() => {
    let result = filterProducts(products, searchTerm);

    if (selectedCategoryIds.length > 0) {
      result = result.filter((product) =>
        selectedCategoryIds.includes(product.categoryId?.toString())
      );
    }

    return result;
  }, [products, searchTerm, selectedCategoryIds]);

  // ---------------------------------------------------------------------------
  // CATEGORY COUNTS
  // ---------------------------------------------------------------------------

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(product => {
      const categoryId = product.categoryId?.toString();
      if (categoryId) {
        counts[categoryId] = (counts[categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  const totalProductsCount = useMemo(() => products.length, [products]);

  // ---------------------------------------------------------------------------
  // PAYMENT PROCESSING
  // ---------------------------------------------------------------------------

  const processSale = useCallback(async () => {
    if (paymentMethod === PAYMENT_METHODS.CASH && amountPaid < total) {
      toast.error(UI_TEXT.INSUFFICIENT_PAYMENT);
      return;
    }

    try {
        await cartService.checkout(paymentMethod, amountPaid);

        if (logActivity && user) {
            logActivity({
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                action: 'sale',
                module: 'pos',
                details: `Processed sale of ₱${total.toLocaleString()} (${cart.length} items)`,
            });
        }

        toast.success(UI_TEXT.SALE_COMPLETED);
        
        dispatch(setDiscount(0));
        dispatch(setDiscountType('fixed'));
        dispatch(setAmountPaid(0));
        dispatch(setShowCheckout(false));
        
        // Silent refresh
        await loadCart();
        posService.invalidateCache();
        await loadInitialData(true);
    } catch (error) {
        console.error('Error processing sale:', error);
        toast.error(error.response?.data?.message || 'Failed to process sale');
    }
  }, [cart, total, paymentMethod, amountPaid, user, loadCart, loadInitialData, dispatch]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback((value) => {
    dispatch(setSearchTerm(value));
  }, [dispatch]);

  const toggleCategory = useCallback((categoryId) => {
    const id = categoryId.toString();
    // Single selection logic: if already selected, clear it. Otherwise, select only the new one.
    const newSelected = selectedCategoryIds.includes(id) ? [] : [id];
    dispatch(setSelectedCategoryIds(newSelected));
  }, [dispatch, selectedCategoryIds]);

  const clearCategories = useCallback(() => {
    dispatch(setSelectedCategoryIds([]));
  }, [dispatch]);

  const handleDiscountChange = useCallback((value) => {
    if (value === '') {
      dispatch(setDiscount(''));
      return;
    }
    const numValue = parseFloat(value);
    dispatch(setDiscount(isNaN(numValue) ? 0 : numValue));
  }, [dispatch]);

  const handleDiscountTypeChange = useCallback((type) => {
    dispatch(setDiscountType(type));
  }, [dispatch]);

  const applyDiscountAction = useCallback(async () => {
    const finalDiscount = parseFloat(discount) || 0;
    
    if (discountType === 'fixed' && finalDiscount > subtotal) {
      toast.error('Discount cannot be greater than subtotal');
      return;
    }
    if (discountType === 'percentage' && finalDiscount > 100) {
      toast.error('Discount percentage cannot exceed 100%');
      return;
    }

    try {
      await cartService.applyDiscount(finalDiscount, discountType);
      dispatch(setDiscount(finalDiscount));
      toast.success('Discount applied to cart');
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error(error.response?.data?.message || 'Failed to apply discount');
    }
  }, [discount, discountType, subtotal, dispatch]);

  const handlePaymentMethodChange = useCallback((method) => {
    dispatch(setPaymentMethod(method));
  }, [dispatch]);

  const handleAmountPaidChange = useCallback((value) => {
    if (value === '') {
      dispatch(setAmountPaid(''));
      return;
    }
    const numValue = parseFloat(value);
    dispatch(setAmountPaid(isNaN(numValue) ? 0 : numValue));
  }, [dispatch]);

  const openCheckout = useCallback(() => {
    dispatch(setShowCheckout(true));
  }, [dispatch]);

  const closeCheckout = useCallback(() => {
    dispatch(setShowCheckout(false));
  }, [dispatch]);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  return {
    products: filteredProducts,
    categories,
    brands,
    categoryCounts,
    totalProductsCount,
    cart,
    isLoading,
    isCartLoading,
    searchTerm,
    selectedCategoryIds,
    discount,
    discountType,
    paymentMethod,
    amountPaid,
    showCheckout,
    subtotal,
    total,
    change,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    processSale,
    applyDiscountAction,
    handleSearchChange,
    toggleCategory,
    clearCategories,
    handleDiscountChange,
    handleDiscountTypeChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    openCheckout,
    closeCheckout,
  };
};

export default usePOS;
