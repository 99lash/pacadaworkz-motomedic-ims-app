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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' or 'percentage'
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
      const cartData = cartResponse?.data?.cart || cartResponse?.data;
      const newCart = cartData?.cart_items || [];
      
      setCart(newCart);
      
      // Sync discount states from backend if available
      if (cartData?.discount !== undefined) {
        setDiscount(parseFloat(cartData.discount));
      }
      if (cartData?.discount_type) {
        setDiscountType(cartData.discount_type);
      }
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
        const existingItem = cart.find((item) => item.product.id == product.id);
        const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;
        const response = await cartService.addToCart(product.id, quantityToAdd);
        
        if (response.success && response.data) {
          const newItem = response.data;
          const updatedStock = newItem.product?.current_stock;

          // 1. Update Cart State
          setCart(prevCart => {
            const itemIndex = prevCart.findIndex(item => item.product.id == product.id);
            if (itemIndex > -1) {
              const updatedCart = [...prevCart];
              updatedCart[itemIndex] = { 
                ...updatedCart[itemIndex], 
                ...newItem,
                product: { ...updatedCart[itemIndex].product, ...newItem.product }
              };
              return updatedCart;
            }
            return [...prevCart, newItem];
          });

          // 2. Update Products State (Reflect stock in grid)
          if (updatedStock !== undefined) {
            setProducts(prevProducts => 
              prevProducts.map(p => p.id == product.id ? { ...p, currentStock: updatedStock } : p)
            );
          }
        }
        
        toast.success(UI_TEXT.ADDED_TO_CART);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.response?.data?.message || 'Failed to add item to cart');
      }
    },
    [cart]
  );

  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      // 1. Find the item BEFORE removing it to know the quantity and product ID
      const itemToRemove = cart.find(item => item.id == cartItemId);
      const response = await cartService.removeFromCart(cartItemId);
      
      if (response.success) {
        // 2. Update Cart State
        setCart(prevCart => prevCart.filter(item => item.id != cartItemId));
        
        // 3. Manual Stock Update (Return quantity back to grid)
        // This is safe because it only touches the specific product being removed
        if (itemToRemove) {
          setProducts(prevProducts => 
            prevProducts.map(p => 
              p.id == itemToRemove.product.id 
                ? { ...p, currentStock: p.currentStock + itemToRemove.quantity } 
                : p
            )
          );
        }
      }
      toast.success('Item removed from cart.');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }, [cart]);


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
          setCart(prevCart => 
            prevCart.map(item => 
              item.id == cartItemId 
                ? { ...item, ...updatedItem, product: { ...item.product, ...updatedItem.product } }
                : item
            )
          );

          // 2. Update Products State (Reflect stock in grid)
          if (updatedStock !== undefined) {
            setProducts(prevProducts => 
              prevProducts.map(p => p.id == productId ? { ...p, currentStock: updatedStock } : p)
            );
          }
        }
        toast.success('Cart item quantity updated.');
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
        toast.error(error.response?.data?.message || 'Failed to update item quantity');
      }
    },
    [cart, removeFromCart]
  );

  const clearCart = useCallback(async () => {
    try {
      const currentCart = [...cart];
      await cartService.clearCart();
      
      // Update Products (Return ALL items in the current cart back to grid)
      setProducts(prevProducts => {
        const newProducts = [...prevProducts];
        currentCart.forEach(cartItem => {
          const productIndex = newProducts.findIndex(p => p.id == cartItem.product.id);
          if (productIndex > -1) {
            newProducts[productIndex] = {
              ...newProducts[productIndex],
              currentStock: newProducts[productIndex].currentStock + cartItem.quantity
            };
          }
        });
        return newProducts;
      });

      setCart([]); 
      toast.success('Cart cleared.');
      setDiscount(0);
      setAmountPaid(0);
      setShowCheckout(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    }
  }, [cart]);


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
        
        setDiscount(0);
        setDiscountType('fixed');
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

  const toggleCategory = useCallback((categoryId) => {
    const id = categoryId.toString();
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? [] : [id]
    );
  }, []);

  const clearCategories = useCallback(() => {
    setSelectedCategoryIds([]);
  }, []);

  const handleDiscountChange = useCallback((value) => {
    // Allow empty string to let user clear the input
    if (value === '') {
      setDiscount('');
      return;
    }
    const numValue = parseFloat(value);
    setDiscount(isNaN(numValue) ? 0 : numValue);
  }, []);

  const handleDiscountTypeChange = useCallback((type) => {
    setDiscountType(type);
  }, []);

  const applyDiscountAction = useCallback(async () => {
    const finalDiscount = parseFloat(discount) || 0;
    
    // Client-side validation: Bawal greater than subtotal ang discount
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
      setDiscount(finalDiscount); // Ensure it's a number after applying
      toast.success('Discount applied to cart');
    } catch (error) {
      console.error('Error applying discount:', error);
      toast.error(error.response?.data?.message || 'Failed to apply discount');
    }
  }, [discount, discountType, subtotal]);

  const handlePaymentMethodChange = useCallback((method) => {
    setPaymentMethod(method);
    // Removed the reset of amountPaid to maintain UI persistence for auditing
  }, []);

  const handleAmountPaidChange = useCallback((value) => {
    if (value === '') {
      setAmountPaid('');
      return;
    }
    const numValue = parseFloat(value);
    setAmountPaid(isNaN(numValue) ? 0 : numValue);
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
    categoryCounts,
    totalProductsCount,
    cart,
    isLoading,
    isCartLoading, // Expose cart loading state

    // UI state
    searchTerm,
    selectedCategoryIds,
    discount,
    discountType,
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
    applyDiscountAction,

    // Handlers
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

  return returnedValue;
};

export default usePOS;