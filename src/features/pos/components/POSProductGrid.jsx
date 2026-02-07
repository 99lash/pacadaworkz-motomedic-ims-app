import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';
import { UI_TEXT, formatCurrency } from '../utils';

const POSProductGrid = ({ products, onAddToCart }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[650px] overflow-y-auto scrollbar-thin">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p>{UI_TEXT.NO_PRODUCTS_FOUND}</p>
        </div>
      ) : (
        products.map((product) => {
          const isOutOfStock = product.currentStock <= 0;
          return (
            <button
              key={product.id}
              onClick={() => !isOutOfStock && onAddToCart(product)}
              disabled={isOutOfStock}
              className={`p-4 border rounded-lg transition-all text-left bg-white dark:bg-gray-700 ${
                isOutOfStock 
                  ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-800' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md'
              }`}
            >
              <div className={`mb-1 line-clamp-2 font-medium ${isOutOfStock ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {product.name}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{product.sku}</div>
              <div className="flex items-center justify-between">
                <div className={`${isOutOfStock ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'} font-semibold`}>
                  {formatCurrency(product.sellingPrice)}
                </div>
                <div className={`text-sm ${isOutOfStock ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  {isOutOfStock ? 'Out of Stock' : `${UI_TEXT.STOCK} ${product.currentStock}`}
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
};

export default POSProductGrid;

