import { Helmet } from 'react-helmet-async';
import { ContractNewView } from 'src/sections/contract/view/contract-new-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Contract: New | Runner Dashboard</title>
      </Helmet>

      <ContractNewView />
    </>
  );
}
