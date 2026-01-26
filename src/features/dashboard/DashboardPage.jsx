import React from 'react';
import PropTypes from 'prop-types';
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  XCircle,
  ShoppingCart,
  Users as UsersIcon,
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDashboard } from './hooks';
import {
  DashboardHeader,
  StatCard,
  SalesTrendChart,
  TopProductsChart,
  RevenueCategoryChart,
  InventoryOverview,
  ActivityList,
} from './components';
import { UI_TEXT, STAT_COLORS, formatCurrency } from './utils';

const DashboardPage = () => {
  const { user, userRole } = useAuth();
  const {
    stats,
    topProducts,
    revenueByCategory,
    salesTrend,
    inventoryOverview,
    recentActivities,
    isLoading,
    isAdminOrSuper,
  } = useDashboard(user, userRole);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // console.log(recentActivities);

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />

      {/* KPI Cards - Primary Metrics */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label={UI_TEXT.STAT_TOTAL_PRODUCTS}
            value={stats.totalProducts}
            color={STAT_COLORS.PRIMARY}
          />
          <StatCard
            icon={DollarSign}
            label={UI_TEXT.STAT_TOTAL_REVENUE}
            value={formatCurrency(stats.totalRevenue)}
            color={STAT_COLORS.SUCCESS}
          />
          <StatCard
            icon={ShoppingCart}
            label={UI_TEXT.STAT_TOTAL_TRANSACTIONS}
            value={stats.totalTransactions}
            color={STAT_COLORS.INFO}
          />
          <StatCard
            icon={TrendingUp}
            label={UI_TEXT.STAT_TOTAL_SALES}
            value={`${stats.totalSales} ${UI_TEXT.SUBTEXT_SALES_ITEMS}`}
            color={STAT_COLORS.INDIGO}
          />
          
        </div>
      </section>

      {/* Alert Cards - Secondary Metrics */}
      <section aria-label="Stock Alerts">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={AlertTriangle}
            label={UI_TEXT.STAT_LOW_STOCK}
            value={stats.lowStockCount}
            color={STAT_COLORS.WARNING}
            subtext={UI_TEXT.SUBTEXT_LOW_STOCK}
          />
          <StatCard
            icon={XCircle}
            label={UI_TEXT.STAT_OUT_OF_STOCK}
            value={stats.outOfStockCount}
            color={STAT_COLORS.DANGER}
            subtext={UI_TEXT.SUBTEXT_OUT_OF_STOCK}
          />
          {isAdminOrSuper && (
            <StatCard
              icon={UsersIcon}
              label={UI_TEXT.STAT_ACTIVE_USERS}
              value={stats.activeUsers}
              color={STAT_COLORS.TEAL}
              subtext={UI_TEXT.SUBTEXT_ACTIVE_USERS}
            />
          )}
        </div>
      </section>

      {/* Charts Row - Sales Analytics */}
      <section aria-label="Sales Analytics">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesTrendChart data={salesTrend} />
          <TopProductsChart data={topProducts} />
        </div>
      </section>

      {/* Revenue & Inventory - Business Insights */}
      <section aria-label="Business Insights">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueCategoryChart data={revenueByCategory} />
          <InventoryOverview data={inventoryOverview} />
        </div>
      </section>

      {/* Recent Activities */}
      <section aria-label="Recent Activities">
        <ActivityList activities={recentActivities} />
      </section>
    </div>
  );
};

export default DashboardPage;

