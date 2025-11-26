/**
 * Purchase Order Form Validators
 */

export const validatePurchaseOrderForm = (formData) => {
  const errors = {};

  // Supplier validation
  if (!formData.supplierId?.trim()) {
    errors.supplierId = 'Supplier is required.';
  }

  // Expected delivery date validation
  if (!formData.expectedDeliveryDate) {
    errors.expectedDeliveryDate = 'Expected delivery date is required.';
  } else {
    const deliveryDate = new Date(formData.expectedDeliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDate < today) {
      errors.expectedDeliveryDate = 'Expected delivery date cannot be in the past.';
    }
  }

  // Items validation
  if (!formData.items || formData.items.length === 0) {
    errors.items = 'At least one item is required.';
  } else {
    // Validate each item
    formData.items.forEach((item, index) => {
      if (!item.productId) {
        errors[`items.${index}.productId`] = 'Product is required.';
      }
      if (!item.quantityOrdered || item.quantityOrdered <= 0) {
        errors[`items.${index}.quantityOrdered`] = 'Quantity must be greater than 0.';
      }
      if (!item.costPrice || item.costPrice <= 0) {
        errors[`items.${index}.costPrice`] = 'Cost price must be greater than 0.';
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

