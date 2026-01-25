import React from 'react';
import PropTypes from 'prop-types';
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

const SupplierFormDialog = ({
  isOpen,
  isEditing,
  isSaving,
  formData,
  formErrors,
  onClose,
  onSubmit,
  onFieldChange,
}) => {
  const title = isEditing ? UI_TEXT.FORM_TITLE_EDIT : UI_TEXT.FORM_TITLE_CREATE;
  const submitText = isEditing ? 'Update' : 'Create';

  const handleOpenChange = (open) => {
    if (!open && !isSaving) {
      onClose();
    }
  };

  const handleInteractOutside = (event) => {
    if (isSaving) {
      event.preventDefault();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onInteractOutside={handleInteractOutside}
      >
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">{title}</DialogTitle>
          <DialogDescription className="mt-1.5 text-gray-600 dark:text-gray-400">
            Add supplier information to manage your vendors and partners.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 px-2 space-y-6 scrollbar-thin">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_COMPANY_NAME} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => onFieldChange('companyName', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_COMPANY_NAME}
                  aria-invalid={Boolean(formErrors.companyName)}
                  className={formErrors.companyName ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {formErrors.companyName && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.companyName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPerson" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_CONTACT_PERSON}
                </Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => onFieldChange('contactPerson', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_CONTACT_PERSON}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_PHONE}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onFieldChange('phone', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_PHONE}
                  disabled={isSaving}
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                  {UI_TEXT.LABEL_EMAIL}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFieldChange('email', e.target.value)}
                  placeholder={UI_TEXT.PLACEHOLDER_EMAIL}
                  aria-invalid={Boolean(formErrors.email)}
                  className={formErrors.email ? 'border-destructive' : ''}
                  disabled={isSaving}
                />
                {formErrors.email && (
                  <p className="text-sm text-destructive mt-1.5" role="alert">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_ADDRESS}
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onFieldChange('address', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_ADDRESS}
                disabled={isSaving}
              />
            </div>

            <div>
              <Label htmlFor="paymentTerms" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
                {UI_TEXT.LABEL_PAYMENT_TERMS}
              </Label>
              <Input
                id="paymentTerms"
                value={formData.paymentTerms}
                onChange={(e) => onFieldChange('paymentTerms', e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_PAYMENT_TERMS}
                disabled={isSaving}
              />
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
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

SupplierFormDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    companyName: PropTypes.string.isRequired,
    contactPerson: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    paymentTerms: PropTypes.string,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default SupplierFormDialog;

