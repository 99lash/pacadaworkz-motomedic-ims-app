import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../shared/components/ui/input';
import { UI_TEXT } from '../utils';

/**
 * Toolbar with search + dropdown filters.
 */
const controlClass =
  'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring';

const ProductFilters = ({
  searchValue,
  onSearchChange,
  categoryOptions,
  selectedCategory,
  onCategoryChange,
  brandOptions,
  selectedBrand,
  onBrandChange,
  statusOptions,
  selectedStatus,
  onStatusChange,
}) => (
  <section className="bg-white border border-border rounded-lg shadow-sm p-4 space-y-5">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Filter className="h-4 w-4" aria-hidden="true" />
      <span>{UI_TEXT.FILTER_TITLE}</span>
    </div>

    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="w-full lg:max-w-md">
        <label htmlFor="product-search" className="text-sm font-medium text-muted-foreground">
          {UI_TEXT.FILTER_SEARCH_ARIA}
        </label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="product-search"
            type="search"
            placeholder={UI_TEXT.PLACEHOLDER_SEARCH}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap">
        <div className="flex flex-1 min-w-[160px] flex-col gap-1.5">
          <label htmlFor="product-category-filter" className="text-sm font-medium text-muted-foreground">
            {UI_TEXT.LABEL_CATEGORY}
          </label>
          <select
            id="product-category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={controlClass}
          >
            <option value="all">{UI_TEXT.OPTION_ALL_CATEGORIES}</option>
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 min-w-[160px] flex-col gap-1.5">
          <label htmlFor="product-brand-filter" className="text-sm font-medium text-muted-foreground">
            {UI_TEXT.LABEL_BRAND}
          </label>
          <select
            id="product-brand-filter"
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className={controlClass}
          >
            <option value="all">{UI_TEXT.OPTION_ALL_BRANDS}</option>
            {brandOptions.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 min-w-[160px] flex-col gap-1.5">
          <label htmlFor="product-status-filter" className="text-sm font-medium text-muted-foreground">
            {UI_TEXT.LABEL_STATUS}
          </label>
          <select
            id="product-status-filter"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className={controlClass}
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </section>
);

ProductFilters.propTypes = {
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  categoryOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  brandOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  selectedBrand: PropTypes.string.isRequired,
  onBrandChange: PropTypes.func.isRequired,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

ProductFilters.defaultProps = {
  categoryOptions: [],
  brandOptions: [],
  statusOptions: [],
};

export default memo(ProductFilters);

