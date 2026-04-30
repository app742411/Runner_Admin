import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { GroupDetailsView } from 'src/sections/group/view';

// ----------------------------------------------------------------------

export default function GroupDetailsPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Dashboard: Group Details</title>
      </Helmet>

      <GroupDetailsView id={id} />
    </>
  );
}
