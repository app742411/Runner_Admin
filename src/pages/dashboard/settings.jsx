import { Helmet } from 'react-helmet-async';
import { SettingsView } from 'src/sections/settings/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Settings | Runner</title>
      </Helmet>

      <SettingsView />
    </>
  );
}
