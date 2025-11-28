import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../../shared/components/ui/card';

const ReportSummaryCard = ({ label, value, className = '' }) => (
  <Card className={className}>
    <CardContent className="p-6">
      <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1.5">
        {label}
      </p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</h3>
    </CardContent>
  </Card>
);

ReportSummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

export default ReportSummaryCard;

