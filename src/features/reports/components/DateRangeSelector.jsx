import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';
import { DATE_RANGE_TYPES, UI_TEXT } from '../utils';

const DateRangeSelector = ({
  selectedRange,
  customStartDate,
  customEndDate,
  onRangeChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
}) => (
  <div className="flex flex-wrap items-center gap-3">
    <Calendar className="w-5 h-5 text-muted-foreground dark:text-gray-400" aria-hidden="true" />
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
      {UI_TEXT.PERIOD_LABEL}
    </span>
    <div className="flex flex-wrap gap-2">
      {Object.values(DATE_RANGE_TYPES).map((range) => (
        <button
          key={range}
          onClick={() => onRangeChange(range)}
          className={`px-3 py-1.5 rounded-lg capitalize text-sm font-medium transition-colors ${
            selectedRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          aria-pressed={selectedRange === range}
        >
          {range}
        </button>
      ))}
    </div>
    {selectedRange === DATE_RANGE_TYPES.CUSTOM && (
      <div className="flex items-center gap-2 ml-auto">
        <Input
          type="date"
          value={customStartDate}
          onChange={(e) => onCustomStartDateChange(e.target.value)}
          className="w-auto"
        />
        <span className="text-sm text-muted-foreground dark:text-gray-400">
          {UI_TEXT.DATE_TO}
        </span>
        <Input
          type="date"
          value={customEndDate}
          onChange={(e) => onCustomEndDateChange(e.target.value)}
          className="w-auto"
        />
      </div>
    )}
  </div>
);

DateRangeSelector.propTypes = {
  selectedRange: PropTypes.string.isRequired,
  customStartDate: PropTypes.string.isRequired,
  customEndDate: PropTypes.string.isRequired,
  onRangeChange: PropTypes.func.isRequired,
  onCustomStartDateChange: PropTypes.func.isRequired,
  onCustomEndDateChange: PropTypes.func.isRequired,
};

export default DateRangeSelector;

