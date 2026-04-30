import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme, alpha } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useSelector, useDispatch } from 'react-redux';
import { usePurchasePlan, usePlans } from 'src/features/plan/usePlans';
import { setAuth } from 'src/store/auth/authSlice';
import toast from 'react-hot-toast';
import { Iconify } from 'src/components/iconify';

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

export function SubscriptionCheckoutView() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  const { user } = useSelector((state) => state.auth);
  const { data } = usePlans();
  const plans = (data?.data?.length > 0) ? data.data : MOCK_PLANS;
  const selectedPlan = plans.find((p) => p._id === planId) || plans[1]; // Default to Premium if nothing matched

  const { mutateAsync: purchasePlan, isPending } = usePurchasePlan();

  const handlePay = async () => {
    if (!selectedPlan) {
      toast.error(t('subscription.noPlanSelected') || 'No plan selected!');
      return;
    }

    try {
      const response = await purchasePlan({
        planId: "69842d95bd2efb169f811132", // Static planId as requested
        billingCycle: 'monthly',
      });

      if (response.data.success) {
        toast.success(t('subscription.checkout.success') || 'Payment successful!');
        
        // Update local user state so SubscriptionGuard allows access
        const updatedUser = {
          ...user,
          subscriptionStatus: 'active',
        };
        
        // We might need the new token if backend returns one, but for now we just update user
        dispatch(setAuth({ accessToken: localStorage.getItem('accessToken'), user: updatedUser }));
        
        router.push('/');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || t('subscription.checkout.error') || 'Payment failed!');
    }
  };

  return (
    <Box sx={{ py: 10, px: 5, minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      <Grid container spacing={10} sx={{ maxWidth: 1400, mx: 'auto' }}>
        
        {/* Left Section */}
        <Grid xs={12} md={6}>
          <Stack spacing={4}>
             <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {selectedPlan?.planName || t('subscription.selectPlan')}
                </Typography>
                <IconButton>
                  <Iconify icon="eva:chevron-down-fill" />
                </IconButton>
             </Stack>

             <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {t('subscription.choosePlan')}
             </Typography>

             <Stack spacing={4} sx={{ pt: 2 }}>
               {(selectedPlan?.planFeatures || [
                 'Montes nascetur ridiculus',
                 'Scelerisque litora blandit',
                 'Felis ligula scelerisque',
                 'Quis enim lobortis'
               ]).map((item, index) => (
                 <Stack key={item} direction="row" spacing={3} alignItems="center">
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1), 
                        borderRadius: 1.5,
                        color: theme.palette.primary.main
                      }}
                    >
                      <Iconify icon={['solar:wallet-bold', 'solar:document-text-bold', 'solar:users-group-rounded-bold', 'solar:link-bold'][index % 4]} width={28} />
                    </Box>
                    <Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                           {t('subscription.checkout.featureDesc') || 'Enjoy all the professional features included in this plan.'}
                        </Typography>
                    </Stack>
                 </Stack>
               ))}
             </Stack>
          </Stack>
        </Grid>

        {/* Right Section */}
        <Grid xs={12} md={6}>
           <Card sx={{ p: 0, borderRadius: 3, bgcolor: '#1A1833', color: 'white' }}>
              <Box sx={{ p: 4 }}>
                 <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 1 }}>
                    {t('subscription.checkout.subscribeTo')} {selectedPlan?.planName}
                 </Typography>
                 <Typography variant="h2" sx={{ fontWeight: 900 }}>
                    CHF {selectedPlan?.monthlyFees || '0.00'}
                 </Typography>

                 <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, opacity: 0.8 }}>
                    <Typography variant="body2">{t('subscription.checkout.tax') || 'Tax'}</Typography>
                    <Typography variant="body2">CHF0.00</Typography>
                 </Stack>
                 <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, fontWeight: 700 }}>
                    <Typography variant="body1">{t('subscription.totalPayable')}</Typography>
                    <Typography variant="body1">CHF {selectedPlan?.monthlyFees || '0.00'}</Typography>
                 </Stack>
              </Box>
           </Card>

           <Stack spacing={3} sx={{ mt: 4 }}>
              <Box sx={{ bgcolor: 'white', borderRadius: 2, border: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', p: 1 }}>
                 <TextField 
                    fullWidth 
                    placeholder={t('subscription.discount')} 
                    variant="standard" 
                    InputProps={{ disableUnderline: true, sx: { px: 2 } }}
                 />
                 <Button variant="text" sx={{ fontWeight: 700, color: 'primary.main', px: 3 }}>
                    {t('subscription.apply')}
                 </Button>
              </Box>

              <Stack direction="row" sx={{ bgcolor: 'white', borderRadius: 2, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' }}>
                 {[
                   { label: t('subscription.checkout.methodCard') || 'Card', icon: 'solar:card-bold' },
                   { label: 'Paypal', icon: 'logos:paypal' },
                   { label: 'UPI', icon: 'logos:google-pay' },
                   { label: t('subscription.checkout.methodBank') || 'E banking', icon: 'solar:bank-bold' }
                 ].map((method, index) => (
                   <Box 
                      key={method.label} 
                      sx={{ 
                        flex: 1, 
                        p: 2, 
                        textAlign: 'center', 
                        cursor: 'pointer',
                        borderBottom: index === 0 ? `3px solid ${theme.palette.error.main}` : 'none',
                        borderRight: index < 3 ? `1px solid ${theme.palette.divider}` : 'none',
                        '&:hover': { bgcolor: alpha(theme.palette.grey[500], 0.05) }
                      }}
                   >
                      <Iconify icon={method.icon} width={24} sx={{ color: index === 0 ? 'error.main' : 'text.secondary', mb: 1 }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: index === 0 ? 'error.main' : 'text.secondary' }}>
                        {method.label}
                      </Typography>
                   </Box>
                 ))}
                 <IconButton sx={{ borderRadius: 0, px: 2 }}><Iconify icon="eva:more-vertical-fill" /></IconButton>
              </Stack>

              <Stack spacing={2} sx={{ bgcolor: 'white', p: 0, borderRadius: 2 }}>
                 <TextField 
                    fullWidth 
                    label={t('subscription.checkout.cardNumber') || "Card number"} 
                    defaultValue="4242 4242 4242 4242"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                           <Iconify icon="logos:visa" width={24} sx={{ mr: 1 }} />
                           <Iconify icon="logos:mastercard" width={24} sx={{ mr: 1 }} />
                           <Iconify icon="logos:discover" width={24} sx={{ mr: 1 }} />
                        </InputAdornment>
                      )
                    }}
                 />
                 <Stack direction="row" spacing={2}>
                    <TextField fullWidth label={t('subscription.checkout.expiration') || "Expiration"} defaultValue="12/26" />
                    <TextField fullWidth label="CVC" defaultValue="123" InputProps={{ endAdornment: <Iconify icon="solar:info-circle-bold" sx={{ color: 'text.disabled' }} /> }} />
                 </Stack>
                 <TextField fullWidth select label={t('subscription.checkout.country') || "Country"} defaultValue="IN" SelectProps={{ sx: { py: 1 } }}>
                    <MenuItem value="HK">Hong Kong SAR China</MenuItem>
                    <MenuItem value="CH">Switzerland</MenuItem>
                    <MenuItem value="DE">Germany</MenuItem>
                    <MenuItem value="IN">India</MenuItem>
                 </TextField>
              </Stack>

              <LoadingButton 
                fullWidth 
                size="large" 
                variant="contained" 
                loading={isPending}
                sx={{ bgcolor: '#003049', '&:hover': { bgcolor: '#002636' }, py: 2, borderRadius: 2, fontWeight: 700, fontSize: '1.1rem' }}
                onClick={handlePay}
              >
                {t('subscription.pay')}
              </LoadingButton>
           </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
