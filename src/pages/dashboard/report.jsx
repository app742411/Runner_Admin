import { Helmet } from 'react-helmet-async';
import { ReportView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Generate Reports | Runner</title>
      </Helmet>

      <ReportView />
    </>
  );
}
