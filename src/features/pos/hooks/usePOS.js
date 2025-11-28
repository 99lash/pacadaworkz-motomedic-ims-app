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

// Activity logger - optional utility
// TODO: Implement activityLogger utility when available
// For now, this is a no-op function
const logActivity = (activity) => {
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

  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      setProducts(posService.fetchProducts());
      setCategories(posService.fetchCategories());
      setBrands(posService.fetchBrands());
    } catch (error) {
      console.error('Error loading POS data:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // CART OPERATIONS
  // ---------------------------------------------------------------------------

  const addToCart = useCallback(
    (product) => {
      if (product.currentStock <= 0) {
        toast.error(UI_TEXT.OUT_OF_STOCK);
        return;
      }

      const existingItem = cart.find((item) => item.product.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.currentStock) {
          toast.error(UI_TEXT.EXCEED_STOCK);
          return;
        }
        updateQuantity(product.id, existingItem.quantity + 1);
      } else {
        setCart([...cart, { product, quantity: 1 }]);
        toast.success(UI_TEXT.ADDED_TO_CART);
      }
    },
    [cart]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      if (quantity > product.currentStock) {
        toast.error(UI_TEXT.EXCEED_STOCK);
        return;
      }

      setCart(
        cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    },
    [products, cart]
  );

  const removeFromCart = useCallback((productId) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscount(0);
    setAmountPaid(0);
    setShowCheckout(false);
  }, []);

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

  const processSale = useCallback(() => {
    if (paymentMethod === PAYMENT_METHODS.CASH && amountPaid < total) {
      toast.error(UI_TEXT.INSUFFICIENT_PAYMENT);
      return;
    }

    // Create transaction
    const transactionItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: item.product.sellingPrice,
      total: item.product.sellingPrice * item.quantity,
    }));

    const transaction = {
      id: crypto.randomUUID(),
      type: 'sale',
      date: new Date().toISOString(),
      userId: user?.id || '',
      userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      items: transactionItems,
      subtotal,
      discount,
      total,
      paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    // Update stock
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.product.id === product.id);
      if (cartItem) {
        return {
          ...product,
          currentStock: product.currentStock - cartItem.quantity,
        };
      }
      return product;
    });

    // Save transaction
    const transactionSaved = posService.saveTransaction(transaction);
    if (!transactionSaved) {
      toast.error('Failed to save transaction');
      return;
    }

    // Save updated products
    const productsUpdated = posService.updateProductsStock(updatedProducts);
    if (!productsUpdated) {
      toast.error('Failed to update product stock');
      return;
    }

    setProducts(updatedProducts);

    // Log activity
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
    clearCart();
  }, [cart, subtotal, discount, total, paymentMethod, amountPaid, products, user, clearCart]);

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

  return {
    // Data
    products: filteredProducts,
    categories,
    brands,
    cart,
    isLoading,

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
};

export default usePOS;

