import { INITIAL_PRODUCT_FORM } from './constants';

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

const STOCK_STATUS_META = {
  in_stock: {
    label: 'In stock',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  low_stock: {
    label: 'Low stock',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  out_of_stock: {
    label: 'Out of stock',
    className: 'bg-rose-100 text-rose-800 border-rose-200',
  },
};

const deriveStockStatus = (product) => {
  if (product.stockStatus) return product.stockStatus;
  if (product.currentStock <= 0) return 'out_of_stock';
  if (product.currentStock <= product.reorderPoint) return 'low_stock';
  return 'in_stock';
};

export const formatCurrency = (value) => currencyFormatter.format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getStockStatusMeta = (product) => {
  const key = deriveStockStatus(product);
  return STOCK_STATUS_META[key] || STOCK_STATUS_META.in_stock;
};

export const mapProductToFormState = (product) => {
  if (!product) {
    return { ...INITIAL_PRODUCT_FORM };
  }

  return {
    ...INITIAL_PRODUCT_FORM,
    name: product.name || '',
    sku: product.sku || '',
    categoryId: product.categoryId || '',
    brandId: product.brandId || '',
    costPrice: product.costPrice?.toString() ?? '',
    sellingPrice: product.sellingPrice?.toString() ?? '',
    currentStock: product.currentStock?.toString() ?? '',
    reorderPoint: product.reorderPoint?.toString() ?? '',
    description: product.description || '',
  };
};

