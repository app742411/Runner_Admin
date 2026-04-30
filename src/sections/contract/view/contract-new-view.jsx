import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard/main';

import { ContractNewForm } from '../contract-new-form';

// ----------------------------------------------------------------------

export function ContractNewView() {
  const router = useRouter();

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={1} sx={{ mb: 5 }}>
        <Typography variant="h4">Create a new contract</Typography>
        <Breadcrumbs
          separator={
            <Box
              component="span"
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }}
            />
          }
        >
          <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard')} sx={{ cursor: 'pointer' }}>
            Dashboard
          </Link>
          <Link color="inherit" underline="hover" onClick={() => router.push('/dashboard/contract/list')} sx={{ cursor: 'pointer' }}>
            Contract List
          </Link>
          <Typography color="text.primary">New contract</Typography>
        </Breadcrumbs>
      </Stack>

      <ContractNewForm />
    </DashboardContent>
  );
}
