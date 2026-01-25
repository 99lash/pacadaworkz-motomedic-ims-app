/**
 * usePOS Hook
 * 
 * Custom hook that encapsulates all POS-related state management
 * and business logic. Separates concerns from UI components.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { posService } from '../services';
import { calculateSubtotal, calculateTotal, calculateChange, filterProducts } from '../utils';
import { UI_TEXT, PAYMENT_METHODS } from '../utils';
import * as cartService from '../services/cartService.js';


// Activity logger - optional utility
// TODO: Implement activityLogger utility when available
// For now, this is a no-op function
const logActivity = () => {
  // Activity logging can be implemented here when the utility is available
  // Example: activityLogger.logActivity(activity);
};

export const usePOS = (user) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  // Data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [amountPaid, setAmountPaid] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // DATA LOADING
  // ---------------------------------------------------------------------------

  const loadCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const cartResponse = await cartService.getCart();
      const newCart = cartResponse?.data?.cart?.cart_items || [];
      setCart(newCart);
    } catch (error) {
      console.error('Error loading cart data:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsCartLoading(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData, brandsData] = await Promise.all([
        posService.fetchProducts(),
        posService.fetchCategories(),
        posService.fetchBrands(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading initial POS data:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
    loadCart();
  }, [loadInitialData, loadCart]);

  // ---------------------------------------------------------------------------
  // CART OPERATIONS
  // ---------------------------------------------------------------------------

  const addToCart = useCallback(
    async (product) => {
      try {
        const existingItem = cart.find((item) => item.product.id === product.id);
        const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;
        await cartService.addToCart(product.id, quantityToAdd);
        toast.success(UI_TEXT.ADDED_TO_CART);
        await loadCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
    [cart, loadCart]
  );

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      toast.success('Item removed from cart.');
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }, [loadCart]);


  const updateQuantity = useCallback(
    async (productId, quantity) => {
      const cartItem = cart.find((item) => item.product.id === productId);
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
        await cartService.updateCartItem(cartItemId, quantity);
        toast.success('Cart item quantity updated.');
        await loadCart();
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast.error(error.response?.data?.message || 'Failed to update item quantity');
      }
    },
    [cart, loadCart, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      toast.success('Cart cleared.');
      await loadCart();
      setDiscount(0);
      setAmountPaid(0);
      setShowCheckout(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  }, [loadCart]);


  // ---------------------------------------------------------------------------
  // CALCULATIONS
  // ---------------------------------------------------------------------------

  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);

  const total = useMemo(() => calculateTotal(subtotal, discount), [subtotal, discount]);

  const change = useMemo(() => {
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      return calculateChange(amountPaid, total);
    }
    return 0;
  }, [paymentMethod, amountPaid, total]);

  // ---------------------------------------------------------------------------
  // FILTERED PRODUCTS
  // ---------------------------------------------------------------------------

  const filteredProducts = useMemo(
    () => filterProducts(products, searchTerm),
    [products, searchTerm]
  );

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
        
        setDiscount(0);
        setAmountPaid(0);
        setShowCheckout(false);
        await loadCart();
        posService.invalidateCache();
        await loadInitialData();
    } catch (error) {
        console.error('Error processing sale:', error);
        toast.error(error.response?.data?.message || 'Failed to process sale');
    }
  }, [cart, total, paymentMethod, amountPaid, user, loadCart, setDiscount, setAmountPaid, setShowCheckout, loadInitialData]);

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleDiscountChange = useCallback((value) => {
    const numValue = parseFloat(value) || 0;
    const maxDiscount = subtotal;
    setDiscount(Math.min(Math.max(0, numValue), maxDiscount));
  }, [subtotal]);

  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethod(method);
    if (method !== PAYMENT_METHODS.CASH) {
      setAmountPaid(0);
    }
  }, []);

  const handleAmountPaidChange = useCallback((value) => {
    const numValue = parseFloat(value) || 0;
    setAmountPaid(Math.max(0, numValue));
  }, []);

  const openCheckout = useCallback(() => {
    setShowCheckout(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setShowCheckout(false);
  }, []);

  // ---------------------------------------------------------------------------
  // RETURN
  // ---------------------------------------------------------------------------

  const returnedValue = {
    // Data
    products: filteredProducts,
    categories,
    brands,
    cart,
    isLoading,
    isCartLoading, // Expose cart loading state

    // UI state
    searchTerm,
    discount,
    paymentMethod,
    amountPaid,
    showCheckout,

    // Calculations
    subtotal,
    total,
    change,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    processSale,

    // Handlers
    handleSearchChange,
    handleDiscountChange,
    handlePaymentMethodChange,
    handleAmountPaidChange,
    openCheckout,
    closeCheckout,
  };

  return returnedValue;
};

export default usePOS;