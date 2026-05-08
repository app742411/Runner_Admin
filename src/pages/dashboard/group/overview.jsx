import { Helmet } from 'react-helmet-async';

import { GroupOverviewView } from 'src/sections/group/view';

// ----------------------------------------------------------------------

export default function GroupOverviewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Group Overview</title>
      </Helmet>

      <GroupOverviewView />
    </>
  );
}
