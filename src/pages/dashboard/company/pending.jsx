import { Helmet } from 'react-helmet-async';
import { CompanyPendingView } from 'src/sections/company/view/company-pending-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Company: Pending | Runner Dashboard</title>
      </Helmet>

      <CompanyPendingView />
    </>
  );
}
