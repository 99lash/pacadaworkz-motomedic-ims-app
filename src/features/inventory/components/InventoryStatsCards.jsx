import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { UI_TEXT } from '../utils';

const InventoryStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
          {UI_TEXT.STATS_TOTAL_ITEMS}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          {stats.totalItems}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
          {UI_TEXT.STATS_IN_STOCK}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-green-600 dark:text-green-400">
          {stats.inStock}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
          {UI_TEXT.STATS_LOW_STOCK}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
          {stats.lowStock}
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-700 dark:text-gray-300">
          {UI_TEXT.STATS_OUT_OF_STOCK}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold text-red-600 dark:text-red-400">
          {stats.outOfStock}
        </div>
      </CardContent>
    </Card>
  </div>
);

InventoryStatsCards.propTypes = {
  stats: PropTypes.shape({
    totalItems: PropTypes.number.isRequired,
    inStock: PropTypes.number.isRequired,
    lowStock: PropTypes.number.isRequired,
    outOfStock: PropTypes.number.isRequired,
  }).isRequired,
};

export default InventoryStatsCards;

