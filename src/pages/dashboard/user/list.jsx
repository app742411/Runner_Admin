import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { UserListView } from 'src/sections/user/view/user-list-view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('user.title')} | Runner Dashboard</title>
      </Helmet>

      <UserListView />
    </>
  );
}
