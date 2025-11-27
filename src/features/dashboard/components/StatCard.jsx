import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '../../../shared/components/ui/card';

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, color, subtext, className = '' }) => (
  <Card className={`transition-all hover:shadow-md ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-start justify-between pt-5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1.5">
            {label}
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-muted-foreground dark:text-gray-500 mt-1.5">
              {subtext}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} flex-shrink-0 ml-5`} aria-hidden="true">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
  subtext: PropTypes.string,
  className: PropTypes.string,
};

export default StatCard;

