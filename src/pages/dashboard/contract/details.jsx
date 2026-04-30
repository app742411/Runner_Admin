import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { ContractDetailsView } from 'src/sections/contract/view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Dashboard: Contract Details | Runner</title>
      </Helmet>

      <ContractDetailsView id={id} />
    </>
  );
}
