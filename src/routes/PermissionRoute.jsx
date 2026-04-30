import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PermissionRoute = ({ permission, permissions: requiredPermissions, children }) => {
  const { isAuthenticated, permissions } = useSelector((state) => state.auth);

  // ⏳ Auth not ready yet
  if (isAuthenticated === undefined) {
    return null; // or loader
  }

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userPermissions = permissions || [];

  // Support single OR multiple permissions
  const hasPermission = permission
    ? userPermissions.includes(permission)
    : requiredPermissions?.some((p) => userPermissions.includes(p));

  if (!hasPermission) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PermissionRoute;
