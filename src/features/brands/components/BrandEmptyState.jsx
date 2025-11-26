import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

const BrandEmptyState = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <Tag className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
      {UI_TEXT.EMPTY_TITLE}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-sm">
      {UI_TEXT.EMPTY_DESCRIPTION}
    </p>
    <Button onClick={onAddClick} className="flex items-center gap-2">
      <Tag className="h-4 w-4" />
      <span>{UI_TEXT.EMPTY_ACTION}</span>
    </Button>
  </div>
);

BrandEmptyState.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};

export default BrandEmptyState;

