import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { EmployeeNewEditForm } from '../employee-new-edit-form';

// ----------------------------------------------------------------------

export function EmployeeCreateView() {
  return (
    <DashboardContent>
      <Stack spacing={3} sx={{ mb: 5 }}>
        <Typography variant="h4">Add New Employee</Typography>
      </Stack>

      <EmployeeNewEditForm />
    </DashboardContent>
  );
}
