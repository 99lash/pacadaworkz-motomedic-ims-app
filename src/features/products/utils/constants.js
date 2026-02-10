export const API_ENDPOINTS = {
  PRODUCTS: '/v1/products',
  PRODUCT_BY_ID: (id) => `/v1/products/${id}`,
};

export const UI_TEXT = {
  PAGE_TITLE: 'Products & Inventory',
  PAGE_SUBTITLE: 'Track motorcycle parts, pricing, and availability in real-time.',

  BREADCRUMB_DASHBOARD: 'Dashboard',
  BREADCRUMB_INVENTORY: 'Inventory',
  BREADCRUMB_PRODUCTS: 'Products',

  FILTER_TITLE: 'Filters',
  FILTER_SEARCH_ARIA: 'Search products by name or SKU',
  PLACEHOLDER_SEARCH: 'Search by name, SKU, or description...',

  LABEL_NAME: 'Product name',
  LABEL_SKU: 'SKU',
  LABEL_CATEGORY: 'Category',
  LABEL_BRAND: 'Brand',
  LABEL_COST_PRICE: 'Cost price (₱)',
  LABEL_SELLING_PRICE: 'Selling price (₱)',
  LABEL_STOCK: 'Current stock',
  LABEL_REORDER_POINT: 'Reorder point',
  LABEL_DESCRIPTION: 'Description',

  PLACEHOLDER_NAME: 'e.g. Premium brake pads',
  PLACEHOLDER_SKU: 'e.g. BRK-2105',
  PLACEHOLDER_DESCRIPTION: 'Add important notes such as fitment, supplier, or warranty...',

  OPTION_ALL_CATEGORIES: 'All categories',
  OPTION_ALL_BRANDS: 'All brands',
  OPTION_SELECT_CATEGORY: 'Select a category',
  OPTION_SELECT_BRAND: 'Select a brand',

  BTN_ADD_PRODUCT: 'Add product',
  BTN_SAVE_PRODUCT: 'Save product',
  BTN_UPDATE_PRODUCT: 'Update product',
  BTN_CANCEL: 'Cancel',
  BTN_EXPORT: 'Export CSV',
  BTN_SAVING: 'Saving...',
  BTN_DELETE: 'Delete',
  BTN_DELETING: 'Deleting...',

  DIALOG_ADD_TITLE: 'Create new product',
  DIALOG_ADD_DESC: 'Complete the form below to add a new SKU to your catalog.',
  DIALOG_EDIT_TITLE: 'Update product details',
  DIALOG_EDIT_DESC: 'Edit pricing, inventory levels, or metadata.',
  DIALOG_DELETE_TITLE: 'Delete product',
  DIALOG_DELETE_DESC:
    'Are you sure you want to delete "{product}"? This action cannot be undone.',

  MSG_NO_RESULTS: 'No products match your filters',
  MSG_TRY_DIFFERENT_SEARCH: 'Try adjusting your filters or search for another keyword.',
  MSG_EMPTY_STATE: 'No products yet',
  MSG_EMPTY_STATE_HINT: 'Create your first product to start tracking inventory and sales.',

  TOAST_CREATE_SUCCESS: 'Product added successfully',
  TOAST_UPDATE_SUCCESS: 'Product updated successfully',
  TOAST_DELETE_SUCCESS: 'Product deleted successfully',
  TOAST_DELETE_ERROR: 'Unable to delete product. Please try again.',
  TOAST_LOAD_ERROR: 'Failed to load products. Please try again.',
  TOAST_SAVE_ERROR: 'Failed to save product. Please try again.',
  TOAST_EXPORT_SUCCESS: 'Products exported successfully',
  TOAST_EXPORT_ERROR: 'Unable to export products right now.',

  VALIDATION_NAME_REQUIRED: 'Product name is required.',
  VALIDATION_NAME_LENGTH: 'Product name must be between 3 and 80 characters.',
  VALIDATION_SKU_REQUIRED: 'SKU is required.',
  VALIDATION_SKU_LENGTH: 'SKU must be between 3 and 32 characters.',
  VALIDATION_CATEGORY_REQUIRED: 'Please select a category.',
  VALIDATION_BRAND_REQUIRED: 'Please select a brand.',
  VALIDATION_COST_REQUIRED: 'Cost price must be a valid number.',
  VALIDATION_SELLING_REQUIRED: 'Selling price must be a valid number.',
  VALIDATION_SELLING_GREATER: 'Selling price must be greater than or equal to cost price.',
  VALIDATION_STOCK_REQUIRED: 'Current stock must be zero or greater.',
  VALIDATION_REORDER_REQUIRED: 'Reorder point must be zero or greater.',
  VALIDATION_DESCRIPTION_LENGTH: 'Description is too long.',
};

export const VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 80,
  SKU_MIN_LENGTH: 3,
  SKU_MAX_LENGTH: 32,
  DESCRIPTION_MAX_LENGTH: 600,
  PRICE_MIN: 0,
  STOCK_MIN: 0,
};

export const DEBOUNCE = {
  SEARCH: 350,
};

export const INITIAL_PRODUCT_FORM = {
  name: '',
  sku: '',
  categoryId: '',
  brandId: '',
  costPrice: '',
  sellingPrice: '',
  currentStock: '',
  reorderPoint: '',
  description: '',
  attributes: [], // Array of { id, attributeId, value }
};

export const INITIAL_PRODUCT_ERRORS = {
  name: '',
  sku: '',
  categoryId: '',
  brandId: '',
  costPrice: '',
  sellingPrice: '',
  currentStock: '',
  reorderPoint: '',
  description: '',
};

