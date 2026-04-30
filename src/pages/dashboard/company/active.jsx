import { Helmet } from 'react-helmet-async';
import { CompanyActiveView } from 'src/sections/company/view/company-active-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Company: Active | Runner Dashboard</title>
      </Helmet>

      <CompanyActiveView />
    </>
  );
}
