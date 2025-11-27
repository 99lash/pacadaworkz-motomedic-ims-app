import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Activity } from 'lucide-react';
import { UI_TEXT, formatActivityDate } from '../utils';

const ActivityList = ({ activities }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {UI_TEXT.ACTIVITY_TITLE}
        </CardTitle>
        <Activity className="w-5 h-5 text-muted-foreground dark:text-gray-400" aria-hidden="true" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground dark:text-gray-400 text-center py-8">
            {UI_TEXT.ACTIVITY_EMPTY}
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id || activity.timestamp}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <div
                className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.details}
                </p>
                <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                  {activity.userName} • {activity.module} • {formatActivityDate(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

ActivityList.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default ActivityList;

