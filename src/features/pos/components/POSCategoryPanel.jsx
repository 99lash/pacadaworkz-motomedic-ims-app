import React from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { Badge } from "../../../shared/components/ui/badge";

const POSCategoryPanel = ({
  categories,
  categoryCounts,
  totalProductsCount,
  selectedCategoryIds,
  onToggleCategory,
  onClearCategories,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
      {/* All Items Button */}
      <button
        onClick={onClearCategories}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
          selectedCategoryIds.length === 0
            ? "border-primary bg-primary/10 text-primary shadow-sm"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50"
        }`}
      >
        <span className="font-medium">All</span>
        <Badge
          className={`px-2 py-0.5 rounded-md ${
            selectedCategoryIds.length === 0
              ? "bg-primary text-primary-foreground"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-none"
          }`}
        >
          {totalProductsCount}
        </Badge>
      </button>

      {/* Category Buttons */}
      {categories.map((category) => {
        const categoryIdStr = category.id?.toString();
        const isSelected = selectedCategoryIds.includes(categoryIdStr);
        const count = categoryCounts[categoryIdStr] || 0;

        return (
          <button
            key={category.id}
            onClick={() => onToggleCategory(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap shrink-0 ${
              isSelected
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary/50"
            }`}
          >
            <span className="font-medium">{category.name}</span>
            <Badge
              className={`px-2 py-0.5 rounded-md ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-none"
              }`}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
};

POSCategoryPanel.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  categoryCounts: PropTypes.object.isRequired,
  totalProductsCount: PropTypes.number.isRequired,
  selectedCategoryIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleCategory: PropTypes.func.isRequired,
  onClearCategories: PropTypes.func.isRequired,
};

export default POSCategoryPanel;
