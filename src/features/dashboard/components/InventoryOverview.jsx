import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { UI_TEXT, formatCurrency } from '../utils';

const InventoryOverview = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {UI_TEXT.CHART_INVENTORY_OVERVIEW}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {UI_TEXT.INVENTORY_TOTAL_VALUE}
            </p>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mt-1">
              {formatCurrency(stats.inventoryValue)}
            </h3>
          </div>
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-4" />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {UI_TEXT.INVENTORY_IN_STOCK}
            </p>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mt-1">
              {stats.totalProducts - stats.outOfStockCount}
            </h3>
          </div>
          <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0 ml-4" />
        </div>
        
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {UI_TEXT.INVENTORY_NEED_REORDER}
            </p>
            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mt-1">
              {stats.lowStockCount}
            </h3>
          </div>
          <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400 flex-shrink-0 ml-4" />
        </div>
      </div>
    </CardContent>
  </Card>
);

InventoryOverview.propTypes = {
  stats: PropTypes.shape({
    inventoryValue: PropTypes.number.isRequired,
    totalProducts: PropTypes.number.isRequired,
    outOfStockCount: PropTypes.number.isRequired,
    lowStockCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default InventoryOverview;

