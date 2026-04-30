import { Helmet } from 'react-helmet-async';
import { PropertyListView } from 'src/sections/property/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Property List | Runner</title>
      </Helmet>

      <PropertyListView />
    </>
  );
}
