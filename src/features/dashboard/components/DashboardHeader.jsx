import React from 'react';
import PropTypes from 'prop-types';
import { Plus } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

const DashboardHeader = ({ isAdminOrSuper, onNewProductClick }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {UI_TEXT.PAGE_TITLE}
      </h1>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
        {UI_TEXT.PAGE_SUBTITLE}
      </p>
    </div>

    {isAdminOrSuper && (
      <Button onClick={onNewProductClick} className="flex items-center gap-2 self-start sm:self-auto">
        <Plus className="h-4 w-4" aria-hidden="true" />
        <span>{UI_TEXT.BTN_NEW_PRODUCT}</span>
      </Button>
    )}
  </header>
);

DashboardHeader.propTypes = {
  isAdminOrSuper: PropTypes.bool.isRequired,
  onNewProductClick: PropTypes.func,
};

DashboardHeader.defaultProps = {
  onNewProductClick: () => {},
};

export default DashboardHeader;

