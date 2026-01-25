/**
 * AttributeTable Component
 * 
 * Displays attributes in a table format with edit and delete actions.
 * Follows accessibility best practices.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * AttributeTable displays attributes in a table
 */
const AttributeTable = ({ attributes, onEdit, onDelete }) => {
  if (attributes.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.map((attribute) => (
            <TableRow
              key={attribute.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {attribute.name}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {attribute.name || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(attribute)}
                    className="h-9 w-9 p-0"
                    aria-label={`Edit ${attribute.name}`}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(attribute)}
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    aria-label={`Delete ${attribute.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

AttributeTable.propTypes = {
  /** Array of attributes to display */
  attributes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
  /** Callback when edit button is clicked */
  onEdit: PropTypes.func.isRequired,
  /** Callback when delete button is clicked */
  onDelete: PropTypes.func.isRequired,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(AttributeTable);

