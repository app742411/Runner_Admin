import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Breadcrumbs as MuiBreadcrumbs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { CompanyNewForm } from '../company-new-form';

// ----------------------------------------------------------------------

export function CompanyNewView() {
  const { t } = useTranslation();

  return (
    <DashboardContent>
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h4">{t('company.title')}</Typography>
        <MuiBreadcrumbs
          separator={
            <Box
              component="span"
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
            />
          }
        >
          <Link href="/dashboard" color="inherit" underline="hover">
            {t('company.view.dashboard')}
          </Link>
          <Link href={paths.dashboard.company.root} color="inherit" underline="hover">
            {t('company.view.company')}
          </Link>
          <Typography color="text.primary">{t('company.view.addNew')}</Typography>
        </MuiBreadcrumbs>
      </Stack>

      <CompanyNewForm />
    </DashboardContent>
  );
}
