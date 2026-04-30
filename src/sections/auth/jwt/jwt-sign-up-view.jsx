import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const SignUpSchema = zod.object({
  firstName: zod.string().min(1, { message: 'signUp.validation.firstNameRequired' }),
  lastName: zod.string().min(1, { message: 'signUp.validation.lastNameRequired' }),
  email: zod
    .string()
    .min(1, { message: 'signUp.validation.emailRequired' })
    .email({ message: 'signUp.validation.emailInvalid' }),
  password: zod.string().min(1, { message: 'signUp.validation.passwordRequired' }).min(6, { message: 'signUp.validation.passwordMin' }),
});

// ----------------------------------------------------------------------

export function JwtSignUpView() {
  const { t } = useTranslation();
  const router = useRouter();
  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // TEMPORARY SUBMIT (NO API)
  const onSubmit = handleSubmit(async () => {
    try {
      // later we will call API here
      router.push(paths.auth.jwt.signIn);
    } catch (error) {
      setErrorMsg(t('signUp.failed'));
    }
  });

  return (
    <>
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">{t('signUp.title')}</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('signUp.alreadyHaveAccount')}
          </Typography>

          <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="subtitle2">
            {t('signUp.signIn')}
          </Link>
        </Stack>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Field.Text name="firstName" label={t('signUp.firstName')} />
            <Field.Text name="lastName" label={t('signUp.lastName')} />
          </Stack>

          <Field.Text name="email" label={t('signUp.email')} />

          <Field.Text
            name="password"
            label={t('signUp.password')}
            placeholder={t('signUp.passwordPlaceholder')}
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

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('signUp.createAccount')}
          </LoadingButton>
        </Stack>
      </Form>

      <Typography
        component="div"
        sx={{
          mt: 3,
          textAlign: 'center',
          typography: 'caption',
          color: 'text.secondary',
        }}
      >
        {t('signUp.agreeTo')}{' '}
        <Link underline="always" color="text.primary">
          {t('signUp.terms')}
        </Link>{' '}
        and{' '}
        <Link underline="always" color="text.primary">
          {t('signUp.privacy')}
        </Link>
        .
      </Typography>
    </>
  );
}
