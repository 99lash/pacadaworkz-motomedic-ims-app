import React from 'react';
import PropTypes from 'prop-types';
import { ShoppingCart } from 'lucide-react';
import { UI_TEXT, formatCurrency } from '../utils';

const POSProductGrid = ({ products, onAddToCart }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[600px] overflow-y-auto scrollbar-thin">
      {products.length === 0 ? (
        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
          <p>{UI_TEXT.NO_PRODUCTS_FOUND}</p>
        </div>
      ) : (
        products.map((product) => (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all text-left bg-white dark:bg-gray-700"
          >
            <div className="text-gray-900 dark:text-gray-100 mb-1 line-clamp-2 font-medium">
              {product.name}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">{product.sku}</div>
            <div className="flex items-center justify-between">
              <div className="text-blue-600 dark:text-blue-400 font-semibold">
                {formatCurrency(product.sellingPrice)}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                {UI_TEXT.STOCK} {product.currentStock}
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
);

POSProductGrid.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default POSProductGrid;

