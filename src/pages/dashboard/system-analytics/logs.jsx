import { Helmet } from 'react-helmet-async';
import { SystemLogsView } from 'src/sections/system-analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>System Logs | Runner Dashboard</title>
      </Helmet>

      <SystemLogsView />
    </>
  );
}
