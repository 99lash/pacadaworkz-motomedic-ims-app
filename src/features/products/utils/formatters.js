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

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const mapProductToFormState = (product) => {
  if (!product) {
    return { ...INITIAL_PRODUCT_FORM };
  }

  // Map attribute_values from API to the form structure
  const attributes = (product.attribute_values || []).map((val) => {
    // We need to find the attribute ID for this value.
    // The API response for product attribute_values includes { id, attribute, value }
    // but not necessarily the attribute_id. 
    // However, our frontend needs it to show which attribute is selected in the dropdown.
    // Note: If the backend doesn't provide attribute_id, we might need to rely on 
    // availableAttributes to find it by name 'attribute'.
    return {
      id: `attr_existing_${val.id}`,
      attributeId: val.attribute_id?.toString() || '', // Assuming attribute_id might be available or handled later
      attributeName: val.attribute, // Keep the name to help with lookup
      valueId: val.id.toString(),
      value: val.value,
    };
  });

  return {
    ...INITIAL_PRODUCT_FORM,
    name: product.name || '',
    sku: product.sku || '',
    categoryId: (product.category?.id || product.categoryId)?.toString() || '',
    brandId: (product.brand?.id || product.brandId)?.toString() || '',
    costPrice: product.cost_price?.toString() || product.costPrice?.toString() || '',
    sellingPrice: product.unit_price?.toString() || product.sellingPrice?.toString() || '',
    location: product.location || '',
    reorderPoint: product.reorder_level?.toString() || product.reorderPoint?.toString() || '',
    description: product.description || '',
    attributes,
  };
};

