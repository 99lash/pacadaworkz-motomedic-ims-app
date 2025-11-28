import React from 'react';
import PropTypes from 'prop-types';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  AlertTriangle,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { REPORT_TYPES, UI_TEXT } from '../utils';

const REPORT_TYPE_CONFIG = [
  { type: REPORT_TYPES.SALES, icon: DollarSign, label: UI_TEXT.REPORT_SALES },
  { type: REPORT_TYPES.PURCHASE, icon: ShoppingCart, label: UI_TEXT.REPORT_PURCHASE },
  { type: REPORT_TYPES.INVENTORY, icon: Package, label: UI_TEXT.REPORT_INVENTORY },
  {
    type: REPORT_TYPES.PRODUCT_PERFORMANCE,
    icon: TrendingUp,
    label: UI_TEXT.REPORT_PRODUCT_PERFORMANCE,
  },
  {
    type: REPORT_TYPES.STOCK_ADJUSTMENT,
    icon: AlertTriangle,
    label: UI_TEXT.REPORT_STOCK_ADJUSTMENT,
  },
  { type: REPORT_TYPES.PROFIT_LOSS, icon: PieChartIcon, label: UI_TEXT.REPORT_PROFIT_LOSS },
];

const ReportTypeSelector = ({ selectedType, onTypeChange }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
    {REPORT_TYPE_CONFIG.map(({ type, icon: Icon, label }) => {
      const IconComponent = Icon;
      return (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`px-4 py-3 rounded-lg transition-all ${
            selectedType === type
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-pressed={selectedType === type}
        >
          <IconComponent className="w-5 h-5 mx-auto mb-1" />
          <div className="text-sm font-medium">{label}</div>
        </button>
      );
    })}
  </div>
);

ReportTypeSelector.propTypes = {
  selectedType: PropTypes.string.isRequired,
  onTypeChange: PropTypes.func.isRequired,
};

export default ReportTypeSelector;

