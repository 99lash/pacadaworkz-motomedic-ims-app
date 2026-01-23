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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsCartLoading(true);
    try {
      const [productsData, categoriesData, brandsData, cartResponse] = await Promise.all([
        posService.fetchProducts(),
        posService.fetchCategories(),
        posService.fetchBrands(),
        cartService.getCart(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
      // Correctly access cart items: cartResponse.data.cart.cart_items
      const newCart = cartResponse?.data?.cart?.cart_items || [];
      setCart(newCart); 
    } catch (error) {
      console.error('Error loading POS data:', error);
      toast.error('Failed to load products or cart');
    } finally {
      setIsLoading(false);
      setIsCartLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // CART OPERATIONS
  // ---------------------------------------------------------------------------

  const addToCart = useCallback(
    async (product) => {
      try {
        const existingItem = cart.find((item) => item.product.id === product.id); // Check against product.id, which comes from the products list
        const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;

        // The API's addToCart method expects the *total* quantity if the item is already in the cart.
        // If the API only supports adding '1' at a time, this logic needs adjustment.
        // Assuming `addToCart` in cartService handles the total quantity for a given product_id.
        await cartService.addToCart(product.id, quantityToAdd);
        toast.success(UI_TEXT.ADDED_TO_CART);
        await loadData(); // Refetch all data including the updated cart
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
    [cart, loadData]
  );

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      toast.success('Item removed from cart.');
      await loadData(); // Refetch all data including the updated cart
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }, [loadData]);


  const updateQuantity = useCallback(
    async (productId, quantity) => {
      // Find the cart item to get its cartItemId
      // Assuming cart.items has an 'id' property for cart item ID and a 'product' object with 'id'
      const cartItem = cart.find((item) => item.product.id === productId);
      if (!cartItem) {
        toast.error('Item not found in cart.');
        return;
      }
      const cartItemId = cartItem.id; // Get the actual cart item ID

      if (quantity <= 0) {
        // If quantity is 0 or less, remove the item using the updated removeFromCart
        await removeFromCart(cartItemId);
        return;
      }

      try {
        await cartService.updateCartItem(cartItemId, quantity);
        toast.success('Cart item quantity updated.');
        await loadData(); // Refetch all data including the updated cart
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast.error(error.response?.data?.message || 'Failed to update item quantity');
      }
    },
    [cart, loadData, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      await cartService.clearCart();
      toast.success('Cart cleared.');
      await loadData(); // Refetch to ensure local state is empty and matches backend
      setDiscount(0);
      setAmountPaid(0);
      setShowCheckout(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  }, [loadData]);


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
        // Call the new checkout API
        await cartService.checkout(paymentMethod, amountPaid);

        // Log activity (consider moving this to backend if not already there)
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
        
        // Reset local state after successful checkout
        setDiscount(0);
        setAmountPaid(0);
        setShowCheckout(false);
        await loadData(); // Refetch all data including an empty cart
    } catch (error) {
        console.error('Error processing sale:', error);
        toast.error(error.response?.data?.message || 'Failed to process sale');
    }
  }, [cart, total, paymentMethod, amountPaid, user, loadData, setDiscount, setAmountPaid, setShowCheckout]);

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