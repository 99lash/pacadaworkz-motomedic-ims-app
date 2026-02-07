import { useAuth } from '../auth';
import { usePOS } from './hooks';
import { useMobileMenu } from '../../shared/hooks/useMobileMenu';
import {
  POSHeader,
  POSProductSearch,
  POSProductGrid,
  POSCart,
  POSCheckoutModal,
  POSCategoryPanel,
} from './components';

const POSPage = () => {
  const { user } = useAuth();
  const { isLaptop, isMobile } = useMobileMenu();
  const {
    // Data
    products,
    categories,
    categoryCounts,
    totalProductsCount,
    cart,
    isLoading,

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
  } = usePOS(user);

  // Determine if we should show the compact 2-column layout
  // Effective for laptop and tablet, but not for mobile
  const showTwoColumn = isLaptop && !isMobile;
  // Compact mode for all smaller screens (laptop, tablet, mobile) to ensure smaller font sizes
  const isCompactMode = isLaptop;

  // console.log('products', products);
  
  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <POSHeader />

      <div className={`grid gap-4 sm:gap-6 ${showTwoColumn ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-4'}`}>
        {/* Products Section */}
        <div className={`${showTwoColumn ? 'space-y-4' : 'lg:col-span-3 space-y-4'}`}>
          <POSProductSearch 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
            isCompact={isCompactMode}
          />

          <POSCategoryPanel
            categories={categories}
            categoryCounts={categoryCounts}
            totalProductsCount={totalProductsCount}
            selectedCategoryIds={selectedCategoryIds}
            onToggleCategory={toggleCategory}
            onClearCategories={clearCategories}
            isCompact={isCompactMode}
          />

          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 dark:text-gray-400">Loading products...</div>
              </div>
            </div>
          ) : (
            <POSProductGrid 
              products={products} 
              onAddToCart={addToCart} 
              isCompact={isCompactMode}
            />
          )}
        </div>
          
        {/* Cart Section */}
        <div className={`${showTwoColumn ? '' : 'lg:col-span-1'} space-y-4`}>
          <POSCart
            cart={cart}
            discount={discount}
            discountType={discountType}
            subtotal={subtotal}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onDiscountChange={handleDiscountChange}
            onDiscountTypeChange={handleDiscountTypeChange}
            onApplyDiscount={applyDiscountAction}
            onProceedToPayment={openCheckout}
            isCompact={isCompactMode}
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
