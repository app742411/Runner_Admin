import { Helmet } from 'react-helmet-async';
import { WorkReportListView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Work Reports | Runner</title>
      </Helmet>

      <WorkReportListView />
    </>
  );
}
