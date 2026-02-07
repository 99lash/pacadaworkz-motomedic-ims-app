import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';
import { UI_TEXT, formatCurrency } from '../utils';

const POSProductGrid = ({ products, onAddToCart, isCompact = false }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${isCompact ? 'p-2' : 'p-4'}`}>
    <div className={`grid gap-2 sm:gap-3 max-h-[650px] overflow-y-auto scrollbar-thin ${
      isCompact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
    }`}>
      {products.length === 0 ? (
        <div className={`col-span-full text-center text-gray-500 dark:text-gray-400 ${isCompact ? 'py-6' : 'py-12'}`}>
          <ShoppingCart className={`${isCompact ? 'w-8 h-8' : 'w-12 h-12'} mx-auto mb-3 text-gray-400 dark:text-gray-500`} />
          <p className={isCompact ? 'text-xs' : ''}>{UI_TEXT.NO_PRODUCTS_FOUND}</p>
        </div>
      ) : (
        products.map((product) => {
          const isOutOfStock = product.currentStock <= 0;
          return (
            <button
              key={product.id}
              onClick={() => !isOutOfStock && onAddToCart(product)}
              disabled={isOutOfStock}
              className={`border rounded-lg transition-all text-left bg-white dark:bg-gray-700 ${
                isCompact ? 'p-2' : 'p-4'
              } ${
                isOutOfStock 
                  ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className={`mb-1 line-clamp-2 font-medium ${isCompact ? 'text-[10px] leading-tight' : 'text-sm'} ${isOutOfStock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {product.name}
              </div>
              {!isCompact && (
                <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">{product.sku}</div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className={`${isCompact ? 'text-xs' : 'text-sm'} ${isOutOfStock ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'} font-semibold`}>
                  {formatCurrency(product.sellingPrice)}
                </div>
                <div className={`${isCompact ? 'text-[9px]' : 'text-xs'} ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {isOutOfStock ? 'No Stock' : `${isCompact ? 'S:' : UI_TEXT.STOCK} ${product.currentStock}`}
                </div>
              </div>
            </button>
          );
        })
      )}
    </div>
  </div>
);

POSProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isCompact: PropTypes.bool,
};

export default POSProductGrid;

