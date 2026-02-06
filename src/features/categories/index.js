/**
 * Categories Feature Module
 * 
 * This module exports everything needed for the categories feature.
 * Import from this index file for clean, organized imports.
 * 
 * @example
 * import { CategoriesPage, useCategories, categoryService } from './features/categories';
 */

// Main page component
export { default as CategoriesPage } from './CategoriesPage';

// Hooks
export * from './hooks';

// Services
export * from './services';

// Components (for reuse in other features)
export * from './components';

// Utilities
export * from './utils';

export { default as categoriesReducer } from './categoriesSlice';

