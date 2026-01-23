/**
 * Reports Helper Functions
 * Utility functions for reports calculations and formatting
 */

import { DATE_RANGE_TYPES } from './constants';

/**
 * Formats currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Gets date range filter based on date range type
 * @param {string} dateRange - Date range type
 * @param {string} customStartDate - Custom start date
 * @param {string} customEndDate - Custom end date
 * @returns {Object} Start and end dates
 */
export const getDateRangeFilter = (dateRange, customStartDate = '', customEndDate = '') => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (dateRange) {
    case DATE_RANGE_TYPES.DAILY:
      return { start: today, end: now };
    case DATE_RANGE_TYPES.WEEKLY: {
      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - 7);
      return { start: weekStart, end: now };
    }
    case DATE_RANGE_TYPES.MONTHLY: {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: monthStart, end: now };
    }
    case DATE_RANGE_TYPES.QUARTERLY: {
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      return { start: quarterStart, end: now };
    }
    case DATE_RANGE_TYPES.YEARLY: {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return { start: yearStart, end: now };
    }
    case DATE_RANGE_TYPES.CUSTOM:
      return {
        start: customStartDate ? new Date(customStartDate) : new Date(0),
        end: customEndDate ? new Date(customEndDate) : now,
      };
    default:
      return { start: new Date(0), end: now };
  }
};

/**
 * Filters date by date range
 * @param {string} date - Date string to filter
 * @param {string} dateRange - Date range type
 * @param {string} customStartDate - Custom start date
 * @param {string} customEndDate - Custom end date
 * @returns {boolean} Whether date is in range
 */
export const filterByDateRange = (date, dateRange, customStartDate = '', customEndDate = '') => {
  const { start, end } = getDateRangeFilter(dateRange, customStartDate, customEndDate);
  const itemDate = new Date(date);
  return itemDate >= start && itemDate <= end;
};

/**
 * Formats date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString();
};

/**
 * Capitalizes first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

