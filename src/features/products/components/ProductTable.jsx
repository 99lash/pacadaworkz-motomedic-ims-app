import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Edit } from 'lucide-react';
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
import ProductDeleteDialog from './ProductDeleteDialog';
import { formatCurrency, formatDate, getStockStatusMeta } from '../utils';

const ProductTable = ({ products, onEdit, onDelete, isDeleting }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead id="col-product">Product</TableHead>
        <TableHead id="col-category">Category</TableHead>
        <TableHead id="col-brand">Brand</TableHead>
        <TableHead id="col-cost" className="text-right">
          Cost Price
        </TableHead>
        <TableHead id="col-price" className="text-right">
          Selling Price
        </TableHead>
        <TableHead id="col-stock" className="text-right">
          Reorder Point
        </TableHead>
        <TableHead id="col-status" className="text-center">
          Stock Status
        </TableHead>
        <TableHead id="col-updated" className="text-center">
          Updated
        </TableHead>
        <TableHead id="col-actions" className="text-center">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.map((product) => {
        const stockStatus = getStockStatusMeta(product);

        return (
          <TableRow key={product.id}>
            <TableCell headers="col-product">
              <p className="font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{product.sku}</p>
              {product.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {product.description}
                </p>
              )}
            </TableCell>
            <TableCell headers="col-category">{product.categoryName}</TableCell>
            <TableCell headers="col-brand">{product.brandName}</TableCell>
            <TableCell headers="col-cost" className="text-right">
              {formatCurrency(product.costPrice)}
            </TableCell>
            <TableCell headers="col-price" className="text-right">
              {formatCurrency(product.sellingPrice)}
            </TableCell>
            <TableCell headers="col-stock" className="text-right">
              <span className="font-semibold">{product.reorderPoint}</span>
              <span className="block text-xs text-muted-foreground">
                
              </span>            </TableCell>
            <TableCell headers="col-status" className="text-center">
              <Badge variant="outline" className={stockStatus.className}>
                {stockStatus.label}
              </Badge>
            </TableCell>
            <TableCell headers="col-updated" className="text-center text-sm text-muted-foreground">
              {formatDate(product.updatedAt)}
            </TableCell>
            <TableCell headers="col-actions">
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(product)}
                  aria-label={`Edit ${product.name}`}
                >
                  <Edit className="h-4 w-4" aria-hidden="true" />
                </Button>
                <ProductDeleteDialog
                  product={product}
                  onConfirm={() => onDelete(product.id)}
                  isDeleting={isDeleting}
                />
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);

ProductTable.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sku: PropTypes.string.isRequired,
      categoryName: PropTypes.string.isRequired,
      brandName: PropTypes.string.isRequired,
      costPrice: PropTypes.number.isRequired,
      sellingPrice: PropTypes.number.isRequired,
      currentStock: PropTypes.number.isRequired,
      reorderPoint: PropTypes.number.isRequired,
      updatedAt: PropTypes.string.isRequired,
      description: PropTypes.string,
      stockStatus: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
};

ProductTable.defaultProps = {
  isDeleting: false,
};

export default memo(ProductTable);

