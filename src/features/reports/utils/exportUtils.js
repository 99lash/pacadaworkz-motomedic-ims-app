/**
 * Export Utilities
 * Functions for exporting reports to CSV
 */

import { REPORT_TYPES, UI_TEXT } from './constants';
import { formatCurrency } from './helpers';

/**
 * Exports report data to CSV
 * @param {string} reportType - Type of report to export
 * @param {Object} reportData - Report data object
 * @param {string} dateRange - Selected date range
 */
export const exportReportToCSV = (reportType, reportData, dateRange) => {
  let csvContent = '';
  let filename = '';

  switch (reportType) {
    case REPORT_TYPES.SALES:
      filename = 'sales-report.csv';
      csvContent = 'Sales Report\n\n';
      csvContent += `Period: ${dateRange}\n`;
      csvContent += `${UI_TEXT.SALES_TOTAL_SALES}: ${formatCurrency(reportData.totalSales)}\n`;
      csvContent += `${UI_TEXT.SALES_TRANSACTIONS}: ${reportData.transactionCount}\n\n`;
      csvContent += 'Sales by Staff\n';
      csvContent += 'Staff,Sales\n';
      Object.entries(reportData.salesByStaff).forEach(([staff, sales]) => {
        csvContent += `${staff},${sales}\n`;
      });
      break;

    case REPORT_TYPES.PURCHASE:
      filename = 'purchase-report.csv';
      csvContent = 'Purchase Report\n\n';
      csvContent += `Period: ${dateRange}\n`;
      csvContent += `${UI_TEXT.PURCHASE_TOTAL}: ${formatCurrency(reportData.totalPurchases)}\n`;
      csvContent += `${UI_TEXT.PURCHASE_ORDERS}: ${reportData.poCount}\n\n`;
      csvContent += 'Purchase by Supplier\n';
      csvContent += 'Supplier,Amount\n';
      Object.entries(reportData.purchaseBySupplier).forEach(([supplier, amount]) => {
        csvContent += `${supplier},${amount}\n`;
      });
      break;

    case REPORT_TYPES.INVENTORY:
      filename = 'inventory-report.csv';
      csvContent = 'Inventory Report\n\n';
      csvContent += `${UI_TEXT.INVENTORY_TOTAL_PRODUCTS}: ${reportData.totalProducts}\n`;
      csvContent += `${UI_TEXT.INVENTORY_LOW_STOCK}: ${reportData.lowStock}\n`;
      csvContent += `${UI_TEXT.INVENTORY_OUT_OF_STOCK}: ${reportData.outOfStock}\n`;
      csvContent += `${UI_TEXT.INVENTORY_TOTAL_VALUE}: ${formatCurrency(reportData.totalValue)}\n\n`;
      csvContent += 'Product,SKU,Current Stock,Reorder Point,Value\n';
      reportData.products?.forEach((p) => {
        csvContent += `${p.name},${p.sku},${p.currentStock},${p.reorderPoint},${(p.currentStock * p.costPrice).toFixed(2)}\n`;
      });
      break;

    case REPORT_TYPES.PRODUCT_PERFORMANCE:
      filename = 'product-performance-report.csv';
      csvContent = 'Product Performance Report\n\n';
      csvContent += `Period: ${dateRange}\n\n`;
      csvContent += 'Top Selling Products\n';
      csvContent += 'Product,Quantity Sold,Revenue\n';
      reportData.topProducts?.forEach((p) => {
        csvContent += `${p.productName},${p.quantity},${p.revenue}\n`;
      });
      break;

    case REPORT_TYPES.STOCK_ADJUSTMENT:
      filename = 'stock-adjustment-report.csv';
      csvContent = 'Stock Adjustment Report\n\n';
      csvContent += `Period: ${dateRange}\n`;
      csvContent += `${UI_TEXT.ADJUSTMENT_TOTAL}: ${reportData.totalAdjustments}\n`;
      csvContent += `${UI_TEXT.ADJUSTMENT_VALUE}: ${formatCurrency(reportData.adjustmentValue)}\n\n`;
      csvContent += 'Date,Product,Adjustment,Reason,Staff\n';
      reportData.adjustments?.forEach((adj) => {
        csvContent += `${new Date(adj.createdAt).toLocaleDateString()},${adj.productName},${adj.adjustmentQuantity},${adj.reason},${adj.userName}\n`;
      });
      break;

    case REPORT_TYPES.PROFIT_LOSS:
      filename = 'profit-loss-report.csv';
      csvContent = 'Profit & Loss Report\n\n';
      csvContent += `Period: ${dateRange}\n\n`;
      csvContent += `${UI_TEXT.PL_REVENUE},${formatCurrency(reportData.revenue)}\n`;
      csvContent += `${UI_TEXT.PL_COGS},${formatCurrency(reportData.cogs)}\n`;
      csvContent += `${UI_TEXT.PL_GROSS_PROFIT},${formatCurrency(reportData.grossProfit)}\n`;
      csvContent += `${UI_TEXT.PL_ADJUSTMENT_LOSSES},${formatCurrency(reportData.adjustmentLosses)}\n`;
      csvContent += `${UI_TEXT.PL_NET_PROFIT},${formatCurrency(reportData.netProfit)}\n`;
      csvContent += `${UI_TEXT.PL_PROFIT_MARGIN},${reportData.profitMargin.toFixed(2)}%\n`;
      break;

    default:
      return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

