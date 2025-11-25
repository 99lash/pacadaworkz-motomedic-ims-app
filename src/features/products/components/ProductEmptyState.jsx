import React from 'react';
import PropTypes from 'prop-types';
import { PackageSearch } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';
import { UI_TEXT } from '../utils';

const ProductEmptyState = ({ hasSearchTerm, onAddClick }) => (
  <div className="py-16 text-center flex flex-col items-center gap-4">
    <PackageSearch className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
    <div>
      <p className="text-lg font-medium text-foreground">
        {hasSearchTerm ? UI_TEXT.MSG_NO_RESULTS : UI_TEXT.MSG_EMPTY_STATE}
      </p>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">
        {hasSearchTerm ? UI_TEXT.MSG_TRY_DIFFERENT_SEARCH : UI_TEXT.MSG_EMPTY_STATE_HINT}
      </p>
    </div>
    <Button onClick={onAddClick} className="mt-2">
      {UI_TEXT.BTN_ADD_PRODUCT}
    </Button>
  </div>
);

ProductEmptyState.propTypes = {
  hasSearchTerm: PropTypes.bool,
  onAddClick: PropTypes.func.isRequired,
};

ProductEmptyState.defaultProps = {
  hasSearchTerm: false,
};

export default ProductEmptyState;

