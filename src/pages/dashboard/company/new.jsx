import { Helmet } from 'react-helmet-async';
import { CompanyNewView } from 'src/sections/company/view/company-new-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Company: Create | Runner Dashboard</title>
      </Helmet>

      <CompanyNewView />
    </>
  );
}
