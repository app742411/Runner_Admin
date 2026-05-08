import { Helmet } from 'react-helmet-async';
import { UserActivityView } from 'src/sections/system-analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>User Activity Reports | Runner Dashboard</title>
      </Helmet>

      <UserActivityView />
    </>
  );
}
