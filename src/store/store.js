import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '../features/auth';
import { activityLogsReducer } from '../features/activity-logs';
import { attributesReducer } from '../features/attributes';
import { brandsReducer } from '../features/brands';
import { categoriesReducer } from '../features/categories';
import { dashboardReducer } from '../features/dashboard';
import { inventoryReducer } from '../features/inventory';
import { posReducer } from '../features/pos';
import { productsReducer } from '../features/products';
import { purchasesReducer } from '../features/purchases';
import { reportsReducer } from '../features/reports';
import { rolesReducer } from '../features/roles';
import { settingsReducer } from '../features/settings';
import { suppliersReducer } from '../features/suppliers';
import { usersReducer } from '../features/users';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    activityLogs: activityLogsReducer,
    attributes: attributesReducer,
    brands: brandsReducer,
    categories: categoriesReducer,
    dashboard: dashboardReducer,
    inventory: inventoryReducer,
    pos: posReducer,
    products: productsReducer,
    purchases: purchasesReducer,
    reports: reportsReducer,
    roles: rolesReducer,
    settings: settingsReducer,
    suppliers: suppliersReducer,
    users: usersReducer,
  },
});
