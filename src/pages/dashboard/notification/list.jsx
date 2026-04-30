import { Helmet } from 'react-helmet-async';
import { NotificationListView } from 'src/sections/notification/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Notifications | Runner</title>
      </Helmet>

      <NotificationListView />
    </>
  );
}
