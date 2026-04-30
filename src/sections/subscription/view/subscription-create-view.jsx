import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { SubscriptionNewForm } from '../subscription-new-form';

// ----------------------------------------------------------------------

export function SubscriptionCreateView() {
  const router = useRouter();

  return (
    <DashboardContent>
       <Stack spacing={1} sx={{ mb: 5 }}>
          <Typography variant="h4">Add New Subscription Plan</Typography>
          <Breadcrumbs
            separator={
              <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />
            }
          >
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.root)} sx={{ cursor: 'pointer' }}>Dashboard</Link>
            <Link color="inherit" underline="hover" onClick={() => router.push(paths.dashboard.subscription.list)} sx={{ cursor: 'pointer' }}>Subscription</Link>
            <Typography color="text.primary">New plan</Typography>
          </Breadcrumbs>
        </Stack>

      <SubscriptionNewForm />
    </DashboardContent>
  );
}
