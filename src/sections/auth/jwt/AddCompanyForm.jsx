import { z as zod } from 'zod';
import { useMemo, useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRouter } from 'src/routes/hooks';
import { today } from 'src/utils/format-time';

import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

import { useCreateCompany } from 'src/features/auth/use-create-company';

// ----------------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------------

export const SubscriptionSchema = zod
  .object({
    companyName: zod.string().min(1, 'addCompany.validation.companyRequired'),
    email: zod.string().min(1, 'addCompany.validation.emailRequired').email('addCompany.validation.emailInvalid'),

    phoneNumber: zod
      .string()
      .min(1, 'addCompany.validation.phoneRequired')
      .regex(/^[0-9]+$/, 'addCompany.validation.onlyNumbers')
      .min(10, 'addCompany.validation.minDigits')
      .max(15, 'addCompany.validation.maxDigits'),

    addressLine1: zod.string().min(1),
    addressLine2: zod.string().optional(),
    city: zod.string().min(1),
    state: zod.string().min(1),
    country: zod.string().min(1),

    firstName: zod.string().min(1, 'addCompany.validation.firstNameRequired'),
    lastName: zod.string().min(1, 'addCompany.validation.lastNameRequired'),
    licenseNo: zod.string().min(1, 'addCompany.validation.licenseRequired'),
    licenseExpiryDate: zod.any().refine((val) => val !== null, 'addCompany.validation.expiryRequired'),
    pincode: zod
      .string()
      .regex(/^[0-9]+$/, 'addCompany.validation.onlyNumbers')
      .min(4, 'addCompany.validation.pincodeMin')
      .max(10, 'addCompany.validation.pincodeMax'),

    password: zod.string().min(1, 'addCompany.validation.passwordRequired').min(6, 'addCompany.validation.passwordMin'),
    confirmPassword: zod.string().min(1, 'addCompany.validation.passwordRequired'),
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

  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

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

  // ----------------------------------------------------------------------

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
    }),
    []
  );

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(SubscriptionSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  // ----------------------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------------------

  const onSubmit = handleSubmit((data) => {
    if (!uploadedFile) {
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

    formData.append('licenseDocuments', uploadedFile);

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

  // ----------------------------------------------------------------------

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  // ----------------------------------------------------------------------

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        backgroundColor: '#fff',
        zIndex: 99,
        p: 3,
        borderRadius: 2,
        marginTop: 5,
      }}
    >
      <Form methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {/* Company Info */}
          <Grid item xs={12}>
            <Typography variant="h6">{t('addCompany.title')}</Typography>
          </Grid>

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

          <Grid item xs={12} md={6}>
            <Field.Phone name="phoneNumber" label={t('addCompany.phoneNumber')} />
          </Grid>

          {/* License Info */}
          <Grid item xs={12}>
            <Typography variant="h6">{t('addCompany.licenseInfo')}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.Text name="licenseNo" label={t('addCompany.licenseNo')} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.DatePicker name="licenseExpiryDate" label={t('addCompany.licenseExpiry')} />
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <Typography variant="h6">{t('addCompany.address')}</Typography>
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
            <Field.Text
              name="pincode"
              label={t('addCompany.pincode')}
              inputProps={{
                inputMode: 'numeric',
                maxLength: 10,
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, '');
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Field.CountrySelect name="country" label={t('addCompany.country')} placeholder={t('addCompany.selectCountry')} />
          </Grid>

          {/* Admin Password */}
          <Grid item xs={12} md={6}>
            <Field.Text
              name="password"
              label={t('addCompany.adminPassword')}
              type={password.value ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={password.onToggle}>
                      <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Field.Text name="confirmPassword" label={t('addCompany.confirmPassword')} type="password" />
          </Grid>

          {/* Upload */}
          <Grid item xs={12}>
            <input ref={fileInputRef} hidden type="file" onChange={handleFileChange} />

            <Box
              sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderRadius: 2 }}
              onClick={() => fileInputRef.current.click()}
            >
              <Iconify icon="solar:cloud-upload-bold" width={32} />
              <Typography mt={1}>
                {uploadedFile ? uploadedFile.name : t('addCompany.uploadLicense')}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Stack alignItems="flex-end" mt={3}>
          <LoadingButton
            loading={createCompanyMutation.isPending}
            variant="contained"
            size="large"
            type="submit"
          >
            {t('addCompany.submit')}
          </LoadingButton>
        </Stack>
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
