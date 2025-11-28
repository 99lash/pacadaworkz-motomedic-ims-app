import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { ReportSummaryCard } from './';
import { UI_TEXT, formatCurrency } from '../utils';

const InventoryReport = ({ inventoryData }) => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <ReportSummaryCard
        label={UI_TEXT.INVENTORY_TOTAL_PRODUCTS}
        value={inventoryData.totalProducts}
      />
      <ReportSummaryCard
        label={UI_TEXT.INVENTORY_LOW_STOCK}
        value={inventoryData.lowStock}
        className="border-orange-200 dark:border-orange-800"
      />
      <ReportSummaryCard
        label={UI_TEXT.INVENTORY_OUT_OF_STOCK}
        value={inventoryData.outOfStock}
        className="border-red-200 dark:border-red-800"
      />
      <ReportSummaryCard
        label={UI_TEXT.INVENTORY_TOTAL_VALUE}
        value={formatCurrency(inventoryData.totalValue)}
      />
    </div>

    {/* Low Stock Items */}
    {inventoryData.lowStockItems.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.INVENTORY_LOW_STOCK_ITEMS}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_PRODUCT}
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_SKU}
                  </TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_CURRENT_STOCK}
                  </TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_REORDER_POINT}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.lowStockItems.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.sku}</TableCell>
                    <TableCell className="text-right text-orange-600 dark:text-orange-400 font-medium">
                      {product.currentStock}
                    </TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400">
                      {product.reorderPoint}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )}

    {/* Out of Stock Items */}
    {inventoryData.outOfStockItems.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.INVENTORY_OUT_OF_STOCK_ITEMS}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_PRODUCT}
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_SKU}
                  </TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-gray-300">
                    {UI_TEXT.INVENTORY_REORDER_POINT}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.outOfStockItems.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">{product.sku}</TableCell>
                    <TableCell className="text-right text-gray-600 dark:text-gray-400">
                      {product.reorderPoint}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

InventoryReport.propTypes = {
  inventoryData: PropTypes.shape({
    totalProducts: PropTypes.number.isRequired,
    lowStock: PropTypes.number.isRequired,
    outOfStock: PropTypes.number.isRequired,
    totalValue: PropTypes.number.isRequired,
    lowStockItems: PropTypes.array.isRequired,
    outOfStockItems: PropTypes.array.isRequired,
  }).isRequired,
};

export default InventoryReport;

