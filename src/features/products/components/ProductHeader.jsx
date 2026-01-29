import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { Plus, FileDown, FileUp, Home, Boxes, Package } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../../shared/components/ui/breadcrumb';
import { UI_TEXT } from '../utils';

/**
 * Hero header for the products module.
 * Shows breadcrumb trail, page metadata, and key actions.
 */
const ProductHeader = ({ 
  onAddClick, 
  onExportClick, 
  onImportClick,
  isExportDisabled, 
  isImportDisabled,
  totalProducts 
}) => {
  const fileInputRef = useRef(null);

  const handleImportButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportClick(file);
      // Reset input so the same file can be selected again if needed
      event.target.value = '';
    }
  };

  return (
    <header className="space-y-4">
      <nav aria-label="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>{UI_TEXT.BREADCRUMB_DASHBOARD}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/inventory" className="flex items-center gap-2">
                <Boxes className="h-4 w-4" aria-hidden="true" />
                <span>{UI_TEXT.BREADCRUMB_INVENTORY}</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Package className="h-4 w-4" aria-hidden="true" />
                <span>{UI_TEXT.BREADCRUMB_PRODUCTS}</span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            aria-hidden="true"
          />
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleImportButtonClick}
            disabled={isImportDisabled}
          >
            <FileUp className="h-4 w-4" aria-hidden="true" />
            <span>{UI_TEXT.BTN_IMPORT}</span>
          </Button>

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
};

ProductHeader.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired,
  onImportClick: PropTypes.func.isRequired,
  isExportDisabled: PropTypes.bool,
  isImportDisabled: PropTypes.bool,
  totalProducts: PropTypes.number,
};

ProductHeader.defaultProps = {
  isExportDisabled: false,
  isImportDisabled: false,
  totalProducts: undefined,
};

export default memo(ProductHeader);

