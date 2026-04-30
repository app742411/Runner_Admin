import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTranslation } from 'react-i18next';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { PasswordIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useForgotPassword } from 'src/features/auth/useForgotPassword';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export const ResetPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'auth.emailRequired' })
    .email({ message: 'auth.emailInvalid' }),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const { t } = useTranslation();
  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const { handleSubmit } = methods;

  // USE AUTH HOOK
  const { mutate, isPending } = useForgotPassword();

  const onSubmit = handleSubmit((data) => {
    mutate(data); // { email }
  });

  return (
    <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          my: 10,
          py: 10,
          px: 3,
          zIndex: 99,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            mb: 5,
            textAlign: 'center',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            maxWidth: 480,
            mx: 'auto',
            p: 4,
            borderRadius: 2,
            boxShadow: (theme) => theme.customShadows.z20,

            alignItems: 'center',
            zIndex: 99,
            height: 'auto',
          }}
        >
          {/* HEADER */}
          <PasswordIcon sx={{ mx: 'auto' }} />

          <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
            <Typography variant="h5">{t('auth.resetPassword.title')}</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('auth.resetPassword.description')}
            </Typography>
          </Stack>

          {/* FORM */}
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <Field.Text
                name="email"
                label={t('auth.resetPassword.emailLabel')}
                placeholder={t('auth.resetPassword.emailPlaceholder')}
                autoFocus
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isPending}
              >
                {t('auth.resetPassword.sendRequest')}
              </LoadingButton>

              {/* FIXED LINK */}
              <Link
                component={RouterLink}
                to="/auth/jwt/sign-in"
                color="inherit"
                variant="subtitle2"
                sx={{ mx: 'auto', display: 'inline-flex', alignItems: 'center' }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
                {t('auth.resetPassword.returnSignIn')}
              </Link>
            </Stack>
          </Form>
        </Box>{' '}
    </Box>
  );
}
