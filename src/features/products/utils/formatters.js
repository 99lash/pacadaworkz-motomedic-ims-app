import { INITIAL_PRODUCT_FORM } from './constants';

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

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

export const mapProductToFormState = (product) => {
  if (!product) {
    return { ...INITIAL_PRODUCT_FORM };
  }

  return {
    ...INITIAL_PRODUCT_FORM,
    name: product.name || '',
    sku: product.sku || '',
    categoryId: product.categoryId?.toString() || '',
    brandId: product.brandId?.toString() || '',
    costPrice: product.costPrice?.toString() ?? '',
    sellingPrice: product.sellingPrice?.toString() ?? '',
    reorderPoint: product.reorderPoint?.toString() ?? '',
    description: product.description || '',
    attributes: product.attributes || [],
  };
};

