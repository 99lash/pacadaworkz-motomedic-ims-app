import React from 'react';
import PropTypes from 'prop-types';
import { UI_TEXT } from '../utils';

const InventoryHeader = () => (
  <header>
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
      {UI_TEXT.PAGE_TITLE}
    </h1>
    <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">
      {UI_TEXT.PAGE_SUBTITLE}
    </p>
  </header>
);

InventoryHeader.propTypes = {};

export default InventoryHeader;

