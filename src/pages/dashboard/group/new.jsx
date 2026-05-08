import { Helmet } from 'react-helmet-async';

import { GroupCreateView } from 'src/sections/group/view';

// ----------------------------------------------------------------------

export default function GroupNewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create Group</title>
      </Helmet>

      <GroupCreateView />
    </>
  );
}
