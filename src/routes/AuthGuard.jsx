import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

const AuthGuard = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.jwt.signIn} replace />;
  }

  return children;
};

export default AuthGuard;
