import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';

const RoleDeleteDialog = ({ role, isOpen, onClose, onConfirm }) => {
  if (!isOpen || !role) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-500/20 p-2 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Role</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-200">
          Are you sure you want to delete <span className="font-semibold">{role.name}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

RoleDeleteDialog.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

RoleDeleteDialog.defaultProps = {
  role: null,
};

export default RoleDeleteDialog;

