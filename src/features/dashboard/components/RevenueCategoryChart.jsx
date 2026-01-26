import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMobileMenu } from "../../../shared/hooks";
import { UI_TEXT, CHART_COLORS } from "../utils";
import { formatCurrency } from "../utils";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {payload[0].name}
        </p>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {formatCurrency(payload[0].value)}
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

const RevenueCategoryChart = ({ data }) => {
  const { isMobile } = useMobileMenu();

  if (!data || data.length === 0) {
    return null;
  }
  // console.log("Revenue By Category Data: ", data);

  const chartHeight = isMobile ? 400 : 350;
  const outerRadius = isMobile ? 60 : 80;
  const cyValue = isMobile ? "35%" : "45%";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {UI_TEXT.CHART_REVENUE_CATEGORY}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy={cyValue}
              labelLine={false}
              label={({ name, percent, value }) =>
                value > 0 ? `${name} (${(percent * 100).toFixed(0)}%)` : null
              }
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

RevenueCategoryChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default RevenueCategoryChart;
