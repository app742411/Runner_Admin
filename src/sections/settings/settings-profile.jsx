import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SettingsProfile() {
  const theme = useTheme();

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Card sx={{ p: 4, flexGrow: 1, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Avatar
            src="https://api-dev-minimal-v6.vercel.app/assets/images/avatar/avatar-25.webp"
            sx={{ width: 80, height: 80 }}
          />
          <Stack spacing={0.5} flexGrow={1}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
               Welcome, Sarah
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               Client ID: #CL789456
            </Typography>
          </Stack>
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            sx={{ bgcolor: '#001b2e', color: 'white', '&:hover': { bgcolor: '#002642' } }}
          >
            Edit Profile
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" sx={{ mt: 3, color: 'info.main' }}>
           <Iconify icon="eva:checkmark-circle-2-fill" width={24} sx={{ mr: 1 }} />
           <Typography variant="subtitle2">Verify account</Typography>
        </Stack>
      </Card>

      <Card sx={{ p: 4, width: { md: 400 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Iconify icon="solar:users-group-rounded-bold" width={24} sx={{ color: 'info.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              KYC Information
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Stack spacing={0.5}>
               <Typography variant="caption" sx={{ color: 'text.disabled' }}>Verification Status</Typography>
               <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Iconify icon="eva:checkmark-circle-2-fill" width={16} sx={{ color: 'success.main' }} />
                  <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 'bold' }}>Verified</Typography>
               </Stack>
            </Stack>

            <Stack spacing={0.5}>
               <Typography variant="caption" sx={{ color: 'text.disabled' }}>Last Updated</Typography>
               <Typography variant="subtitle2">15 Jan 2025</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" sx={{ color: 'primary.main', cursor: 'pointer' }}>
             <Typography variant="subtitle2" sx={{ mr: 1 }}>View Secure Documents</Typography>
             <Iconify icon="solar:lock-bold" width={18} />
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}
