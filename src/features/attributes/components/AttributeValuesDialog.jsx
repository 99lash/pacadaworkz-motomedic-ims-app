/**
 * AttributeValuesDialog Component
 * 
 * Dialog for managing values of a specific attribute.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Plus, Edit, Trash2, X, Check, Loader2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../shared/components/ui/dialog';
import { Label } from '../../../shared/components/ui/label';
import { UI_TEXT } from '../utils';

const AttributeValuesDialog = ({
  isOpen,
  attribute,
  valueInput,
  setValueInput,
  editingValueId,
  isLoading,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}) => {
  const handleOpenChange = (open) => {
    if (!open) onClose();
  };

  if (!attribute) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{UI_TEXT.VALUES_TITLE}</DialogTitle>
          <DialogDescription>
            {UI_TEXT.VALUES_DESCRIPTION} <span className="font-semibold">{attribute.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Add/Edit Value Form */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
            <Label htmlFor="value-input" className="text-sm font-medium">
              {editingValueId ? 'Edit Value' : UI_TEXT.LABEL_VALUE}
            </Label>
            <div className="flex gap-2">
              <Input
                id="value-input"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                placeholder={UI_TEXT.PLACEHOLDER_VALUE}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              />
              <Button 
                onClick={onSubmit} 
                disabled={!valueInput.trim() || isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingValueId ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
              {editingValueId && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setValueInput('');
                    onEdit({ id: null, value: '' }); // Reset editing state
                  }}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Values List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium px-1">Existing Values</h4>
            <div className="border rounded-md divide-y overflow-hidden bg-background">
              {attribute.attribute_values && attribute.attribute_values.length > 0 ? (
                attribute.attribute_values.map((val) => (
                  <div 
                    key={val.id} 
                    className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-sm">{val.value}</span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(val)}
                        className="h-8 w-8 p-0"
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(val.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No values added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

AttributeValuesDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  attribute: PropTypes.object,
  valueInput: PropTypes.string.isRequired,
  setValueInput: PropTypes.func.isRequired,
  editingValueId: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default memo(AttributeValuesDialog);
