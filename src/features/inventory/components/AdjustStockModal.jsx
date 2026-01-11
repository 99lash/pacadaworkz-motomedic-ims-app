import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/components/ui/dialog';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Label } from '../../../shared/components/ui/label';

const AdjustStockModal = ({ item, isOpen, onClose, onSave }) => {
  const [newStock, setNewStock] = useState(item?.currentStock || '');

  if (!item) {
    return null;
  }

  const handleSave = () => {
    onSave(item.id, parseInt(newStock, 10));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock for {item.product}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Current Stock: {item.currentStock}</p>
          <div className="space-y-2">
            <Label htmlFor="newStock">New Stock Quantity</Label>
            <Input
              id="newStock"
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              placeholder="Enter new stock quantity"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

AdjustStockModal.propTypes = {
  item: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AdjustStockModal;
