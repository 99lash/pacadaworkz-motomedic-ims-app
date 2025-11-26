import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

const BrandHeader = ({ onAddClick }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {UI_TEXT.PAGE_TITLE}
      </h1>
      <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
        {UI_TEXT.PAGE_SUBTITLE}
      </p>
    </div>

    <Button onClick={onAddClick} className="flex items-center gap-2 self-start sm:self-auto">
      <Tag className="h-4 w-4" aria-hidden="true" />
      <span>{UI_TEXT.BTN_ADD_BRAND}</span>
    </Button>
  </header>
);

BrandHeader.propTypes = {
  onAddClick: PropTypes.func.isRequired,
};

export default BrandHeader;

