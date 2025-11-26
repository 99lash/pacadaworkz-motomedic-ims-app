import React from 'react';
import PropTypes from 'prop-types';
import { Shield } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

const RoleEmptyState = ({ onAddClick }) => (
  <div className="col-span-full text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
    <Shield className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
    <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">{UI_TEXT.EMPTY_TITLE}</p>
    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{UI_TEXT.EMPTY_DESCRIPTION}</p>
    <Button variant="outline" onClick={onAddClick}>
      {UI_TEXT.EMPTY_ACTION}
    </Button>
  </div>
);

RoleEmptyState.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};

export default RoleEmptyState;

