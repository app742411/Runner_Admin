import { Helmet } from 'react-helmet-async';
import { SupportListView } from 'src/sections/support/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Support List | Runner</title>
      </Helmet>

      <SupportListView />
    </>
  );
}
