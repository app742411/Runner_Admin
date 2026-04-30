import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CompanyEditView } from 'src/sections/company/view/company-edit-view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Edit Company</title>
      </Helmet>

      <CompanyEditView id={id} />
    </>
  );
}
