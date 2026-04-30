import { useEmployee, useEmployeeProfile } from 'src/features/employee/useEmployees';
import { useParams } from 'src/routes/hooks';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { EmployeeNewEditForm } from '../employee-new-edit-form';

// ----------------------------------------------------------------------

export function EmployeeEditView() {
  const { id } = useParams();
  const isProfile = !id;

  const { data: employeeData, isLoading: isEmployeeLoading } = useEmployee(id);
  const { data: profileData, isLoading: isProfileLoading } = useEmployeeProfile();

  const employee = isProfile ? profileData?.data : employeeData?.data;
  const isLoading = isProfile ? isProfileLoading : isEmployeeLoading;

  if (isLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  if (!employee) {
    return (
      <DashboardContent>
        <Typography variant="h6" color="error">
           Failed to load employee details.
        </Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack spacing={3} sx={{ mb: 5 }}>
        <Typography variant="h4">{isProfile ? 'Edit Profile' : 'Edit Employee'}</Typography>
      </Stack>

      <EmployeeNewEditForm currentEmployee={employee} isProfile={isProfile} />
    </DashboardContent>
  );
}
