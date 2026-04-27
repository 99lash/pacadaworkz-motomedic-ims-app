import React from 'react';
import PropTypes from 'prop-types';
import RoleCard from './RoleCard';
import RoleEmptyState from './RoleEmptyState';

const RoleGrid = ({ roles, onEdit, onDelete, getUserCount, onAddClick }) => {
  if (roles.length === 0) {
    return <RoleEmptyState onAddClick={onAddClick} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role, index) => (
        <RoleCard
          key={role.id || `role-${role.role || role.name}-${index}`}
          role={role}
          onEdit={onEdit}
          onDelete={onDelete}
          getUserCount={getUserCount}
        />
      ))}
    </div>
  );
};

RoleGrid.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getUserCount: PropTypes.func.isRequired,
  onAddClick: PropTypes.func.isRequired,
};

export default RoleGrid;
