import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../shared/components/ui/dialog";
import { Badge } from "../../../shared/components/ui/badge";
import { Button } from "../../../shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui/table";

const PurchaseDetailsDialog = ({
  isOpen,
  onClose,
  purchaseOrder,
  getStatusBadge,
}) => {
  if (!purchaseOrder) return null;

  const statusBadge = getStatusBadge(purchaseOrder.status);

  const formatCurrency = (amount) => {
    return `₱${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Purchase Order Details
            </DialogTitle>
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
          </div>
          <DialogDescription>
            PO #{String(purchaseOrder.id).slice(0, 8)} - Created on{" "}
            {formatDate(purchaseOrder.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-thin">
          {/* Summary Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Supplier Information
                </h4>
                <p className="mt-1 text-base font-medium text-gray-900 dark:text-gray-100">
                  {purchaseOrder.supplierName}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expected Delivery
                </h4>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {formatDate(purchaseOrder.expectedDeliveryDate)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created By
                </h4>
                <p className="mt-1 text-base text-gray-900 dark:text-gray-100">
                  {purchaseOrder.userName || "System"}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Amount
                </h4>
                <p className="mt-1 text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(purchaseOrder.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {purchaseOrder.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </h4>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                {purchaseOrder.notes}
              </p>
            </div>
          )}

          {/* Items Table */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Ordered Items
            </h4>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Product
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 text-center">
                      Qty
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 text-right">
                      Unit Cost
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 text-right">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items &&
                    purchaseOrder.items.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                      >
                        <TableCell className="text-gray-900 dark:text-gray-100 font-medium">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center text-gray-900 dark:text-gray-100">
                          {item.quantityOrdered}
                        </TableCell>
                        <TableCell className="text-right text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.costPrice)}
                        </TableCell>
                        <TableCell className="text-right text-gray-900 dark:text-gray-100 font-medium">
                          {formatCurrency(item.totalCost)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <Button type="button" onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

PurchaseDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.object,
  getStatusBadge: PropTypes.func.isRequired,
};

export default PurchaseDetailsDialog;
