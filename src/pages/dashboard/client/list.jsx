import { Helmet } from 'react-helmet-async';
import { ClientListView } from 'src/sections/client/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Client List | Runner</title>
      </Helmet>

      <ClientListView />
    </>
  );
}
