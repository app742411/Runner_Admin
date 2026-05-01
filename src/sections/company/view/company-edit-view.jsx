import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { useSettingsContext } from 'src/components/settings';

import { useCompanyDetails } from 'src/features/company/useCompanies';

import { CompanyNewForm } from '../company-new-form';

// ----------------------------------------------------------------------

export function CompanyEditView({ id }) {
  const { t } = useTranslation();

  const { data: currentCompany, isLoading } = useCompanyDetails(id);

  return (
    <DashboardContent maxWidth={false}>
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography variant="h4">{t('company.edit')}</Typography>
        <MuiBreadcrumbs
          separator={
            <Box
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
            />
          }
        >
          <Link href="/dashboard" color="inherit" underline="hover">
            {t('company.view.dashboard')}
          </Link>
          <Link href="/dashboard/company" color="inherit" underline="hover">
            {t('company.view.company')}
          </Link>
          <Typography color="text.primary">{t('company.edit')}</Typography>
        </MuiBreadcrumbs>
      </Stack>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CompanyNewForm currentCompany={currentCompany} />
      )}
    </DashboardContent>
  );
}

CompanyEditView.propTypes = {
  id: PropTypes.string,
};
