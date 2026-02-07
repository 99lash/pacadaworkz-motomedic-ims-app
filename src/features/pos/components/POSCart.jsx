import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { UI_TEXT, formatCurrency } from "../utils";

const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart, isCompact = false }) => {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Sync local state with prop if it changes from outside
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  const handleBlur = () => {
    const val = parseInt(localQuantity);
    if (!isNaN(val) && val !== item.quantity) {
      if (val <= 0) {
        onRemoveFromCart(item.id);
      } else {
        onUpdateQuantity(item.product.id, val);
      }
    } else if (isNaN(val)) {
      setLocalQuantity(item.quantity);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div className={`${isCompact ? 'p-2' : 'p-3'} bg-gray-50 dark:bg-gray-700/50 rounded-lg`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className={`text-gray-900 dark:text-gray-100 mb-1 font-medium ${isCompact ? 'text-[11px] leading-tight' : 'text-sm'}`}>
            {item.product.name}
          </div>
          <div className={`text-gray-600 dark:text-gray-400 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
            {formatCurrency(item.unit_price)}
          </div>
        </div>
        <button
          onClick={() => onRemoveFromCart(item.id)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className={isCompact ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md p-0.5">
          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            className={`${isCompact ? 'w-5 h-5' : 'w-7 h-7'} flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors`}
            aria-label="Decrease quantity"
          >
            <Minus className={isCompact ? 'w-2 h-2' : 'w-3 h-3'} />
          </button>
          
          <input
            type="number"
            min="1"
            value={localQuantity}
            onChange={(e) => setLocalQuantity(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={`${isCompact ? 'w-7 h-5 text-xs' : 'w-10 h-7 text-sm'} text-center text-gray-900 dark:text-gray-100 font-medium bg-gray-50 dark:bg-gray-700/50 border-x border-gray-100 dark:border-gray-500 focus:ring-1 focus:ring-blue-500 outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            title="Click to edit quantity"
          />

          <button
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
            className={`${isCompact ? 'w-5 h-5' : 'w-7 h-7'} flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors`}
            aria-label="Increase quantity"
          >
            <Plus className={isCompact ? 'w-2 h-2' : 'w-3 h-3'} />
          </button>
        </div>
        <div className={`text-gray-900 dark:text-gray-100 font-semibold ${isCompact ? 'text-xs' : ''}`}>
          {formatCurrency(item.unit_price * item.quantity)}
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};

const POSCart = ({
  cart,
  discount,
  discountType,
  subtotal,
  total,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onDiscountChange,
  onDiscountTypeChange,
  onApplyDiscount,
  onProceedToPayment,
  isCompact = false,
}) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${isCompact ? 'p-3' : 'p-4'}`}>
    <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-4'}`}>
      <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${isCompact ? 'text-base' : 'text-lg'}`}>
        {UI_TEXT.CART_TITLE}
      </h3>
      {cart.length > 0 && (
        <button
          onClick={onClearCart}
          className={`text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}
        >
          {UI_TEXT.CART_CLEAR_ALL}
        </button>
      )}
    </div>

    {/* Cart Items */}
    <div className={`space-y-2 max-h-[300px] overflow-y-auto mb-4 scrollbar-thin`}>
      {cart.length === 0 ? (
        <div className={`text-center text-gray-500 dark:text-gray-400 ${isCompact ? 'py-6' : 'py-12'}`}>
          <ShoppingCart className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} mx-auto mb-3 text-gray-400 dark:text-gray-500`} />
          <p className={isCompact ? 'text-xs' : ''}>{UI_TEXT.CART_EMPTY}</p>
        </div>
      ) : (
        cart.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onUpdateQuantity={onUpdateQuantity} 
            onRemoveFromCart={onRemoveFromCart} 
            isCompact={isCompact}
          />
        ))
      )}
    </div>

    {/* Totals */}
    {cart.length > 0 && (
      <>
        <div className={`space-y-2 py-4 border-t border-gray-200 dark:border-gray-700 ${isCompact ? 'text-xs' : ''}`}>
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>{UI_TEXT.SUBTOTAL}</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-gray-600 dark:text-gray-400">
                {UI_TEXT.DISCOUNT}
              </label>
              <div className="flex items-center gap-1">
                <select
                  value={discountType}
                  onChange={(e) => onDiscountTypeChange(e.target.value)}
                  className={`px-1 py-0.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none ${isCompact ? 'text-[10px]' : 'text-sm'}`}
                >
                  <option value="fixed">₱</option>
                  <option value="percentage">%</option>
                </select>
                <input
                  type="number"
                  min="0"
                  value={discount === 0 ? "" : discount}
                  onChange={(e) => onDiscountChange(e.target.value)}
                  placeholder="0"
                  className={`px-2 py-0.5 text-right border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${isCompact ? 'w-16 text-[10px]' : 'w-20 text-sm'}`}
                />
              </div>
            </div>
            <button
              onClick={onApplyDiscount}
              className={`w-full py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 font-medium ${isCompact ? 'text-[10px]' : 'text-xs'}`}
            >
              Apply Discount
            </button>
          </div>

          <div className="flex items-center justify-between text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="font-semibold">{UI_TEXT.TOTAL}</span>
            <span className={`font-bold ${isCompact ? 'text-lg' : 'text-xl'}`}>{formatCurrency(total)}</span>
          </div>
        </div>

        <button
          onClick={onProceedToPayment}
          className={`w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${isCompact ? 'py-2 text-sm' : 'py-3'}`}
        >
          {UI_TEXT.PROCEED_TO_PAYMENT}
        </button>
      </>
    )}
  </div>
);

POSCart.propTypes = {
  cart: PropTypes.array.isRequired,
  discount: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  discountType: PropTypes.string.isRequired,
  subtotal: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemoveFromCart: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
  onDiscountTypeChange: PropTypes.func.isRequired,
  onApplyDiscount: PropTypes.func.isRequired,
  onProceedToPayment: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};

export default POSCart;
