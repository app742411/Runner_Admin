import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestGuard = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestGuard;
