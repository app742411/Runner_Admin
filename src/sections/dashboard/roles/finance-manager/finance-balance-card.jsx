import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export function FinanceBalanceCard({ balance, cardNumber, accountType }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        color: 'common.white',
        borderRadius: 2,
        position: 'relative',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.darker} 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern - Map-like or just abstract shapes */}
      <Box
        sx={{
          top: -20,
          right: -20,
          width: 160,
          height: 160,
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: alpha(theme.palette.common.white, 0.08),
        }}
      />
      <Box
        sx={{
          bottom: -40,
          left: -40,
          width: 240,
          height: 240,
          borderRadius: '50%',
          position: 'absolute',
          bgcolor: alpha(theme.palette.common.white, 0.04),
        }}
      />

      <Stack spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: '800' }}>
            {accountType || t('finance_dashboard.totalBalance')}
          </Typography>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.common.white, 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            💳
          </Box>
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h3" sx={{ fontWeight: '800' }}>
            {balance}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
            {cardNumber}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export function FinanceCurrentBalanceCard({ total, orderTotal, earning, refunded }) {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 4, height: 1, borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
      <Stack spacing={3}>
        <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{t('finance_dashboard.currentBalance')}</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>{total}</Typography>
        </Box>

        <Stack spacing={1.5}>
          <DetailRow label={t('finance_dashboard.orderTotal')} value={orderTotal} />
          <DetailRow label={t('finance_dashboard.earning')} value={earning} />
          <DetailRow label={t('finance_dashboard.refunded')} value={refunded} />
        </Stack>
      </Stack>
    </Card>
  );
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="subtitle2">{value}</Typography>
    </Stack>
  );
}
