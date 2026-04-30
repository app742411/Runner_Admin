import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { CompanyAdminDashboardView } from 'src/sections/company-admin/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`Company Admin | ${t('dashboard.title')}`}</title>
      </Helmet>

      <CompanyAdminDashboardView />
    </>
  );
}
