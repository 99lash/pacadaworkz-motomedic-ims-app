import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { UI_TEXT, CHART_COLORS, formatCurrency } from '../utils';

const ProductPerformanceReport = ({ productPerformanceData }) => {
  const revenueByCategoryData = Object.entries(productPerformanceData.revenueByCategory).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const revenueByBrandData = Object.entries(productPerformanceData.revenueByBrand).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="space-y-6">
      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.PRODUCT_TOP_SELLING}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {productPerformanceData.topProducts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productPerformanceData.topProducts} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    type="number"
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    width={120}
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        {UI_TEXT.INVENTORY_PRODUCT}
                      </TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">
                        {UI_TEXT.PRODUCT_QUANTITY_SOLD}
                      </TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">
                        {UI_TEXT.PRODUCT_REVENUE}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productPerformanceData.topProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {product.productName}
                        </TableCell>
                        <TableCell className="text-right text-gray-600 dark:text-gray-400">
                          {product.quantity}
                        </TableCell>
                        <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(product.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_PRODUCT_DATA}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue by Category & Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {UI_TEXT.PRODUCT_REVENUE_BY_CATEGORY}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
                {UI_TEXT.NO_CATEGORY_DATA}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue by Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {UI_TEXT.PRODUCT_REVENUE_BY_BRAND}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueByBrandData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueByBrandData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueByBrandData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
                {UI_TEXT.NO_BRAND_DATA}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

ProductPerformanceReport.propTypes = {
  productPerformanceData: PropTypes.shape({
    topProducts: PropTypes.array.isRequired,
    worstProducts: PropTypes.array.isRequired,
    revenueByCategory: PropTypes.object.isRequired,
    revenueByBrand: PropTypes.object.isRequired,
  }).isRequired,
};

export default ProductPerformanceReport;

