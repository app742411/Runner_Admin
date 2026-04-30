import { Helmet } from 'react-helmet-async';

import { GroupListView } from 'src/sections/group/view';

// ----------------------------------------------------------------------

export default function GroupListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Group List</title>
      </Helmet>

      <GroupListView />
    </>
  );
}
