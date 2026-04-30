import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

function BankCard({ bankName, accountType, accountNumber, dateConnected, expiryDate, color }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        height: 1,
        bgcolor: alpha(color, 0.08),
        border: `1px solid ${alpha(color, 0.2)}`,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Iconify icon="solar:bank-bold" width={24} sx={{ color }} />
        <Label variant="filled" color="default" sx={{ bgcolor: 'white', color: 'text.primary', border: `1px solid ${theme.palette.divider}` }}>
           Active
        </Label>
      </Stack>

      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
           {bankName}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
           {accountType}
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ mb: 3, flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
           Account ending in •••• {accountNumber}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
           Connected since: {dateConnected}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
           Consent expires: {expiryDate}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
         <Stack direction="row" alignItems="center" sx={{ color: 'primary.main', cursor: 'pointer' }}>
            <Typography variant="subtitle2" sx={{ mr: 0.5 }}>View Details</Typography>
            <Iconify icon="solar:arrow-right-bold" width={16} />
         </Stack>
         <Switch defaultChecked />
      </Stack>
    </Card>
  );
}

export function SettingsBanking() {
  const theme = useTheme();

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Connected Banking Accounts
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <BankCard
            bankName="Royal Bank of Canada"
            accountType="Primary Checking Account"
            accountNumber="4567"
            dateConnected="Jan 15, 2025"
            expiryDate="Jan 15, 2026"
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <BankCard
            bankName="TD Canada Trust"
            accountType="Savings Account"
            accountNumber="8901"
            dateConnected="Dec 1, 2024"
            expiryDate="Dec 1, 2025"
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Card
            sx={{
              p: 3,
              borderRadius: 2,
              height: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px dashed ${theme.palette.divider}`,
              bgcolor: 'background.neutral',
              boxShadow: 'none',
              textAlign: 'center',
            }}
          >
            <Iconify icon="mingcute:add-line" width={32} sx={{ mb: 2, color: 'text.disabled' }} />
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
               Connect New Bank Account
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: '#001b2e', color: 'white', '&:hover': { bgcolor: '#002642' } }}
            >
              Add Account
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
