import { Helmet } from 'react-helmet-async';
import { SubscriptionCreateView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Add New Subscription | Runner</title>
      </Helmet>

      <SubscriptionCreateView />
    </>
  );
}
