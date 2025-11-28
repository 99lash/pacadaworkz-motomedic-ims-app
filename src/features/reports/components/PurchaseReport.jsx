import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ReportSummaryCard } from './';
import { UI_TEXT, formatCurrency } from '../utils';

const PurchaseReport = ({ purchaseData }) => {
  const averagePOValue =
    purchaseData.poCount > 0
      ? formatCurrency(purchaseData.totalPurchases / purchaseData.poCount)
      : '₱0';

  const purchaseBySupplierData = Object.entries(purchaseData.purchaseBySupplier).map(
    ([name, amount]) => ({
      name,
      amount,
    })
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportSummaryCard
          label={UI_TEXT.PURCHASE_TOTAL}
          value={formatCurrency(purchaseData.totalPurchases)}
        />
        <ReportSummaryCard label={UI_TEXT.PURCHASE_ORDERS} value={purchaseData.poCount} />
        <ReportSummaryCard label={UI_TEXT.PURCHASE_AVERAGE_PO} value={averagePOValue} />
      </div>

      {/* Purchase Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.PURCHASE_TREND}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseData.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={purchaseData.trendData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="date"
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
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
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_PURCHASE_DATA}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase by Supplier */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.PURCHASE_BY_SUPPLIER}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchaseBySupplierData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={purchaseBySupplierData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
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
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_SUPPLIER_DATA}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

PurchaseReport.propTypes = {
  purchaseData: PropTypes.shape({
    totalPurchases: PropTypes.number.isRequired,
    poCount: PropTypes.number.isRequired,
    purchaseBySupplier: PropTypes.object.isRequired,
    trendData: PropTypes.array.isRequired,
  }).isRequired,
};

export default PurchaseReport;

