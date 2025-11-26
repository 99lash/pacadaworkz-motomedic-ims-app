import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';

const UserStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Total Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Active Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Admins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.admins}</div>
      </CardContent>
    </Card>
  </div>
);

UserStatsCards.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
    admins: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserStatsCards;

