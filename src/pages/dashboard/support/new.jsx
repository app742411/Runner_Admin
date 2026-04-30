import { Helmet } from 'react-helmet-async';
import { SupportNewView } from 'src/sections/support/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Create Support Ticket | Runner</title>
      </Helmet>

      <SupportNewView />
    </>
  );
}
