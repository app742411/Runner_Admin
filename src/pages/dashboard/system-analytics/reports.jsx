import { Helmet } from 'react-helmet-async';
import { SystemReportsView } from 'src/sections/system-analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>System Reports | Runner Dashboard</title>
      </Helmet>

      <SystemReportsView />
    </>
  );
}
