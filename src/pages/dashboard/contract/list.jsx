import { Helmet } from 'react-helmet-async';
import { ContractListView } from 'src/sections/contract/view/contract-list-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Contract: List | Runner Dashboard</title>
      </Helmet>

      <ContractListView />
    </>
  );
}
