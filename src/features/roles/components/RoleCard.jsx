import React from 'react';
import PropTypes from 'prop-types';
import { Edit, Shield, Trash2 } from 'lucide-react';

const RoleCard = ({ role, onEdit, onDelete, userCount }) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-200" />
        </div>
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold">{role.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {userCount} {userCount === 1 ? 'user' : 'users'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(role)}
          className="p-2 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
          aria-label={`Edit ${role.name}`}
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(role)}
          className="p-2 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          aria-label={`Delete ${role.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {role.description && (
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{role.description}</p>
    )}

    <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">Permissions</p>
      <div className="flex flex-wrap gap-2">
        {role.permissions.slice(0, 3).map((perm) => (
          <span
            key={perm.module}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
          >
            {perm.module}
          </span>
        ))}
        {role.permissions.length > 3 && (
          <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded">
            +{role.permissions.length - 3} more
          </span>
        )}
      </div>
    </div>
  </div>
);

RoleCard.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(
      PropTypes.shape({
        module: PropTypes.string.isRequired,
        actions: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  userCount: PropTypes.number.isRequired,
};

export default RoleCard;

