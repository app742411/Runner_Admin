import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import {  } from 'src/sections/auth/jwt';
import { AddCompanyForm } from 'src/sections/auth/jwt/AddCompanyForm';

// ----------------------------------------------------------------------

const metadata = { title: ` Register Your Company |  - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddCompanyForm />
    </>
  );
}
