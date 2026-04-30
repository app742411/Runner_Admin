import { Helmet } from 'react-helmet-async';
import { MailView } from 'src/sections/mail/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Mail | Runner</title>
      </Helmet>

      <MailView />
    </>
  );
}
