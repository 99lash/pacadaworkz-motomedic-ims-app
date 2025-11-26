export const UI_TEXT = {
  PAGE_TITLE: 'Purchase Orders',
  PAGE_SUBTITLE: 'Manage stock in and purchase orders',
  BTN_ADD_PURCHASE: 'New Purchase Order',
  EMPTY_TITLE: 'No purchase orders found',
  EMPTY_DESCRIPTION: 'Create your first purchase order to manage stock intake.',
  EMPTY_ACTION: 'Create purchase order',
  FORM_TITLE_CREATE: 'New Purchase Order',
  FORM_TITLE_EDIT: 'Edit Purchase Order',
  LABEL_SUPPLIER: 'Supplier',
  LABEL_EXPECTED_DELIVERY: 'Expected Delivery Date',
  LABEL_NOTES: 'Notes',
  LABEL_ITEMS: 'Items',
  LABEL_PRODUCT: 'Product',
  LABEL_QUANTITY: 'Quantity',
  LABEL_COST_PRICE: 'Cost Price',
  LABEL_TOTAL: 'Total',
  PLACEHOLDER_SUPPLIER: 'Select supplier',
  PLACEHOLDER_PRODUCT: 'Select product',
  PLACEHOLDER_QUANTITY: 'Enter quantity',
  PLACEHOLDER_COST_PRICE: 'Enter cost price',
  PLACEHOLDER_NOTES: 'Add notes (optional)',
  BTN_ADD_ITEM: 'Add Item',
  BTN_REMOVE_ITEM: 'Remove',
  BTN_RECEIVE: 'Receive',
  TOAST_CREATE: 'Purchase order created successfully',
  TOAST_RECEIVED: 'Purchase order marked as received',
  TOAST_DELETE: 'Purchase order deleted successfully',
  TOAST_FORM_ERROR: 'Please fix the highlighted errors.',
  STATUS_PENDING: 'Pending',
  STATUS_PARTIAL: 'Partial',
  STATUS_RECEIVED: 'Received',
};

export const INITIAL_FORM_STATE = {
  supplierId: '',
  expectedDeliveryDate: '',
  notes: '',
  items: [],
};

export const INITIAL_FORM_ERRORS = {
  supplierId: '',
  expectedDeliveryDate: '',
  items: '',
};

export const PURCHASE_STATUSES = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  RECEIVED: 'received',
};

