import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../shared/components/ui/button';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Page {page} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-2">Previous</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          <span className="mr-2">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    hasPrevPage: PropTypes.bool.isRequired,
    hasNextPage: PropTypes.bool.isRequired,
  }),
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
