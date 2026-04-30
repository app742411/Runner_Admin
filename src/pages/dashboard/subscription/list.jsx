import { Helmet } from 'react-helmet-async';
import { SubscriptionListView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Subscription List | Runner</title>
      </Helmet>

      <SubscriptionListView />
    </>
  );
}
