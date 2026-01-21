import { apiClient } from '../../../shared/services'; // Using direct import to avoid previous issues

const API_ENDPOINTS = {
  GET_CART: '/v1/pos/cart',
  ADD_TO_CART: '/v1/pos/cart/add-item',
  UPDATE_CART_ITEM: (id) => `/v1/pos/cart/update-item/${id}`,
  REMOVE_FROM_CART: (id) => `/v1/pos/cart/remove-item/${id}`,
  CLEAR_CART: '/v1/pos/cart/clear',
  CHECKOUT: '/v1/pos/checkout', // Added checkout endpoint
};
/**
 * Fetches the user's cart
 * @returns {Promise<Object>}
 */
export const getCart = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GET_CART);
  return response.data;
};

/**
 * Adds an item to the cart
 * @param {string} productId - The ID of the product to add
 * @param {number} quantity - The quantity to add
 * @returns {Promise<Object>}
 */
export const addToCart = async (productId, quantity) => {
  const response = await apiClient.post(API_ENDPOINTS.ADD_TO_CART, {
    product_id: productId,
    quantity,
  });
  return response.data;
};

/**
 * Updates a cart item's quantity
 * @param {string} id - The ID of the cart item
 * @param {number} quantity - The new quantity
 * @returns {Promise<Object>}
 */
export const updateCartItem = async (id, quantity) => {
  const response = await apiClient.patch(API_ENDPOINTS.UPDATE_CART_ITEM(id), {
    quantity,
  });
  return response.data;
};

/**
 * Removes an item from the cart
 * @param {string} id - The ID of the cart item
 * @returns {Promise<Object>}
 */
export const removeFromCart = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.REMOVE_FROM_CART(id));
  return response.data;
};

/**
 * Clears all items from the cart
 * @returns {Promise<Object>}
 */
export const clearCart = async () => {
  const response = await apiClient.post(API_ENDPOINTS.CLEAR_CART);
  return response.data;
};

/**
 * Processes the checkout for the current cart.
 * @param {string} payment_method - The payment method (CASH, CARD, GCASH).
 * @param {number} amount_tendered - The amount paid by the customer.
 * @returns {Promise<Object>} The API response from the checkout.
 */
export const checkout = async (payment_method, amount_tendered) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CHECKOUT, {
      payment_method,
      amount_tendered,
    });
    return response.data;
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error; // Re-throw to be handled by usePOS
  }
};


const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout, // Export the new checkout function
};

export default cartService;