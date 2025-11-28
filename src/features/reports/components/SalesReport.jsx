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

const SalesReport = ({ salesData }) => {
  const averageTransaction =
    salesData.transactionCount > 0
      ? formatCurrency(salesData.totalSales / salesData.transactionCount)
      : '₱0';

  const salesByStaffData = Object.entries(salesData.salesByStaff).map(([name, sales]) => ({
    name,
    sales,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportSummaryCard
          label={UI_TEXT.SALES_TOTAL_SALES}
          value={formatCurrency(salesData.totalSales)}
        />
        <ReportSummaryCard label={UI_TEXT.SALES_TRANSACTIONS} value={salesData.transactionCount} />
        <ReportSummaryCard
          label={UI_TEXT.SALES_AVERAGE_TRANSACTION}
          value={averageTransaction}
        />
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.SALES_TREND}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesData.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData.trendData}>
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
                  dataKey="sales"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_SALES_DATA}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales by Staff */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.SALES_BY_STAFF}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {salesByStaffData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(300, salesByStaffData.length * 40)}>
              <BarChart data={salesByStaffData} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
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
                  dataKey="name"
                  width={150}
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                  interval={0}
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
                <Bar dataKey="sales" fill="#3B82F6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_STAFF_DATA}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

SalesReport.propTypes = {
  salesData: PropTypes.shape({
    totalSales: PropTypes.number.isRequired,
    transactionCount: PropTypes.number.isRequired,
    salesByStaff: PropTypes.object.isRequired,
    trendData: PropTypes.array.isRequired,
  }).isRequired,
};

export default SalesReport;

