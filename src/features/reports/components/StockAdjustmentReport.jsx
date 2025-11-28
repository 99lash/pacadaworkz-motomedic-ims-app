import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { ReportSummaryCard } from './';
import { UI_TEXT, formatCurrency, capitalizeWords, formatDate } from '../utils';

const StockAdjustmentReport = ({ stockAdjustmentData }) => {
  const adjustmentByReasonData = Object.entries(stockAdjustmentData.adjustmentByReason).map(
    ([reason, count]) => ({
      reason: capitalizeWords(reason),
      count,
    })
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReportSummaryCard
          label={UI_TEXT.ADJUSTMENT_TOTAL}
          value={stockAdjustmentData.totalAdjustments}
        />
        <ReportSummaryCard
          label={UI_TEXT.ADJUSTMENT_VALUE}
          value={formatCurrency(stockAdjustmentData.adjustmentValue)}
        />
      </div>

      {/* Adjustments by Reason */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.ADJUSTMENT_BY_REASON}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adjustmentByReasonData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adjustmentByReasonData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="reason"
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  className="text-xs text-gray-600 dark:text-gray-400"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground dark:text-gray-400">
              {UI_TEXT.NO_ADJUSTMENT_DATA}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Adjustments */}
      {stockAdjustmentData.adjustments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {UI_TEXT.ADJUSTMENT_RECENT}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                <Table>
                  <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-900/50">
                    <TableRow>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        {UI_TEXT.ADJUSTMENT_DATE}
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        {UI_TEXT.ADJUSTMENT_PRODUCT}
                      </TableHead>
                      <TableHead className="text-right text-gray-700 dark:text-gray-300">
                        {UI_TEXT.ADJUSTMENT_QUANTITY}
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        {UI_TEXT.ADJUSTMENT_REASON}
                      </TableHead>
                      <TableHead className="text-gray-700 dark:text-gray-300">
                        {UI_TEXT.ADJUSTMENT_STAFF}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockAdjustmentData.adjustments.slice(0, 20).map((adj) => (
                      <TableRow
                        key={adj.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {formatDate(adj.createdAt)}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                          {adj.productName}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            adj.adjustmentQuantity < 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {adj.adjustmentQuantity > 0 ? '+' : ''}
                          {adj.adjustmentQuantity}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 capitalize">
                          {capitalizeWords(adj.reason)}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400">
                          {adj.userName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

StockAdjustmentReport.propTypes = {
  stockAdjustmentData: PropTypes.shape({
    totalAdjustments: PropTypes.number.isRequired,
    adjustmentByReason: PropTypes.object.isRequired,
    adjustmentByStaff: PropTypes.object.isRequired,
    adjustmentValue: PropTypes.number.isRequired,
    adjustments: PropTypes.array.isRequired,
  }).isRequired,
};

export default StockAdjustmentReport;

