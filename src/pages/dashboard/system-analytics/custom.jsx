import { Helmet } from 'react-helmet-async';
import { CustomReportsView } from 'src/sections/system-analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Custom Reports Builder | Runner Dashboard</title>
      </Helmet>

      <CustomReportsView />
    </>
  );
}
