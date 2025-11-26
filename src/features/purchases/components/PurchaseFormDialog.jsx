import React from 'react';
import PropTypes from 'prop-types';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { Label } from '../../../shared/components/ui/label';
import { UI_TEXT } from '../utils';

const PurchaseFormDialog = ({
  isOpen,
  formData,
  formErrors,
  suppliers,
  products,
  onClose,
  onSubmit,
  onFieldChange,
  onAddItem,
  onRemoveItem,
  onItemChange,
}) => {
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  const calculateItemTotal = (item) => {
    return (item.quantityOrdered || 0) * (item.costPrice || 0);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">
            {UI_TEXT.FORM_TITLE_CREATE}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Create a new purchase order to manage stock intake from suppliers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 px-2 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplierId" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_SUPPLIER} <span className="text-destructive">*</span>
                </Label>
                <select
                  id="supplierId"
                  value={formData.supplierId}
                  onChange={(e) => onFieldChange('supplierId', e.target.value)}
                  aria-invalid={Boolean(formErrors.supplierId)}
                  className={`
                    flex h-10 w-full rounded-md border px-3 py-2 text-sm
                    ${formErrors.supplierId
                      ? 'border-destructive'
                      : 'border-gray-200 dark:border-gray-800'
                    }
                    bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
                  `}
                >
                  <option value="">{UI_TEXT.PLACEHOLDER_SUPPLIER}</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.companyName}
                    </option>
                  ))}
                </select>
                {formErrors.supplierId && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.supplierId}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="expectedDeliveryDate" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_EXPECTED_DELIVERY} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => onFieldChange('expectedDeliveryDate', e.target.value)}
                  aria-invalid={Boolean(formErrors.expectedDeliveryDate)}
                  className={formErrors.expectedDeliveryDate ? 'border-destructive' : ''}
                />
                {formErrors.expectedDeliveryDate && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.expectedDeliveryDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_NOTES}
              </Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => onFieldChange('notes', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_NOTES}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_ITEMS} <span className="text-destructive">*</span>
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>{UI_TEXT.BTN_ADD_ITEM}</span>
                </Button>
              </div>
              {formErrors.items && (
                <p className="text-sm text-destructive mb-2" role="alert">
                  {formErrors.items}
                </p>
              )}
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                  >
                    <div className="col-span-12 md:col-span-5">
                      <Label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {UI_TEXT.LABEL_PRODUCT}
                      </Label>
                      <select
                        value={item.productId}
                        onChange={(e) => onItemChange(index, 'productId', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                      >
                        <option value="">{UI_TEXT.PLACEHOLDER_PRODUCT}</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <Label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {UI_TEXT.LABEL_QUANTITY}
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantityOrdered}
                        onChange={(e) => onItemChange(index, 'quantityOrdered', parseInt(e.target.value) || 0)}
                        placeholder={UI_TEXT.PLACEHOLDER_QUANTITY}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <Label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {UI_TEXT.LABEL_COST_PRICE}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.costPrice}
                        onChange={(e) => onItemChange(index, 'costPrice', parseFloat(e.target.value) || 0)}
                        placeholder={UI_TEXT.PLACEHOLDER_COST_PRICE}
                        className="h-9"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-1 flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(index)}
                        className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {formData.items.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {UI_TEXT.LABEL_TOTAL}:
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      ₱{calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="w-full sm:w-auto"
          >
            Create Purchase Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PurchaseFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    supplierId: PropTypes.string.isRequired,
    expectedDeliveryDate: PropTypes.string.isRequired,
    notes: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        quantityOrdered: PropTypes.number.isRequired,
        costPrice: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  suppliers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onItemChange: PropTypes.func.isRequired,
};

export default PurchaseFormDialog;

