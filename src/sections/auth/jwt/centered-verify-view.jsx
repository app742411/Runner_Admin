import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';
import { EmailInboxIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

import { useVerifyOtp } from '../../../features/auth/useVerifyOtp';
import { useResendOtp } from '../../../features/auth/useResendOtp';

// ----------------------------------------------------------------------

export const VerifySchema = zod.object({
  code: zod.string().min(6, { message: 'verify.validation.codeRequired' }),
});

// ----------------------------------------------------------------------

export function CenteredVerifyView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const idRef = useRef(sessionStorage.getItem('fp_id'));
  const id = idRef.current;

  const [seconds, setSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = sessionStorage.getItem('fp_email');
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (seconds === 0) {
      setCanResend(true);
    } else {
      const timer = setTimeout(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [seconds]);

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: '',
    },
  });

  const { handleSubmit } = methods;
  const { mutate, isPending } = useVerifyOtp();

  if (!id) {
    return <Navigate to="/auth/jwt/sign-in" replace />;
  }

  const onSubmit = handleSubmit((data) => {
    if (!id) {
      toast.error(t('verify.sessionExpired'));
      return;
    }

    mutate({
      id,
      code: data.code,
    });
  });

  const handleResendOtp = () => {
    if (!email) {
      toast.error(t('verify.emailNotFound'));
      navigate('/auth/jwt/forgot-password');
      return;
    }

    resendOtp({ email });

    setSeconds(60);
    setCanResend(false);
  };

  return (
    <Box
      sx={{
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
        {/* Header */}
        <EmailInboxIcon sx={{ mx: 'auto' }} />

        <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
          <Typography variant="h5">{t('verify.title')}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('verify.description')}
          </Typography>
        </Stack>

        {/* Form */}
        <Form methods={methods} onSubmit={onSubmit}>
          <Stack spacing={3}>
            {/* OTP */}
            <Field.Code name="code" />

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isPending}
              loadingIndicator={t('verify.verifying')}
            >
              {t('verify.button')}
            </LoadingButton>

            {/* Resend OTP */}
            <Typography variant="body2" sx={{ mx: 'auto' }}>
              {canResend ? (
                <Link variant="subtitle2" sx={{ cursor: 'pointer' }} onClick={handleResendOtp}>
                  {t('verify.resendCode')}
                </Link>
              ) : (
                <>
                  {t('verify.resendIn', { seconds })}
                </>
              )}
            </Typography>

            {/* Back */}
            <Link
              component={RouterLink}
              to="/auth/jwt/sign-in"
              color="inherit"
              variant="subtitle2"
              sx={{ mx: 'auto', display: 'inline-flex', alignItems: 'center' }}
            >
              <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
              {t('verify.returnSignIn')}
            </Link>
          </Stack>
        </Form>
      </Box>{' '}
    </Box>
  );
}
