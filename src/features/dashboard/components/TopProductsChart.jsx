import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { UI_TEXT } from '../utils';

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {payload[0].payload.name}
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          {payload[0].value} units sold
        </p>
      </div>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

// Custom label component to show values on bars
const CustomLabel = ({ x, y, width, value }) => {
  if (width < 40) return null; // Don't show label if bar is too small
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="#059669"
      textAnchor="middle"
      className="text-xs font-semibold dark:fill-green-400"
    >
      {value}
    </text>
  );
};

CustomLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  value: PropTypes.number,
};

const TopProductsChart = ({ data }) => {
  // Create gradient colors for bars with varying opacity
  const getBarColor = (index, total) => {
    const opacity = 0.7 + (index / total) * 0.3; // Vary opacity from 0.7 to 1.0
    return `rgba(16, 185, 129, ${opacity})`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {UI_TEXT.CHART_TOP_PRODUCTS}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical" // Horizontal bars for better readability
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            barCategoryGap="20%"
            barSize={30}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              horizontal={true}
              vertical={false}
            />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={80}
              tick={{ fill: 'currentColor', fontSize: 11 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="sales"
              name="Units Sold"
              radius={[0, 8, 8, 0]} // Rounded on right side for horizontal bars
              label={<CustomLabel />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(index, data.length)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

TopProductsChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TopProductsChart;
