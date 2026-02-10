import React, { memo, useId, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';
import { Textarea } from '../../../shared/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import ProductAttributesSection from './ProductAttributesSection';
import { UI_TEXT, VALIDATION } from '../utils';

const selectClass = "w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";
const optionClass = "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100";

const ProductFormDialog = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  formErrors,
  onFieldChange,
  onAttributesChange,
  isEditing,
  isSaving,
  categoryOptions,
  brandOptions,
}) => {
  const nameId = useId();
  const skuId = useId();
  const categoryId = useId();
  const brandId = useId();
  const costId = useId();
  const priceId = useId();
  const locationId = useId();
  const stockId = useId();
  const reorderId = useId();
  const descriptionId = useId();

  const dialogTitle = isEditing ? UI_TEXT.DIALOG_EDIT_TITLE : UI_TEXT.DIALOG_ADD_TITLE;
  const dialogDescription = isEditing ? UI_TEXT.DIALOG_EDIT_DESC : UI_TEXT.DIALOG_ADD_DESC;
  const submitText = isEditing ? UI_TEXT.BTN_UPDATE_PRODUCT : UI_TEXT.BTN_SAVE_PRODUCT;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const handleOpenChange = useCallback((open) => {
    // Sync state with dialog's open state
    if (!open) {
      onClose();
    }
  }, [onClose]);

  const handleInteractOutside = (event) => {
    // Prevent closing if currently saving
    if (isSaving) {
      event.preventDefault();
    }
  };

  // Don't render if not open (matches pattern used in other dialogs)
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={handleInteractOutside}
      >
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 px-2 py-4" noValidate>
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{dialogTitle}</DialogTitle>
            <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">{dialogDescription}</DialogDescription>
          </DialogHeader>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={nameId}>
                {UI_TEXT.LABEL_NAME} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={nameId}
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_NAME}
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? `${nameId}-error` : undefined}
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                disabled={isSaving}
              />
              {formErrors.name && (
                <p id={`${nameId}-error`} className="text-sm text-destructive">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={skuId}>
                {UI_TEXT.LABEL_SKU} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={skuId}
                value={formData.sku}
                onChange={(e) => onFieldChange('sku', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_SKU}
                aria-invalid={Boolean(formErrors.sku)}
                aria-describedby={formErrors.sku ? `${skuId}-error` : undefined}
                maxLength={VALIDATION.SKU_MAX_LENGTH}
                disabled={isSaving}
              />
              {formErrors.sku && (
                <p id={`${skuId}-error`} className="text-sm text-destructive">
                  {formErrors.sku}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={categoryId}>
                {UI_TEXT.LABEL_CATEGORY} <span className="text-destructive">*</span>
              </Label>
              <select
                id={categoryId}
                value={formData.categoryId}
                onChange={(e) => onFieldChange('categoryId', e.target.value)}
                className={selectClass}
                aria-invalid={Boolean(formErrors.categoryId)}
                aria-describedby={formErrors.categoryId ? `${categoryId}-error` : undefined}
                disabled={isSaving}
              >
                <option value="" className={optionClass}>{UI_TEXT.OPTION_SELECT_CATEGORY}</option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value} className={optionClass}>
                    {category.label}
                  </option>
                ))}
              </select>
              {formErrors.categoryId && (
                <p id={`${categoryId}-error`} className="text-sm text-destructive">
                  {formErrors.categoryId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={brandId}>
                {UI_TEXT.LABEL_BRAND} <span className="text-destructive">*</span>
              </Label>
              <select
                id={brandId}
                value={formData.brandId}
                onChange={(e) => onFieldChange('brandId', e.target.value)}
                className={selectClass}
                aria-invalid={Boolean(formErrors.brandId)}
                aria-describedby={formErrors.brandId ? `${brandId}-error` : undefined}
                disabled={isSaving}
              >
                <option value="" className={optionClass}>{UI_TEXT.OPTION_SELECT_BRAND}</option>
                {brandOptions.map((brand) => (
                  <option key={brand.value} value={brand.value} className={optionClass}>
                    {brand.label}
                  </option>
                ))}
              </select>
              {formErrors.brandId && (
                <p id={`${brandId}-error`} className="text-sm text-destructive">
                  {formErrors.brandId}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={costId}>
                {UI_TEXT.LABEL_COST_PRICE} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={costId}
                type="number"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => onFieldChange('costPrice', e.target.value)}
                placeholder="0.00"
                aria-invalid={Boolean(formErrors.costPrice)}
                aria-describedby={formErrors.costPrice ? `${costId}-error` : undefined}
                disabled={isSaving}
              />
              {formErrors.costPrice && (
                <p id={`${costId}-error`} className="text-sm text-destructive">
                  {formErrors.costPrice}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={priceId}>
                {UI_TEXT.LABEL_SELLING_PRICE} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={priceId}
                type="number"
                min="0"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => onFieldChange('sellingPrice', e.target.value)}
                placeholder="0.00"
                aria-invalid={Boolean(formErrors.sellingPrice)}
                aria-describedby={formErrors.sellingPrice ? `${priceId}-error` : undefined}
                disabled={isSaving}
              />
              {formErrors.sellingPrice && (
                <p id={`${priceId}-error`} className="text-sm text-destructive">
                  {formErrors.sellingPrice}
                </p>
              )}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={locationId}>
                {UI_TEXT.LABEL_LOCATION}
              </Label>
              <Input
                id={locationId}
                value={formData.location}
                onChange={(e) => onFieldChange('location', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_LOCATION}
                disabled={isSaving}
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={stockId}>
                {UI_TEXT.LABEL_STOCK} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={stockId}
                type="number"
                min="0"
                step="1"
                value={formData.currentStock}
                onChange={(e) => onFieldChange('currentStock', e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(formErrors.currentStock)}
                aria-describedby={formErrors.currentStock ? `${stockId}-error` : undefined}
                disabled={isSaving}
              />
              {formErrors.currentStock && (
                <p id={`${stockId}-error`} className="text-sm text-destructive">
                  {formErrors.currentStock}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={reorderId}>
                {UI_TEXT.LABEL_REORDER_POINT} <span className="text-destructive">*</span>
              </Label>
              <Input
                id={reorderId}
                type="number"
                min="0"
                step="1"
                value={formData.reorderPoint}
                onChange={(e) => onFieldChange('reorderPoint', e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(formErrors.reorderPoint)}
                aria-describedby={formErrors.reorderPoint ? `${reorderId}-error` : undefined}
                disabled={isSaving}
              />
              {formErrors.reorderPoint && (
                <p id={`${reorderId}-error`} className="text-sm text-destructive">
                  {formErrors.reorderPoint}
                </p>
              )}
            </div>
          </section>

          <section className="space-y-2">
            <Label htmlFor={descriptionId}>{UI_TEXT.LABEL_DESCRIPTION}</Label>
            <Textarea
              id={descriptionId}
              rows={4}
              placeholder={UI_TEXT.PLACEHOLDER_DESCRIPTION}
              value={formData.description}
              onChange={(e) => onFieldChange('description', e.target.value)}
              aria-invalid={Boolean(formErrors.description)}
              aria-describedby={formErrors.description ? `${descriptionId}-error` : undefined}
              maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
              disabled={isSaving}
            />
            {formErrors.description && (
              <p id={`${descriptionId}-error`} className="text-sm text-destructive">
                {formErrors.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH}
            </p>
          </section>

          <section>
            <ProductAttributesSection
              attributes={formData.attributes || []}
              onAttributesChange={onAttributesChange}
              disabled={isSaving}
            />
          </section>

          <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-2 sm:gap-0 mt-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Explicitly trigger Dialog's onOpenChange to ensure it closes
                handleOpenChange(false);
              }} 
              disabled={isSaving} 
              className="w-full sm:w-auto"
            >
              {UI_TEXT.BTN_CANCEL}
            </Button>
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              {isSaving ? UI_TEXT.BTN_SAVING : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

ProductFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    name: PropTypes.string,
    sku: PropTypes.string,
    categoryId: PropTypes.string,
    brandId: PropTypes.string,
    costPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sellingPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    location: PropTypes.string,
    currentStock: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    reorderPoint: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    attributes: PropTypes.array,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onAttributesChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  isSaving: PropTypes.bool,
  categoryOptions: PropTypes.array,
  brandOptions: PropTypes.array,
};

ProductFormDialog.defaultProps = {
  isEditing: false,
  isSaving: false,
  categoryOptions: [],
  brandOptions: [],
};

export default memo(ProductFormDialog);