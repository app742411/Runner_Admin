import { Helmet } from 'react-helmet-async';
import { SubscriptionCheckoutView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Subscription Checkout | Runner</title>
      </Helmet>

      <SubscriptionCheckoutView />
    </>
  );
}
