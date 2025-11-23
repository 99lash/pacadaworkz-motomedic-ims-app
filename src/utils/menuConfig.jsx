import {
  LayoutDashboard,
  Printer,
  Boxes,
  Package,
  ShoppingCart,
  Component,
  Tag,
  SlidersHorizontal,
  Building2,
  Users,
  Shield,
  BarChart,
  History,
  Settings,
} from 'lucide-react';
import { ROUTES } from './routes';
import { PERMISSIONS } from './permissions';

export const menuConfig = [
  {
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    text: 'Dashboard',
    permission: PERMISSIONS.DASHBOARD
  },
  {
    path: ROUTES.POS,
    icon: Printer,
    text: 'Point of Sale',
    permission: PERMISSIONS.POS
  },
  {
    path: ROUTES.INVENTORY,
    icon: Boxes,
    text: 'Inventory',
    permission: PERMISSIONS.INVENTORY
  },
  {
    path: ROUTES.PRODUCTS,
    icon: Package,
    text: 'Products',
    permission: PERMISSIONS.PRODUCTS
  },
  {
    path: ROUTES.PURCHASES,
    icon: ShoppingCart,
    text: 'Purchases',
    permission: PERMISSIONS.PURCHASES
  },
  {
    path: ROUTES.CATEGORIES,
    icon: Component,
    text: 'Categories',
    permission: PERMISSIONS.CATEGORIES
  },
  {
    path: ROUTES.BRANDS,
    icon: Tag,
    text: 'Brands',
    permission: PERMISSIONS.BRANDS
  },
  {
    path: ROUTES.ATTRIBUTES,
    icon: SlidersHorizontal,
    text: 'Attributes',
    permission: PERMISSIONS.ATTRIBUTES
  },
  {
    path: ROUTES.SUPPLIERS,
    icon: Building2,
    text: 'Suppliers',
    permission: PERMISSIONS.SUPPLIERS
  },
  {
    path: ROUTES.USERS,
    icon: Users,
    text: 'Users',
    permission: PERMISSIONS.USERS
  },
  {
    path: ROUTES.ROLES,
    icon: Shield,
    text: 'Roles',
    permission: PERMISSIONS.ROLES
  },
  {
    path: ROUTES.REPORTS,
    icon: BarChart,
    text: 'Reports',
    permission: PERMISSIONS.REPORTS
  },
  {
    path: ROUTES.ACTIVITY_LOGS,
    icon: History,
    text: 'Activity Logs',
    permission: PERMISSIONS.LOGS
  },
  {
    path: ROUTES.SETTINGS,
    icon: Settings,
    text: 'Settings',
    permission: PERMISSIONS.SETTINGS
  }
];