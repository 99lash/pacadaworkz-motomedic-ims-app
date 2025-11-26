import React from 'react';
import PropTypes from 'prop-types';
import { Check } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { UI_TEXT } from '../utils';

const PurchaseTable = ({ purchaseOrders, onMarkAsReceived, getStatusBadge }) => {
  if (purchaseOrders.length === 0) {
    return null; // Empty state handled by parent
  }

  const formatCurrency = (amount) => {
    return `₱${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="text-gray-700 dark:text-gray-300">PO #</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Supplier</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Date</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Expected Delivery</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 text-right">Total</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.map((po) => {
            const statusBadge = getStatusBadge(po.status);
            return (
              <TableRow
                key={po.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  #{po.id.slice(0, 8)}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {po.supplierName}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {formatDate(po.createdAt)}
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">
                  {formatDate(po.expectedDeliveryDate)}
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(po.total)}
                </TableCell>
                <TableCell>
                  <Badge className={statusBadge.className}>
                    {statusBadge.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {po.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkAsReceived(po)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                        aria-label="Mark as received"
                      >
                        <Check className="h-4 w-4" />
                        <span>{UI_TEXT.BTN_RECEIVE}</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

PurchaseTable.propTypes = {
  purchaseOrders: PropTypes.array.isRequired,
  onMarkAsReceived: PropTypes.func.isRequired,
  getStatusBadge: PropTypes.func.isRequired,
};

export default PurchaseTable;

