import { Helmet } from 'react-helmet-async';
import { SubscriptionSelectView } from 'src/sections/subscription/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Select Subscription Plan | Runner</title>
      </Helmet>

      <SubscriptionSelectView />
    </>
  );
}
