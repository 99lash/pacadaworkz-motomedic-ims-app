import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../../shared/components/ui/button';
import { Badge } from '../../../shared/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shared/components/ui/table';
import { UI_TEXT } from '../utils';

const InventoryTable = ({
  inventory,
  getItemStockStatus,
  getStatusDisplayWithIcon,
  getItemStockPercentage,
  onAdjustStock,
}) => {
  if (inventory.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No inventory items found</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-900/50">
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_PRODUCT}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_CURRENT_STOCK}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_MIN_MAX}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_STOCK_LEVEL}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_LOCATION}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_STATUS}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_LAST_UPDATED}</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">{UI_TEXT.COLUMN_ACTIONS}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const status = getItemStockStatus(item);
            const statusDisplay = getStatusDisplayWithIcon(status);
            const stockPercentage = getItemStockPercentage(item);
            const StatusIcon = statusDisplay.Icon;

            return (
              <TableRow
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-900/50"
              >
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.product}</div>
                    <div className="text-sm text-muted-foreground">{item.sku}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {item.currentStock}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <div>Min: {item.minStock}</div>
                    <div>Max: {item.maxStock}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === 'out'
                            ? 'bg-red-500'
                            : status === 'critical'
                            ? 'bg-red-400'
                            : status === 'low'
                            ? 'bg-yellow-400'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.max(stockPercentage, 5)}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{stockPercentage}%</div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600 dark:text-gray-400">{item.location}</TableCell>
                <TableCell>
                  <Badge variant={statusDisplay.variant} className="flex items-center gap-1 w-fit">
                    <StatusIcon className="h-3 w-3" />
                    {statusDisplay.text}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => onAdjustStock(item)}>
                    {UI_TEXT.BTN_ADJUST_STOCK}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

InventoryTable.propTypes = {
  inventory: PropTypes.array.isRequired,
  getItemStockStatus: PropTypes.func.isRequired,
  getStatusDisplayWithIcon: PropTypes.func.isRequired,
  getItemStockPercentage: PropTypes.func.isRequired,
  onAdjustStock: PropTypes.func.isRequired,
};

export default InventoryTable;

