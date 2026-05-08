import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { paths } from 'src/routes/paths';

import { GroupNewForm } from '../group-new-form';

// ----------------------------------------------------------------------

export function GroupCreateView() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <DashboardContent maxWidth="lg">
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h4">{t('group.form.newTitle') || 'Create New Group'}</Typography>
        <Breadcrumbs
          separator={
            <Box
              component="span"
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
            />
          }
        >
          <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>
            {t('group.view.dashboard') || 'Dashboard'}
          </Link>
          <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.group.root)} sx={{ cursor: 'pointer' }}>
            {t('group.view.group') || 'Group'}
          </Link>
          <Typography color="text.primary">{t('group.form.newTitle') || 'Create New Group'}</Typography>
        </Breadcrumbs>
      </Stack>

      <Card sx={{ borderRadius: 2, bgcolor: 'background.paper', p: 1 }}>
        <GroupNewForm />
      </Card>
    </DashboardContent>
  );
}
