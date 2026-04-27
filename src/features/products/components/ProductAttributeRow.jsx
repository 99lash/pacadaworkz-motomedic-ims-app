/**
 * ProductAttributeRow Component
 * 
 * Individual row for displaying and editing a product attribute.
 * Shows attribute name and value with edit/delete actions.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ProductAttributeRow displays a single attribute row
 */
const ProductAttributeRow = ({
  attribute,
  availableAttributes,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAttributeChange,
  onValueChange,
}) => {
  if (isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50">
        <select
          value={attribute.attributeId || ''}
          onChange={(e) => onAttributeChange(attribute.id, e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select attribute</option>
          {availableAttributes.map((attr) => (
            <option key={attr.id} value={attr.id}>
              {attr.name}
            </option>
          ))}
        </select>
        
        <select
          value={attribute.valueId || ''}
          onChange={(e) => {
            const valId = e.target.value;
            const valName = e.target.options[e.target.selectedIndex].text;
            onValueChange(attribute.id, valId, valId ? valName : '');
          }}
          disabled={!attribute.attributeId}
          className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select value</option>
          {attribute.attributeId && 
            availableAttributes
              .find(attr => String(attr.id) === String(attribute.attributeId))
              ?.attribute_values?.map(val => (
                <option key={val.id} value={val.id}>
                  {val.value}
                </option>
              ))
          }
        </select>
        
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => onSave(attribute.id)}
            disabled={!attribute.attributeId || !attribute.valueId}
            className="h-9"
          >
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onCancel(attribute.id)}
            className="h-9 w-9 p-0"
            aria-label="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const attributeName = availableAttributes.find((attr) => String(attr.id) === String(attribute.attributeId))?.name || 'Unknown';

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100">{attributeName}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{attribute.value || '-'}</div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(attribute.id)}
          className="h-9 w-9 p-0"
          aria-label={`Edit ${attributeName}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(attribute.id)}
          className="h-9 w-9 p-0 text-destructive hover:text-destructive"
          aria-label={`Delete ${attributeName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

ProductAttributeRow.propTypes = {
  /** Attribute object with id, attributeId, and value */
  attribute: PropTypes.shape({
    id: PropTypes.string.isRequired,
    attributeId: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  /** Available attributes to choose from */
  availableAttributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** Whether this row is in edit mode */
  isEditing: PropTypes.bool,
  /** Callback when edit button is clicked */
  onEdit: PropTypes.func.isRequired,
  /** Callback when save button is clicked */
  onSave: PropTypes.func.isRequired,
  /** Callback when cancel button is clicked */
  onCancel: PropTypes.func.isRequired,
  /** Callback when delete button is clicked */
  onDelete: PropTypes.func.isRequired,
  /** Callback when attribute selection changes */
  onAttributeChange: PropTypes.func.isRequired,
  /** Callback when value changes */
  onValueChange: PropTypes.func.isRequired,
};

ProductAttributeRow.defaultProps = {
  isEditing: false,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(ProductAttributeRow);

