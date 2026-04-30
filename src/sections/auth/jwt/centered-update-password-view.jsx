import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';

import { SentIcon } from 'src/assets/icons';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { useParams, Navigate } from 'react-router-dom';
import { useResetPassword } from '../../../features/auth/useResetPassword';

// ----------------------------------------------------------------------
// FIXED SCHEMA (only required fields)
// ----------------------------------------------------------------------

export const UpdatePasswordSchema = zod
  .object({
    password: zod.string().min(6, { message: 'Password must be at least 6 characters!' }),
    confirmPassword: zod.string().min(1, { message: 'Confirm password is required!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const { token } = useParams();
  const password = useBoolean();

  const methods = useForm({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  // React Query hook
  const { mutate, isPending } = useResetPassword();

  if (!token) {
    return <Navigate to="/auth/jwt/sign-in" replace />;
  }

  const onSubmit = handleSubmit((data) => {
    mutate({
      token,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    });
  });

  return (
    <Box>
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
            mb: 5,
            textAlign: 'center',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            maxWidth: 680,
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
          <SentIcon sx={{ mx: 'auto' }} />

          <Stack spacing={1} sx={{ mt: 3, mb: 5, textAlign: 'center' }}>
            <Typography variant="h5">Set new password</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Please enter your new password below.
            </Typography>
          </Stack>

          {/* Form */}
          <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
              <Field.Text
                name="password"
                label="New password"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Field.Text
                name="confirmPassword"
                label="Confirm new password"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
              />

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isPending}
                loadingIndicator="Updating..."
              >
                Update password
              </LoadingButton>

              {/* Back to sign in */}
              <Link
                component={RouterLink}
                to="/auth/jwt/sign-in"
                color="inherit"
                variant="subtitle2"
                sx={{ mx: 'auto', display: 'inline-flex', alignItems: 'center' }}
              >
                <Iconify icon="eva:arrow-ios-back-fill" width={16} sx={{ mr: 0.5 }} />
                Return to sign in
              </Link>
            </Stack>
          </Form>
        </Box>{' '}
      </Box>
    </Box>
  );
}
