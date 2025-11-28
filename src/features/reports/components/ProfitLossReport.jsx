import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { ReportSummaryCard } from './';
import { UI_TEXT, formatCurrency } from '../utils';

const ProfitLossReport = ({ profitLossData }) => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ReportSummaryCard
        label={UI_TEXT.PL_REVENUE}
        value={formatCurrency(profitLossData.revenue)}
        className="border-green-200 dark:border-green-800"
      />
      <ReportSummaryCard
        label={UI_TEXT.PL_COGS}
        value={formatCurrency(profitLossData.cogs)}
      />
      <ReportSummaryCard
        label={UI_TEXT.PL_GROSS_PROFIT}
        value={formatCurrency(profitLossData.grossProfit)}
      />
      <ReportSummaryCard
        label={UI_TEXT.PL_ADJUSTMENT_LOSSES}
        value={formatCurrency(profitLossData.adjustmentLosses)}
        className="border-red-200 dark:border-red-800"
      />
      <ReportSummaryCard
        label={UI_TEXT.PL_NET_PROFIT}
        value={formatCurrency(profitLossData.netProfit)}
        className={
          profitLossData.netProfit >= 0
            ? 'border-green-200 dark:border-green-800'
            : 'border-red-200 dark:border-red-800'
        }
      />
      <ReportSummaryCard
        label={UI_TEXT.PL_PROFIT_MARGIN}
        value={`${profitLossData.profitMargin.toFixed(2)}%`}
        className={
          profitLossData.profitMargin >= 0
            ? 'border-green-200 dark:border-green-800'
            : 'border-red-200 dark:border-red-800'
        }
      />
    </div>

    {/* Profit & Loss Breakdown */}
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {UI_TEXT.PL_BREAKDOWN}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {UI_TEXT.PL_REVENUE}
            </span>
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {formatCurrency(profitLossData.revenue)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{UI_TEXT.PL_LESS_COGS}</span>
            <span className="text-red-600 dark:text-red-400">
              -{formatCurrency(profitLossData.cogs)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b-2 border-gray-400 dark:border-gray-600">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {UI_TEXT.PL_GROSS_PROFIT}
            </span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatCurrency(profitLossData.grossProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">
              {UI_TEXT.PL_LESS_ADJUSTMENTS}
            </span>
            <span className="text-red-600 dark:text-red-400">
              -{formatCurrency(profitLossData.adjustmentLosses)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {UI_TEXT.PL_NET_PROFIT}
            </span>
            <span
              className={`text-lg font-bold ${
                profitLossData.netProfit >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {formatCurrency(profitLossData.netProfit)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

ProfitLossReport.propTypes = {
  profitLossData: PropTypes.shape({
    revenue: PropTypes.number.isRequired,
    cogs: PropTypes.number.isRequired,
    grossProfit: PropTypes.number.isRequired,
    adjustmentLosses: PropTypes.number.isRequired,
    netProfit: PropTypes.number.isRequired,
    profitMargin: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProfitLossReport;

