import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredUpdatePasswordView } from '../../sections/auth/jwt/centered-update-password-view';

// ----------------------------------------------------------------------

const metadata = { title: `Update password | Layout centered - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredUpdatePasswordView />
    </>
  );
}
