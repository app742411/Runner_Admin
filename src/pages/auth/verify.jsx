import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CenteredVerifyView } from '../../sections/auth/jwt/centered-verify-view';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Layout centered - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <CenteredVerifyView />
    </>
  );
}
