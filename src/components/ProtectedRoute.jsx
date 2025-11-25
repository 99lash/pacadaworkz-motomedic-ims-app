import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasPermission } from '../utils/permissions';
import { ROUTES } from '../utils/routes';

const ProtectedRoute = ({ children, requirePermission }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requirePermission && !hasPermission(userRole, requirePermission)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;