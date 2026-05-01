import { z as zod } from 'zod';
import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, alpha } from '@mui/material/styles';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRouter } from 'src/routes/hooks';
import { today } from 'src/utils/format-time';
import { fData } from 'src/utils/format-number';

import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import AddressAutocomplete from 'src/components/map/address-autocomplete';

import { useCreateCompany } from 'src/features/auth/use-create-company';

// ----------------------------------------------------------------------

export const SubscriptionSchema = zod
  .object({
    companyName: zod.string().min(1, 'addCompany.validation.companyRequired'),
    email: zod.string().min(1, 'addCompany.validation.emailRequired').email('addCompany.validation.emailInvalid'),
    phoneNumber: zod.string().min(1, 'addCompany.validation.phoneRequired'),
    addressLine1: zod.string().min(1, 'addCompany.validation.addressRequired'),
    addressLine2: zod.string().optional(),
    city: zod.string().min(1, 'addCompany.validation.cityRequired'),
    state: zod.string().min(1, 'addCompany.validation.stateRequired'),
    country: zod.string().min(1, 'addCompany.validation.countryRequired'),
    firstName: zod.string().min(1, 'addCompany.validation.firstNameRequired'),
    lastName: zod.string().min(1, 'addCompany.validation.lastNameRequired'),
    licenseNo: zod.string().min(1, 'addCompany.validation.licenseRequired'),
    licenseExpiryDate: zod.any().refine((val) => val !== null, 'addCompany.validation.expiryRequired'),
    pincode: zod.string().min(1, 'addCompany.validation.pincodeRequired'),
    password: zod.string().min(1, 'addCompany.validation.passwordRequired').min(6, 'addCompany.validation.passwordMin'),
    confirmPassword: zod.string().min(1, 'addCompany.validation.passwordRequired'),
    logo: zod.any().optional(),
    licenseDocuments: zod.any().optional(),
    latitude: zod.number().optional(),
    longitude: zod.number().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'addCompany.validation.passwordMatch',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function AddCompanyForm() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const password = useBoolean();

  const createCompanyMutation = useCreateCompany();

  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer;
    if (showSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showSuccess && countdown === 0) {
      router.push('/auth/jwt/sign-in');
    }
    return () => clearInterval(timer);
  }, [showSuccess, countdown, router]);

  const defaultValues = useMemo(
    () => ({
      companyName: '',
      email: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      firstName: '',
      lastName: '',
      licenseNo: '',
      licenseExpiryDate: today(),
      password: '',
      confirmPassword: '',
      logo: null,
      licenseDocuments: null,
      latitude: 0,
      longitude: 0,
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(SubscriptionSchema),
    defaultValues,
  });

  const { reset, setValue, handleSubmit, formState: { isSubmitting } } = methods;

  const onSubmit = handleSubmit((data) => {
    if (!data.licenseDocuments) {
      alert(t('addCompany.validation.licenseDocRequired'));
      return;
    }

    const formData = new FormData();

    formData.append('companyName', data.companyName);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('contactEmail', data.email);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('password', data.password);

    formData.append('licenseNo', data.licenseNo);
    formData.append('licenseExpiryDate', data.licenseExpiryDate);

    formData.append('addressLine1', data.addressLine1);
    formData.append('addressLine2', data.addressLine2 || '');
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('country', data.country);
    formData.append('pincode', data.pincode);

    if (data.latitude && data.longitude) {
      formData.append('latitude', String(data.latitude));
      formData.append('longitude', String(data.longitude));
    }

    if (data.licenseDocuments) {
      if (Array.isArray(data.licenseDocuments)) {
        data.licenseDocuments.forEach(file => {
          formData.append('licenseDocuments', file);
        });
      } else {
        formData.append('licenseDocuments', data.licenseDocuments);
      }
    }

    if (data.logo instanceof File) {
      formData.append('logo', data.logo);
    }

    const token = localStorage.getItem('token');

    createCompanyMutation.mutate(
      { formData, token },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (error) => {
          console.error(error);
          alert(error.message);
        },
      }
    );
  });

  const renderSectionHeader = (title, icon) => (
    <Typography variant="h6" sx={{ mb: 3, color: 'primary.main', display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
      <Box sx={{ width: 40, height: 40, borderRadius: 1.5, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
        <Iconify icon={icon} width={24} />
      </Box>
      {title}
    </Typography>
  );

  const cardStyle = {
    p: 3,
    boxShadow: (theme) => `0 0 2px 0 ${alpha(theme.palette.grey[500], 0.2)}, 0 12px 24px -4px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderRadius: 2,
    border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.08)}`
  };

  return (
    <Box
      sx={{
        py: 5,
        maxWidth: 1200,
        mx: 'auto',
        backgroundColor: '#fff',
        zIndex: 99,
        position: 'relative',
        borderRadius: 2,
        px: { xs: 2, md: 0 }
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Company Information */}
              <Card sx={cardStyle}>
                {renderSectionHeader(t('addCompany.title'), 'solar:info-circle-bold')}
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="firstName" label={t('addCompany.firstName')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="lastName" label={t('addCompany.lastName')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="companyName" label={t('addCompany.companyName')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="email" label={t('addCompany.email')} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.Phone name="phoneNumber" label={t('addCompany.phoneNumber')} />
                  </Grid>
                </Grid>
              </Card>

              {/* Address Details */}
              <Card sx={cardStyle}>
                {renderSectionHeader(t('addCompany.address'), 'solar:map-point-bold')}
                <Grid container spacing={2.5}>
                  <Grid item xs={12}>
                    <AddressAutocomplete
                      label={t('addCompany.addressSearch') || 'Search Address'}
                      onAddressSelect={(addressData) => {
                        setValue('addressLine1', addressData.addressLine1);
                        setValue('city', addressData.city);
                        setValue('state', addressData.state);
                        setValue('country', addressData.country);
                        setValue('pincode', addressData.pincode);
                        setValue('latitude', addressData.latitude);
                        setValue('longitude', addressData.longitude);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="addressLine1" label={t('addCompany.addressLine1')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="addressLine2" label={t('addCompany.addressLine2')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="city" label={t('addCompany.city')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="state" label={t('addCompany.state')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="pincode" label={t('addCompany.pincode')} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.CountrySelect name="country" label={t('addCompany.country')} placeholder={t('addCompany.selectCountry')} />
                  </Grid>
                </Grid>
              </Card>

              {/* Security */}
              <Card sx={cardStyle}>
                {renderSectionHeader(t('addCompany.security') || 'Security', 'solar:lock-password-bold')}
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}>
                    <Field.Text
                      name="password"
                      label={t('addCompany.adminPassword')}
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                              <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text
                      name="confirmPassword"
                      label={t('addCompany.confirmPassword')}
                      type={password.value ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={password.onToggle} edge="end">
                              <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Logo Upload */}
              <Card sx={{ ...cardStyle, textAlign: 'center' }}>
                {renderSectionHeader(t('addCompany.companyLogo') || 'Company Logo', 'solar:camera-add-bold')}
                <Field.UploadAvatar
                  name="logo"
                  maxSize={3145728}
                  onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];
                    if (file) {
                      setValue('logo', Object.assign(file, { preview: URL.createObjectURL(file) }), { shouldValidate: true });
                    }
                  }}
                  helperText={
                    <Typography variant="caption" sx={{ mt: 3, mx: 'auto', display: 'block', color: 'text.disabled' }}>
                      {t('addCompany.allowedFiles') || 'Allowed *.jpeg, *.jpg, *.png, *.gif'}
                      <br /> {t('addCompany.maxSizeOf') || 'Max size of'} {fData(3145728)}
                    </Typography>
                  }
                />
              </Card>

              {/* License Information */}
              <Card sx={cardStyle}>
                {renderSectionHeader(t('addCompany.licenseInfo'), 'solar:document-bold')}
                <Stack spacing={2.5}>
                  <Field.Text name="licenseNo" label={t('addCompany.licenseNo')} />
                  <Field.DatePicker name="licenseExpiryDate" label={t('addCompany.licenseExpiry')} />
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  <Typography variant="body2">{t('addCompany.uploadLicense')}</Typography>
                  <Field.Upload
                    multiple
                    name="licenseDocuments"
                    maxSize={3145728}
                    onDrop={(acceptedFiles) => setValue('licenseDocuments', acceptedFiles)}
                  />
                </Stack>
              </Card>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting || createCompanyMutation.isPending}
                sx={{ py: 1.5, boxShadow: (theme) => theme.customShadows.primary, bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
              >
                {t('addCompany.submit')}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>

      <Dialog open={showSuccess} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Iconify icon="solar:check-circle-bold" width={60} sx={{ color: 'success.main', mb: 2 }} />
          <Typography variant="h5">{t('addCompany.underReview')}</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Typography sx={{ color: 'text.secondary', mb: 3 }}>
            {t('addCompany.reviewMessage')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {t('addCompany.redirectMessage', { countdown })}
          </Typography>
          <LoadingButton
            fullWidth
            variant="contained"
            onClick={() => router.push('/auth/jwt/sign-in')}
            sx={{ mt: 3, bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' } }}
          >
            {t('addCompany.goToLogin')}
          </LoadingButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

