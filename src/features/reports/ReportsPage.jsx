import React, { useCallback } from 'react';
import { useReports } from './hooks';
import {
  ReportsHeader,
  ReportTypeSelector,
  DateRangeSelector,
  SalesReport,
  PurchaseReport,
  InventoryReport,
  ProductPerformanceReport,
  StockAdjustmentReport,
  ProfitLossReport,
} from './components';
import { REPORT_TYPES, exportReportToCSV } from './utils';

const ReportsPage = () => {
  const {
    reportType,
    dateRange,
    customStartDate,
    customEndDate,
    isLoading,
    products,
    salesData,
    purchaseData,
    inventoryData,
    productPerformanceData,
    stockAdjustmentData,
    profitLossData,
    handleReportTypeChange,
    handleDateRangeChange,
    handleCustomStartDateChange,
    handleCustomEndDateChange,
  } = useReports();

  const handleExport = useCallback(() => {
    let reportData = {};

    switch (reportType) {
      case REPORT_TYPES.SALES:
        reportData = salesData;
        break;
      case REPORT_TYPES.PURCHASE:
        reportData = purchaseData;
        break;
      case REPORT_TYPES.INVENTORY:
        reportData = { ...inventoryData, products };
        break;
      case REPORT_TYPES.PRODUCT_PERFORMANCE:
        reportData = productPerformanceData;
        break;
      case REPORT_TYPES.STOCK_ADJUSTMENT:
        reportData = stockAdjustmentData;
        break;
      case REPORT_TYPES.PROFIT_LOSS:
        reportData = profitLossData;
        break;
      default:
        return;
    }

    exportReportToCSV(reportType, reportData, dateRange);
  }, [reportType, dateRange, salesData, purchaseData, inventoryData, productPerformanceData, stockAdjustmentData, profitLossData, products]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground dark:text-gray-400">Loading reports...</div>
        </div>
      </div>
    );
  }

  const renderReportContent = () => {
    switch (reportType) {
      case REPORT_TYPES.SALES:
        return <SalesReport salesData={salesData} />;
      case REPORT_TYPES.PURCHASE:
        return <PurchaseReport purchaseData={purchaseData} />;
      case REPORT_TYPES.INVENTORY:
        return <InventoryReport inventoryData={inventoryData} products={products} />;
      case REPORT_TYPES.PRODUCT_PERFORMANCE:
        return <ProductPerformanceReport productPerformanceData={productPerformanceData} />;
      case REPORT_TYPES.STOCK_ADJUSTMENT:
        return <StockAdjustmentReport stockAdjustmentData={stockAdjustmentData} />;
      case REPORT_TYPES.PROFIT_LOSS:
        return <ProfitLossReport profitLossData={profitLossData} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <ReportsHeader onExportClick={handleExport} />

      <ReportTypeSelector selectedType={reportType} onTypeChange={handleReportTypeChange} />

      <DateRangeSelector
        selectedRange={dateRange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onRangeChange={handleDateRangeChange}
        onCustomStartDateChange={handleCustomStartDateChange}
        onCustomEndDateChange={handleCustomEndDateChange}
      />

      {/* Report Content */}
      <section aria-label="Report Content">{renderReportContent()}</section>
    </div>
  );
};

export default ReportsPage;

