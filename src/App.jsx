import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useAuth } from './features/auth';
import { ProtectedRoute, MainLayout } from './shared/components';
import { ROUTES, routePermissions } from './shared/utils';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PointOfSale from './pages/PointOfSale';
import Inventory from './pages/Inventory';
import Products from './pages/Products';
import Purchases from './pages/Purchases';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Attributes from './pages/Attributes';
import Suppliers from './pages/Suppliers';
import Users from './pages/Users';
import Roles from './pages/Roles';
import Reports from './pages/Reports';
import ActivityLogs from './pages/ActivityLogs';
import Settings from './pages/Settings';

function App() {
  const { isAuthenticated, initializeAuth } = useAuth();
  const navigate = useNavigate();

  // Initialize auth state from storage on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle logout events from apiClient interceptor
  useEffect(() => {
    const handleLogout = () => {
      navigate(ROUTES.LOGIN || '/login');
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [navigate]); // ✅ This one is correct as it depends on navigate

  return (
    <>
      {/* Toast Notifications with Dark Mode Support */}
      <Toaster
        theme="system"
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgb(255 255 255 / 0.95)',
            color: '#181C14',
            border: '1px solid rgb(0 0 0 / 0.1)',
            backdropFilter: 'blur(8px)',
          },
        }}
        toastOptionsDark={{
          style: {
            background: 'rgb(47 51 47 / 0.95)',
            color: '#F5F5F5',
            border: '1px solid rgb(255 255 255 / 0.1)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />

      <Routes>
        {/* Public route - redirect if authenticated */}
        <Route
          path={ROUTES.LOGIN}
          element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <LoginPage />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
        <Route 
          index 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.DASHBOARD]}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="point-of-sale" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.POS]}>
              <PointOfSale />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="inventory" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.INVENTORY]}>
              <Inventory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="products" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.PRODUCTS]}>
              <Products />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="purchases" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.PURCHASES]}>
              <Purchases />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="categories" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.CATEGORIES]}>
              <Categories />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="brands" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.BRANDS]}>
              <Brands />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="attributes" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.ATTRIBUTES]}>
              <Attributes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="suppliers" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.SUPPLIERS]}>
              <Suppliers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="users" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.USERS]}>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="roles" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.ROLES]}>
              <Roles />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="reports" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.REPORTS]}>
              <Reports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="activity-logs" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.ACTIVITY_LOGS]}>
              <ActivityLogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute requirePermission={routePermissions[ROUTES.SETTINGS]}>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* 404 - Catch all */}
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
    </>
  );
}

export default App;
