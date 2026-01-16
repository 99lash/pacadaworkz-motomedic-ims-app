/**
 * CategoryTable Component
 * 
 * Displays categories in a table format with edit and delete actions.
 * Follows accessibility best practices with proper ARIA attributes.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/components/ui/table';
import { UI_TEXT } from '../utils';
import CategoryDeleteDialog from './CategoryDeleteDialog';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CategoryTable displays a list of categories with actions
 */
const CategoryTable = ({
  categories,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead id="col-name">Category Name</TableHead>
          <TableHead id="col-description">Description</TableHead>

          <TableHead id="col-actions" className="text-center">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow 
            key={category.id}
            role="row"
            aria-label={`Category: ${category.name}`}
          >
            {/* Category Name */}
            <TableCell 
              headers="col-name"
              className="font-medium"
            >
              {category.name}
            </TableCell>
            
            {/* Description */}
            <TableCell 
              headers="col-description"
              className="text-muted-foreground max-w-md truncate"
            >
              {category.description || UI_TEXT.MSG_NO_DESCRIPTION}
            </TableCell>
            

            
            {/* Actions */}
            <TableCell headers="col-actions">
              <div 
                className="flex justify-center gap-2"
                role="group"
                aria-label={`Actions for ${category.name}`}
              >
                {/* Edit Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(category)}
                  aria-label={`Edit ${category.name}`}
                  title={`Edit ${category.name}`}
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </Button>
                
                {/* Delete Button with Confirmation */}
                <CategoryDeleteDialog
                  category={category}
                  onConfirm={() => onDelete(category.id)}
                  isDeleting={isDeleting}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryTable.propTypes = {
  /** Array of category objects to display */
  categories: PropTypes.arrayOf(
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
  
  /** Callback when delete is confirmed */
  onDelete: PropTypes.func.isRequired,
  
  /** Whether a delete operation is in progress */
  isDeleting: PropTypes.bool,
};

CategoryTable.defaultProps = {
  isDeleting: false,
};

// =============================================================================
// EXPORT (Memoized for performance)
// =============================================================================

export default memo(CategoryTable);

