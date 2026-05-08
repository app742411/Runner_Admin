import { Helmet } from 'react-helmet-async';
import { ContractOverviewView } from 'src/sections/contract/view/contract-overview-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Contract: Overview | Runner Dashboard</title>
      </Helmet>

      <ContractOverviewView />
    </>
  );
}
