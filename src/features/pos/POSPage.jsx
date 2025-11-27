import React from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../auth';
import { usePOS } from './hooks';
import {
  POSHeader,
  POSProductSearch,
  POSProductGrid,
  POSCart,
  POSCheckoutModal,
} from './components';

const POSPage = () => {
  const { user } = useAuth();
  const {
    // Data
    products,
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
  } = usePOS(user);

  return (
    <div className="p-6 space-y-6">
      <POSHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <POSProductSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />

          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 dark:text-gray-400">Loading products...</div>
              </div>
            </div>
          ) : (
            <POSProductGrid products={products} onAddToCart={addToCart} />
          )}
        </div>

        {/* Cart Section */}
        <div className="space-y-4">
          <POSCart
            cart={cart}
            discount={discount}
            subtotal={subtotal}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onDiscountChange={handleDiscountChange}
            onProceedToPayment={openCheckout}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      <POSCheckoutModal
        show={showCheckout}
        total={total}
        paymentMethod={paymentMethod}
        amountPaid={amountPaid}
        change={change}
        onClose={closeCheckout}
        onPaymentMethodChange={handlePaymentMethodChange}
        onAmountPaidChange={handleAmountPaidChange}
        onCompleteSale={processSale}
      />
    </div>
  );
};

POSPage.propTypes = {};

export default POSPage;

