import { Helmet } from 'react-helmet-async';
import { WorkReportDetailsView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Work Report Details | Runner</title>
      </Helmet>

      <WorkReportDetailsView />
    </>
  );
}
