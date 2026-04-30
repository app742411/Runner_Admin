import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function SubscriptionGuard({ children }) {
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  const isCompanyAdmin = user?.role === 'company_admin';
  const isSubscriptionRestricted = user?.subscriptionStatus === 'pending' || user?.subscriptionStatus === 'expired';

  // If company admin has restricted subscription, force them to the select-plan page
  if (isCompanyAdmin && isSubscriptionRestricted) {
    if (pathname !== paths.dashboard.subscription.select && pathname !== paths.dashboard.subscription.checkout) {
      return <Navigate to={paths.dashboard.subscription.select} replace />;
    }
  }

  return children;
}
