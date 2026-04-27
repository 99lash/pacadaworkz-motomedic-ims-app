/**
 * ProductAttributesSection Component
 * 
 * Section for managing product attributes in the product form.
 * Allows adding, editing, and deleting attributes.
 */

import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Plus, Tag, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import ProductAttributeRow from './ProductAttributeRow';
import { attributeService } from '../../attributes/services';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProductAttributesSection manages product attributes
 */
const ProductAttributesSection = ({
  attributes,
  onAttributesChange,
  disabled,
}) => {
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [editingAttributeId, setEditingAttributeId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAttribute, setNewAttribute] = useState({ attributeId: '', valueId: '', value: '' });

  // Load available attributes
  useEffect(() => {
    const loadAttributes = async () => {
      try {
        const attrs = await attributeService.fetchAttributes();
        if (Array.isArray(attrs)) {
          setAvailableAttributes(attrs);

          // Resolve missing attributeIds from names for existing attributes
          if (attributes.length > 0) {
            const updatedAttributes = attributes.map(attr => {
              if (!attr.attributeId && attr.attributeName) {
                const found = attrs.find(a => a.name === attr.attributeName);
                if (found) {
                  return { ...attr, attributeId: found.id.toString() };
                }
              }
              return attr;
            });
            
            // Check if any changed before calling update
            const hasChanges = updatedAttributes.some((attr, idx) => attr.attributeId !== attributes[idx].attributeId);
            if (hasChanges) {
              onAttributesChange(updatedAttributes);
            }
          }
        } else {
          setAvailableAttributes([]);
        }
      } catch (error) {
        console.error('Error loading attributes:', error);
        setAvailableAttributes([]);
      }
    };

    loadAttributes();
  }, [availableAttributes.length === 0, attributes.length]);

  // Get available attributes that haven't been used yet
  // When editing, include the currently selected attribute
  // Allow all attributes to be selected (removed duplicate restriction for better UX)
  const getAvailableAttributeOptions = useCallback(() => {
    // When editing, include the currently selected attribute
    if (editingAttributeId) {
      const editingAttr = attributes.find((a) => a.id === editingAttributeId);
      if (editingAttr) {
        return availableAttributes.filter((attr) => {
          // Include the one being edited, or any unused one
          const usedAttributeIds = new Set(
            attributes
              .filter((a) => a.attributeId && a.id !== editingAttributeId)
              .map((a) => a.attributeId)
          );
          return String(attr.id) === String(editingAttr.attributeId) || !usedAttributeIds.has(String(attr.id));
        });
      }
    }
    // For adding new, show all available attributes (allow duplicates)
    return availableAttributes;
  }, [attributes, availableAttributes, editingAttributeId]);

  const generateAttributeId = useCallback(() => {
    return `attr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }, []);

  const handleAddNew = useCallback(() => {
    setIsAddingNew(true);
    setNewAttribute({ attributeId: '', valueId: '', value: '' });
  }, []);

  const handleCancelAdd = useCallback(() => {
    setIsAddingNew(false);
    setNewAttribute({ attributeId: '', valueId: '', value: '' });
  }, []);

  const handleSaveNew = useCallback(() => {
    if (!newAttribute.attributeId || !newAttribute.valueId) {
      return;
    }

    const newAttr = {
      id: generateAttributeId(),
      attributeId: newAttribute.attributeId,
      valueId: newAttribute.valueId,
      value: newAttribute.value,
    };

    onAttributesChange([...attributes, newAttr]);
    // Keep the form open and reset for next attribute
    setNewAttribute({ attributeId: '', valueId: '', value: '' });
  }, [newAttribute, attributes, onAttributesChange, generateAttributeId]);

  const handleEdit = useCallback((attributeId) => {
    setEditingAttributeId(attributeId);
  }, []);

  const handleSave = useCallback(() => {
    setEditingAttributeId(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingAttributeId(null);
  }, []);

  const handleDelete = useCallback((attributeId) => {
    onAttributesChange(attributes.filter((attr) => attr.id !== attributeId));
  }, [attributes, onAttributesChange]);

  const handleAttributeChange = useCallback((attributeId, newAttributeId) => {
    onAttributesChange(
      attributes.map((attr) =>
        attr.id === attributeId ? { ...attr, attributeId: newAttributeId, valueId: '', value: '' } : attr
      )
    );
  }, [attributes, onAttributesChange]);

  const handleValueChange = useCallback((attributeId, newValueId, newValue) => {
    onAttributesChange(
      attributes.map((attr) =>
        attr.id === attributeId ? { ...attr, valueId: newValueId, value: newValue } : attr
      )
    );
  }, [attributes, onAttributesChange]);

  const availableOptions = getAvailableAttributeOptions();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Tag className="h-4 w-4" aria-hidden="true" />
            Product Attributes
          </CardTitle>
          {!isAddingNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddNew}
              disabled={disabled || availableAttributes.length === 0}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Attribute</span>
            </Button>
          )}
          {isAddingNew && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancelAdd}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              <span>Done Adding</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing Attributes */}
        {attributes.map((attribute) => (
          <ProductAttributeRow
            key={attribute.id}
            attribute={attribute}
            availableAttributes={availableAttributes}
            isEditing={editingAttributeId === attribute.id}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onAttributeChange={handleAttributeChange}
            onValueChange={handleValueChange}
          />
        ))}

        {/* Add New Attribute Row */}
        {isAddingNew && (
          <div className="space-y-2">
            <div className="space-y-3 p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              {/* Select Attribute Dropdown - At Top */}
              <select
                value={newAttribute.attributeId}
                onChange={(e) => setNewAttribute({ ...newAttribute, attributeId: e.target.value, valueId: '', value: '' })}
                onKeyDown={(e) => {
                  // Allow Enter key to save if both fields are filled
                  if (e.key === 'Enter' && newAttribute.attributeId && newAttribute.valueId) {
                    e.preventDefault();
                    handleSaveNew();
                  }
                }}
                className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select attribute</option>
                {availableOptions.map((attr) => (
                  <option key={attr.id} value={attr.id}>
                    {attr.name}
                  </option>
                ))}
              </select>
              
              {/* Value Select and Button - At Bottom */}
              <div className="flex items-center gap-2">
                <select
                  value={newAttribute.valueId}
                  onChange={(e) => {
                    const valId = e.target.value;
                    const valName = e.target.options[e.target.selectedIndex].text;
                    setNewAttribute({ ...newAttribute, valueId: valId, value: valId ? valName : '' });
                  }}
                  disabled={!newAttribute.attributeId}
                  className="flex h-10 flex-1 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select value</option>
                  {newAttribute.attributeId && 
                    availableAttributes
                      .find(attr => String(attr.id) === String(newAttribute.attributeId))
                      ?.attribute_values?.map(val => (
                        <option key={val.id} value={val.id}>
                          {val.value}
                        </option>
                      ))
                  }
                </select>
                
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveNew}
                  disabled={!newAttribute.attributeId || !newAttribute.valueId}
                  className="h-10"
                >
                  Add & Continue
                </Button>
              </div>
            </div>
            
          </div>
        )}

        {/* Empty State */}
        {attributes.length === 0 && !isAddingNew && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Tag className="h-8 w-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-sm">No attributes added yet</p>
            <p className="text-xs mt-1">Click "Add Attribute" to get started</p>
          </div>
        )}

        {/* No Available Attributes Message */}
        {availableAttributes.length === 0 && attributes.length === 0 && !isAddingNew && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No attributes available</p>
            <p className="text-xs mt-1">Create attributes in the Attributes page first</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ProductAttributesSection.propTypes = {
  /** Array of product attributes */
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      attributeId: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Callback when attributes change */
  onAttributesChange: PropTypes.func.isRequired,
  /** Whether the section is disabled */
  disabled: PropTypes.bool,
};

ProductAttributesSection.defaultProps = {
  disabled: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ProductAttributesSection);

