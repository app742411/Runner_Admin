import { Helmet } from 'react-helmet-async';
import { CompanyOverviewView } from 'src/sections/company/view/company-overview-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Company: Overview | Runner Dashboard</title>
      </Helmet>

      <CompanyOverviewView />
    </>
  );
}
