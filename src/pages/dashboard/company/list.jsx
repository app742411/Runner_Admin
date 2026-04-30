import { Helmet } from 'react-helmet-async';
import { CompanyListView } from 'src/sections/company/view/company-list-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Company: List | Runner Dashboard</title>
      </Helmet>

      <CompanyListView />
    </>
  );
}
