import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { useLogin } from 'src/features/auth/useLogin';

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'auth.emailRequired' })
    .email({ message: 'auth.emailInvalid' }),
  password: zod
    .string()
    .min(1, { message: 'auth.passwordRequired' })
    .min(6, { message: 'auth.passwordMin' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const { t } = useTranslation();
  const router = useRouter();

  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useLogin();

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (formData) => {
    setErrorMsg('');

    try {
      await loginMutation.mutateAsync(formData);

      // redirect handled by router / guards
      router.push('/dashboard');
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error.message || t('auth.loginError'));
    }
  });

  return (
    <>
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Typography variant="h5">{t('auth.signInTitle')}</Typography>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Field.Text name="email" label={t('auth.email')} InputLabelProps={{ shrink: true }} />

          <Stack spacing={1.5}>
            <Link
              component={RouterLink}
              to="/auth/jwt/forgot-password"
              variant="body2"
              color="inherit"
              sx={{ alignSelf: 'flex-end' }}
            >
              {t('auth.forgotPassword')}
            </Link>

            <Field.Text
              name="password"
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              type={password.value ? 'text' : 'password'}
              InputLabelProps={{ shrink: true }}
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
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={loginMutation.isPending}
            loadingIndicator={t('auth.signingIn')}
          >
            {t('auth.signIn')}
          </LoadingButton>

          <Stack spacing={1.5} sx={{ mb: 5 }}>
            <Stack direction="row" spacing={0.5} justifyContent="center">
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('auth.noAccount')}
              </Typography>

              <Link component={RouterLink} to={paths.auth.jwt.addCompany} variant="subtitle2">
                {t('auth.getStarted')}
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Form>
    </>
  );
}
