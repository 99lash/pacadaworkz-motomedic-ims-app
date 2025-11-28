import { INITIAL_PRODUCT_FORM, UI_TEXT, VALIDATION } from './constants';

const ensureNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
};

export const validateProductForm = (formData = INITIAL_PRODUCT_FORM) => {
  const errors = {};
  const name = formData.name?.trim() || '';
  const sku = formData.sku?.trim() || '';

  if (!name) {
    errors.name = UI_TEXT.VALIDATION_NAME_REQUIRED;
  } else if (name.length < VALIDATION.NAME_MIN_LENGTH || name.length > VALIDATION.NAME_MAX_LENGTH) {
    errors.name = UI_TEXT.VALIDATION_NAME_LENGTH;
  }

  if (!sku) {
    errors.sku = UI_TEXT.VALIDATION_SKU_REQUIRED;
  } else if (sku.length < VALIDATION.SKU_MIN_LENGTH || sku.length > VALIDATION.SKU_MAX_LENGTH) {
    errors.sku = UI_TEXT.VALIDATION_SKU_LENGTH;
  }

  if (!formData.categoryId) {
    errors.categoryId = UI_TEXT.VALIDATION_CATEGORY_REQUIRED;
  }
  if (!formData.brandId) {
    errors.brandId = UI_TEXT.VALIDATION_BRAND_REQUIRED;
  }

  const costPrice = ensureNumber(formData.costPrice);
  if (Number.isNaN(costPrice) || costPrice < VALIDATION.PRICE_MIN) {
    errors.costPrice = UI_TEXT.VALIDATION_COST_REQUIRED;
  }

  const sellingPrice = ensureNumber(formData.sellingPrice);
  if (Number.isNaN(sellingPrice) || sellingPrice < VALIDATION.PRICE_MIN) {
    errors.sellingPrice = UI_TEXT.VALIDATION_SELLING_REQUIRED;
  } else if (!Number.isNaN(costPrice) && sellingPrice < costPrice) {
    errors.sellingPrice = UI_TEXT.VALIDATION_SELLING_GREATER;
  }

  const currentStock = ensureNumber(formData.currentStock);
  if (Number.isNaN(currentStock) || currentStock < VALIDATION.STOCK_MIN) {
    errors.currentStock = UI_TEXT.VALIDATION_STOCK_REQUIRED;
  }

  const reorderPoint = ensureNumber(formData.reorderPoint);
  if (Number.isNaN(reorderPoint) || reorderPoint < VALIDATION.STOCK_MIN) {
    errors.reorderPoint = UI_TEXT.VALIDATION_REORDER_REQUIRED;
  }

  if (formData.description && formData.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) {
    errors.description = UI_TEXT.VALIDATION_DESCRIPTION_LENGTH;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeProductData = (formData) => ({
  name: formData.name?.trim() || '',
  sku: formData.sku?.trim() || '',
  categoryId: formData.categoryId,
  brandId: formData.brandId,
  costPrice: Number(formData.costPrice) || 0,
  sellingPrice: Number(formData.sellingPrice) || 0,
  currentStock: Number(formData.currentStock) || 0,
  reorderPoint: Number(formData.reorderPoint) || 0,
  description: formData.description?.trim() || '',
  attributes: (formData.attributes || []).map((attr) => ({
    attributeId: attr.attributeId,
    value: attr.value?.trim() || '',
  })),
});

