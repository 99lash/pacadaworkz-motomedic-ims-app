/**
 * CategoryLoadingState Component
 * 
 * Skeleton loading state for categories table.
 * Provides visual feedback during data loading.
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../../shared/components/ui/card';

// =============================================================================
// SKELETON ROW COMPONENT
// =============================================================================

const SkeletonRow = () => (
  <div className="flex items-center py-4 px-4 border-b last:border-b-0 animate-pulse">
    {/* Name skeleton */}
    <div className="flex-1">
      <div className="h-4 bg-muted rounded w-32" />
    </div>
    
    {/* Description skeleton */}
    <div className="flex-1 hidden md:block">
      <div className="h-4 bg-muted rounded w-48" />
    </div>
    
    {/* Count skeleton */}
    <div className="w-24 flex justify-center">
      <div className="h-6 bg-muted rounded-full w-10" />
    </div>
    
    {/* Actions skeleton */}
    <div className="w-24 flex justify-center gap-2">
      <div className="h-8 w-8 bg-muted rounded" />
      <div className="h-8 w-8 bg-muted rounded" />
    </div>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * CategoryLoadingState shows skeleton while loading
 */
const CategoryLoadingState = ({ rows }) => {
  return (
    <Card>
      <CardContent className="p-0">
        {/* Header skeleton */}
        <div className="flex items-center py-3 px-4 border-b bg-muted/50">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24" />
          </div>
          <div className="flex-1 hidden md:block">
            <div className="h-4 bg-muted rounded w-20" />
          </div>
          <div className="w-24 flex justify-center">
            <div className="h-4 bg-muted rounded w-16" />
          </div>
          <div className="w-24 flex justify-center">
            <div className="h-4 bg-muted rounded w-14" />
          </div>
        </div>
        
        {/* Row skeletons */}
        <div role="status" aria-label="Loading categories">
          {Array.from({ length: rows }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
          <span className="sr-only">Loading categories...</span>
        </div>
      </CardContent>
    </Card>
  );
};

// =============================================================================
// PROP TYPES
// =============================================================================

CategoryLoadingState.propTypes = {
  /** Number of skeleton rows to show */
  rows: PropTypes.number,
};

CategoryLoadingState.defaultProps = {
  rows: 5,
};

// =============================================================================
// EXPORT
// =============================================================================

export default memo(CategoryLoadingState);

