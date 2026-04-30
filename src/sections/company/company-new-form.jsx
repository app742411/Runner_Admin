import { useTranslation } from 'react-i18next';
import { z as zod } from 'zod';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useUpdateCompany } from 'src/features/company/useCompanies';
import { companyApi } from 'src/store/api/company.api';

import toast from 'react-hot-toast';

// ----------------------------------------------------------------------

export const NewCompanySchema = zod.object({
  companyName: zod.string().min(1, 'company.validation.companyName'),
  firstName: zod.string().min(1, 'company.validation.firstName'),
  lastName: zod.string().min(1, 'company.validation.lastName'),
  contactEmail: zod.string().min(1, 'company.validation.email').email('company.validation.emailInvalid'),
  phoneNumber: zod.string().min(1, 'company.validation.phone'),
  // License
  licenseNo: zod.string().min(1, 'company.validation.licenseNo'),
  licenseExpiryDate: zod.any().refine((val) => val !== null, 'company.validation.licenseExpiry'),
  adminPassword: zod.string().optional(),
  confirmPassword: zod.string().optional(),
  // Address
  addressLine1: zod.string().min(1, 'company.validation.address'),
  addressLine2: zod.string().optional(),
  city: zod.string().min(1, 'company.validation.city'),
  state: zod.string().min(1, 'company.validation.state'),
  country: zod.string().min(1, 'company.validation.country'),
  pincode: zod.string().min(1, 'company.validation.pincode'),
  // Upload
  licenseDocuments: zod.any().optional(),
}).refine((data) => {
  if (data.adminPassword || data.confirmPassword) {
    return data.adminPassword === data.confirmPassword;
  }
  return true;
}, {
  message: "company.validation.passwordMatch",
  path: ['confirmPassword'],
}).refine((data) => {
  if (!data.id && (!data.adminPassword || data.adminPassword.length < 6)) {
    return false;
  }
  return true;
}, {
  message: "company.validation.passwordMin",
  path: ['adminPassword'],
});

// ----------------------------------------------------------------------

export function CompanyNewForm({ currentCompany }) {
  const { t } = useTranslation();
  const router = useRouter();
  const password = useBoolean();

  const isEdit = !!currentCompany;
  const updateCompany = useUpdateCompany();

  const defaultValues = useMemo(
    () => ({
      companyName: currentCompany?.companyName || '',
      firstName: currentCompany?.createdBy?.firstName || '',
      lastName: currentCompany?.createdBy?.lastName || '',
      contactEmail: currentCompany?.contactEmail || '',
      phoneNumber: currentCompany?.phoneNumber || '',
      licenseNo: currentCompany?.licenseNo || '',
      licenseExpiryDate: currentCompany?.licenseExpiryDate ? new Date(currentCompany.licenseExpiryDate) : null,
      adminPassword: '',
      confirmPassword: '',
      addressLine1: currentCompany?.address?.addressLine1 || '',
      addressLine2: currentCompany?.address?.addressLine2 || '',
      city: currentCompany?.address?.city || '',
      state: currentCompany?.address?.state || '',
      country: currentCompany?.address?.country || '',
      pincode: currentCompany?.address?.pincode || '',
      licenseDocuments: null,
    }),
    [currentCompany]
  );

  const methods = useForm({
    resolver: zodResolver(NewCompanySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentCompany) {
      reset(defaultValues);
    }
  }, [currentCompany, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();

      // Common fields
      formData.append('companyName', data.companyName);
      formData.append('contactEmail', data.contactEmail);
      formData.append('phoneNumber', data.phoneNumber);
      
      // Address fields
      formData.append('addressLine1', data.addressLine1);
      formData.append('addressLine2', data.addressLine2 || '');
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('country', data.country);
      formData.append('pincode', data.pincode);

      // License
      formData.append('licenseNo', data.licenseNo);
      formData.append('licenseExpiryDate', data.licenseExpiryDate instanceof Date ? data.licenseExpiryDate.toISOString() : data.licenseExpiryDate);

      // Password (only if set)
      if (data.adminPassword) {
        formData.append('adminPassword', data.adminPassword);
      }

      // Files
      if (data.licenseDocuments) {
        if (Array.isArray(data.licenseDocuments)) {
          data.licenseDocuments.forEach(file => {
            formData.append('licenseDocuments', file);
          });
        } else {
          formData.append('licenseDocuments', data.licenseDocuments);
        }
      }

      if (isEdit) {
        await updateCompany.mutateAsync({ id: currentCompany._id || currentCompany.companyId, data: formData });
        toast.success(t('company.messages.successUpdate'));
      } else {
        // Only for new company
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        
        await companyApi.create(formData);
        toast.success(t('company.messages.successCreate'));
      }

      reset();
      router.push(paths.dashboard.company.list);
    } catch (error) {
      console.error(error);
      toast.error(error.message || t('company.messages.errorDefault'));
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={4}>
              {/* Company Information */}
              <Stack spacing={3}>
                <Typography variant="h6">{t('company.form.info')}</Typography>
                <Grid container spacing={2}>
                  {!isEdit && (
                    <>
                      <Grid item xs={12} md={6}>
                        <Field.Text name="firstName" label={t('company.form.firstName')} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field.Text name="lastName" label={t('company.form.lastName')} />
                      </Grid>
                    </>
                  )}
                  <Grid item xs={12} md={6}>
                    <Field.Text name="companyName" label={t('company.form.companyName')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="contactEmail" label={t('company.form.email')} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.Phone name="phoneNumber" label={t('company.form.phoneNumber')} />
                  </Grid>
                </Grid>
              </Stack>

              {/* License Information */}
              <Stack spacing={3}>
                <Typography variant="h6">{t('company.form.licenseInfo')}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="licenseNo" label={t('company.form.licenseNo')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.DatePicker name="licenseExpiryDate" label={t('company.form.licenseExpiry')} />
                  </Grid>
                </Grid>
              </Stack>

              {/* Address Details */}
              <Stack spacing={3}>
                <Typography variant="h6">{t('company.form.addressDetails')}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="addressLine1" label={t('company.form.address1')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="addressLine2" label={t('company.form.address2')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="city" label={t('company.form.city')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="state" label={t('company.form.state')} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Field.Text name="pincode" label={t('company.form.pincode')} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.CountrySelect name="country" label={t('company.form.country')} placeholder={t('company.form.selectCountry')} />
                  </Grid>

                  {/* Passwords - Required for new, optional for edit */}
                  <Grid item xs={12} md={6}>
                    <Field.Text
                      name="adminPassword"
                      label={isEdit ? t('company.form.newPasswordOptional') : t('company.form.password')}
                      placeholder={t('company.form.placeholder.password')}
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
                      label={t('company.form.confirmPassword')}
                      placeholder={t('company.form.placeholder.password')}
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
              </Stack>

              {/* File Upload */}
              <Stack spacing={1.5}>
                <Typography variant="body2">{isEdit ? t('company.form.updateLicense') : t('company.form.uploadLicense')}</Typography>
                <Field.Upload 
                  multiple 
                  name="licenseDocuments" 
                  maxSize={3145728} 
                  onDrop={(acceptedFiles) => methods.setValue('licenseDocuments', acceptedFiles)} 
                />
              </Stack>

              <Stack alignItems="flex-end">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ bgcolor: '#003b51', '&:hover': { bgcolor: '#002636' }, px: 4, py: 1.5 }}
                >
                  {isEdit ? t('company.form.updateInfo') : t('company.form.addInfo')}
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}

CompanyNewForm.propTypes = {
  currentCompany: PropTypes.object,
};
