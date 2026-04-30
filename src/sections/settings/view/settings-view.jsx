import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard/main';
import { SettingsProfile } from '../settings-profile';
import { SettingsPersonal } from '../settings-personal';
import { SettingsBanking } from '../settings-banking';

// ----------------------------------------------------------------------

export function SettingsView() {
  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={4}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Settings
        </Typography>

        <SettingsProfile />

        <SettingsPersonal />

        <SettingsBanking />
      </Stack>
    </DashboardContent>
  );
}
