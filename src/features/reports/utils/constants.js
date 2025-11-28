export const UI_TEXT = {
  PAGE_TITLE: 'Reports & Analytics',
  PAGE_SUBTITLE: 'View detailed business reports and insights',
  BTN_EXPORT_CSV: 'Export CSV',
  
  // Report Types
  REPORT_SALES: 'Sales',
  REPORT_PURCHASE: 'Purchase',
  REPORT_INVENTORY: 'Inventory',
  REPORT_PRODUCT_PERFORMANCE: 'Performance',
  REPORT_STOCK_ADJUSTMENT: 'Adjustments',
  REPORT_PROFIT_LOSS: 'P&L',
  
  // Date Range
  PERIOD_LABEL: 'Period:',
  DATE_RANGE_DAILY: 'daily',
  DATE_RANGE_WEEKLY: 'weekly',
  DATE_RANGE_MONTHLY: 'monthly',
  DATE_RANGE_QUARTERLY: 'quarterly',
  DATE_RANGE_YEARLY: 'yearly',
  DATE_RANGE_CUSTOM: 'custom',
  DATE_TO: 'to',
  
  // Sales Report
  SALES_TOTAL_SALES: 'Total Sales',
  SALES_TRANSACTIONS: 'Transactions',
  SALES_AVERAGE_TRANSACTION: 'Average Transaction',
  SALES_TREND: 'Sales Trend',
  SALES_BY_STAFF: 'Sales by Staff',
  NO_SALES_DATA: 'No sales data for selected period',
  NO_STAFF_DATA: 'No staff sales data available',
  
  // Purchase Report
  PURCHASE_TOTAL: 'Total Purchases',
  PURCHASE_ORDERS: 'Purchase Orders',
  PURCHASE_AVERAGE_PO: 'Average PO Value',
  PURCHASE_TREND: 'Purchase Trend',
  PURCHASE_BY_SUPPLIER: 'Purchase by Supplier',
  NO_PURCHASE_DATA: 'No purchase data for selected period',
  NO_SUPPLIER_DATA: 'No supplier purchase data available',
  
  // Inventory Report
  INVENTORY_TOTAL_PRODUCTS: 'Total Products',
  INVENTORY_LOW_STOCK: 'Low Stock Items',
  INVENTORY_OUT_OF_STOCK: 'Out of Stock',
  INVENTORY_TOTAL_VALUE: 'Total Value',
  INVENTORY_LOW_STOCK_ITEMS: 'Low Stock Items',
  INVENTORY_OUT_OF_STOCK_ITEMS: 'Out of Stock Items',
  INVENTORY_PRODUCT: 'Product',
  INVENTORY_SKU: 'SKU',
  INVENTORY_CURRENT_STOCK: 'Current Stock',
  INVENTORY_REORDER_POINT: 'Reorder Point',
  
  // Product Performance
  PRODUCT_TOP_SELLING: 'Top Selling Products',
  PRODUCT_QUANTITY_SOLD: 'Quantity Sold',
  PRODUCT_REVENUE: 'Revenue',
  PRODUCT_REVENUE_BY_CATEGORY: 'Revenue by Category',
  PRODUCT_REVENUE_BY_BRAND: 'Revenue by Brand',
  NO_PRODUCT_DATA: 'No product sales data available',
  NO_CATEGORY_DATA: 'No category data available',
  NO_BRAND_DATA: 'No brand data available',
  
  // Stock Adjustment
  ADJUSTMENT_TOTAL: 'Total Adjustments',
  ADJUSTMENT_VALUE: 'Adjustment Value',
  ADJUSTMENT_BY_REASON: 'Adjustments by Reason',
  ADJUSTMENT_RECENT: 'Recent Adjustments',
  ADJUSTMENT_DATE: 'Date',
  ADJUSTMENT_PRODUCT: 'Product',
  ADJUSTMENT_QUANTITY: 'Adjustment',
  ADJUSTMENT_REASON: 'Reason',
  ADJUSTMENT_STAFF: 'Staff',
  NO_ADJUSTMENT_DATA: 'No adjustment data available',
  
  // Profit & Loss
  PL_REVENUE: 'Revenue',
  PL_COGS: 'Cost of Goods Sold',
  PL_GROSS_PROFIT: 'Gross Profit',
  PL_ADJUSTMENT_LOSSES: 'Adjustment Losses',
  PL_NET_PROFIT: 'Net Profit',
  PL_PROFIT_MARGIN: 'Profit Margin',
  PL_BREAKDOWN: 'Profit & Loss Breakdown',
  PL_LESS_COGS: 'Less: Cost of Goods Sold',
  PL_LESS_ADJUSTMENTS: 'Less: Stock Adjustment Losses',
};

export const REPORT_TYPES = {
  SALES: 'sales',
  PURCHASE: 'purchase',
  INVENTORY: 'inventory',
  PRODUCT_PERFORMANCE: 'product-performance',
  STOCK_ADJUSTMENT: 'stock-adjustment',
  PROFIT_LOSS: 'profit-loss',
};

export const DATE_RANGE_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
};

export const CHART_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // orange
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange-red
];

export const STORAGE_KEYS = {
  TRANSACTIONS: 'motomedic_transactions',
  PRODUCTS: 'motomedic_products',
  PURCHASE_ORDERS: 'motomedic_purchase_orders',
  STOCK_ADJUSTMENTS: 'motomedic_stock_adjustments',
  CATEGORIES: 'motomedic_categories',
  BRANDS: 'motomedic_brands',
};

