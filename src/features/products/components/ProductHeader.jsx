import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Plus, FileDown } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

/**
 * Hero header for the products module.
 * Shows page metadata, and key actions.
 */
const ProductHeader = ({ onAddClick, onExportClick, isExportDisabled, totalProducts }) => (
  <header className="space-y-4">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{UI_TEXT.PAGE_TITLE}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{UI_TEXT.PAGE_SUBTITLE}</p>
        {typeof totalProducts === 'number' && (
          <p className="text-xs text-muted-foreground mt-2">
            {totalProducts} {totalProducts === 1 ? 'product' : 'products'} tracked
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={onExportClick}
          disabled={isExportDisabled}
        >
          <FileDown className="h-4 w-4" aria-hidden="true" />
          <span>{UI_TEXT.BTN_EXPORT}</span>
        </Button>

        <Button type="button" className="flex items-center gap-2" onClick={onAddClick}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>{UI_TEXT.BTN_ADD_PRODUCT}</span>
        </Button>
      </div>
    </div>
  </header>
);

ProductHeader.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  isExportDisabled: PropTypes.bool,
  totalProducts: PropTypes.number,
};

ProductHeader.defaultProps = {
  isExportDisabled: false,
  totalProducts: undefined,
};

export default memo(ProductHeader);

