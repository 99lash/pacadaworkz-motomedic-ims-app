import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { UI_TEXT, formatCurrency } from '../utils';

const POSCart = ({
  cart,
  discount,
  subtotal,
  total,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onDiscountChange,
  onProceedToPayment,
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{UI_TEXT.CART_TITLE}</h3>
      {cart.length > 0 && (
        <button
          onClick={onClearCart}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
        >
          {UI_TEXT.CART_CLEAR_ALL}
        </button>
      )}
    </div>

    {/* Cart Items */}
    <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
      {cart.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p>{UI_TEXT.CART_EMPTY}</p>
        </div>
      ) : (
        cart.map((item) => (
          <div
            key={item.product.id}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-gray-900 dark:text-gray-100 text-sm mb-1 font-medium">
                  {item.product.name}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  {formatCurrency(item.product.sellingPrice)}
                </div>
              </div>
              <button
                onClick={() => onRemoveFromCart(item.product.id)}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                aria-label="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-gray-900 dark:text-gray-100 font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-gray-900 dark:text-gray-100 font-semibold">
                {formatCurrency(item.product.sellingPrice * item.quantity)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Totals */}
    {cart.length > 0 && (
      <>
        <div className="space-y-2 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>{UI_TEXT.SUBTOTAL}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-gray-600 dark:text-gray-400">{UI_TEXT.DISCOUNT}</label>
            <input
              type="number"
              min="0"
              max={subtotal}
              value={discount}
              onChange={(e) => onDiscountChange(e.target.value)}
              className="w-24 px-2 py-1 text-right border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center justify-between text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="font-semibold">{UI_TEXT.TOTAL}</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={onProceedToPayment}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {UI_TEXT.PROCEED_TO_PAYMENT}
        </button>
      </>
    )}
  </div>
);

POSCart.propTypes = {
  cart: PropTypes.array.isRequired,
  discount: PropTypes.number.isRequired,
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
  onProceedToPayment: PropTypes.func.isRequired,
};

export default POSCart;

