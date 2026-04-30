import { Helmet } from 'react-helmet-async';
import { CompanyDetailsView } from 'src/sections/company/view/company-details-view';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Company: Details | Runner Dashboard</title>
      </Helmet>

      <CompanyDetailsView id={id} />
    </>
  );
}
