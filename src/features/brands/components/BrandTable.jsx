import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';

const BrandTable = ({ brands, onEdit, onDelete }) => {
  if (brands.length === 0) {
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
          {brands.map((brand) => (
            <TableRow
              key={brand.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
            >
              <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                {brand.name}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {brand.description || '-'}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(brand)}
                    className="h-9 w-9 p-0"
                    aria-label="Edit brand"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(brand)}
                    className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    aria-label="Delete brand"
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

BrandTable.propTypes = {
  brands: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default BrandTable;

