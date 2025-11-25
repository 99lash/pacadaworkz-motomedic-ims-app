import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../../shared/components/ui/card';

const ProductLoadingState = ({ rows = 5 }) => (
  <Card>
    <CardContent className="p-6">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={`product-skeleton-${index}`}
            className="h-12 w-full rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    </CardContent>
  </Card>
);

ProductLoadingState.propTypes = {
  rows: PropTypes.number,
};

export default ProductLoadingState;

