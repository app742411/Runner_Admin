import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SettingsPersonal() {
  const theme = useTheme();

  return (
    <Card sx={{ p: 4, borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <Iconify icon="solar:user-bold" width={24} sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          Personal Information
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        <Grid xs={12} md={6}>
           <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'uppercase' }}>Full Name</Typography>
              <Typography variant="subtitle2">Sarah Emily Johnson</Typography>
           </Stack>
        </Grid>
        <Grid xs={12} md={6}>
           <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'uppercase' }}>Date of Birth</Typography>
              <Typography variant="subtitle2">15 March 1990</Typography>
           </Stack>
        </Grid>
        <Grid xs={12} md={6}>
           <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'uppercase' }}>Email</Typography>
              <Typography variant="subtitle2">sarah.johnson@email.com</Typography>
           </Stack>
        </Grid>
        <Grid xs={12} md={6}>
           <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'uppercase' }}>Contact</Typography>
              <Typography variant="subtitle2">+1 (555) 123-4567</Typography>
           </Stack>
        </Grid>
        <Grid xs={12}>
           <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 'bold', textTransform: 'uppercase' }}>Address</Typography>
              <Typography variant="subtitle2">123 Maple Street, Suite 405 Toronto, ON M5V 2T6</Typography>
           </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}
