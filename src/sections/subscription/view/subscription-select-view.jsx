import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslation } from 'react-i18next';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { usePlans } from 'src/features/plan/usePlans';
import { Iconify } from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const MOCK_PLANS = [
  {
    _id: 'mock-free',
    planName: 'FREE',
    monthlyFees: '0',
    description: 'It is a long established fact that a reader will be distracted.',
    planFeatures: ['Mauris suspendisse massa', 'Elit eget gravida'],
  },
  {
    _id: 'mock-premium',
    planName: 'PREMIUM',
    monthlyFees: '99',
    description: 'It is a long established fact that a reader will be distracted.',
    planFeatures: ['Aliquet in semper', 'Convallis lorem vel'],
  },
  {
    _id: 'mock-pro',
    planName: 'PRO',
    monthlyFees: '199',
    description: 'It is a long established fact that a reader will be distracted.',
    planFeatures: ['Vitae justo eget', 'Mi eget mauris', 'Libero enim sed'],
  },
];

// ----------------------------------------------------------------------

export function SubscriptionSelectView() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const { data, isLoading } = usePlans();
  const plans = (data?.data?.length > 0) ? data.data : MOCK_PLANS;

  const getPlanColor = (name) => {
    if (name?.toUpperCase().includes('PRO')) return '#003049';
    if (name?.toUpperCase().includes('PREMIUM')) return '#006C9C';
    return '#FFAB00';
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, px: 3, minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Stack spacing={2} sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 800 }}>
          {t('subscription.selectPlan')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('subscription.choosePlan')}
        </Typography>
      </Stack>

      <Grid container spacing={4} sx={{ maxWidth: 1200, mx: 'auto' }}>
        {plans.map((plan) => (
          <Grid key={plan._id} xs={12} md={4}>
            <Card
              sx={{
                p: 5,
                height: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                borderTop: `6px solid ${getPlanColor(plan.planName)}`,
                boxShadow: theme.customShadows.z12,
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                {plan.planName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {plan.description || t('subscription.defaultDesc') || 'Enjoy our professional services with this plan.'}
              </Typography>

              <Stack direction="row" alignItems="baseline" sx={{ mb: 5 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {fCurrency(plan.monthlyFees)}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                  /{t('subscription.month')}
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ mb: 5, flexGrow: 1 }}>
                {plan.planFeatures?.map((feature) => (
                  <Stack key={feature} direction="row" alignItems="center" spacing={1.5}>
                    <Iconify icon="eva:checkmark-fill" sx={{ color: 'success.main', width: 20 }} />
                    <Typography variant="body2">{feature}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={() => router.push(`${paths.dashboard.subscription.checkout}?planId=${plan._id}`)}
                sx={{
                   borderRadius: 1.5,
                   height: 54,
                   borderColor: 'text.primary',
                   color: 'text.primary',
                   '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.05)',
                   }
                }}
              >
                {t('subscription.tryNow')}
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
