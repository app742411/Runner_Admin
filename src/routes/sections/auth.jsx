import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthSplitLayout } from 'src/layouts/auth-split';
import { AuthCenteredLayout } from 'src/layouts/auth-split/layoutCentered';

import { SplashScreen } from 'src/components/loading-screen';

import GuestGuard from 'src/routes/GuestGuard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/sign-up')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/reset-password')),
  VerifyOTPPage: lazy(() => import('src/pages/auth/verify')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/update-password')),
  AddCompanyPage: lazy(() => import('src/pages/auth/AddCompany')),
};

const authJwt = {
  path: 'jwt',
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>
            <Jwt.SignInPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'sign-up',
      element: (
        <GuestGuard>
          <AuthSplitLayout>
            <Jwt.SignUpPage />
          </AuthSplitLayout>
        </GuestGuard>
      ),
    },
    {
      path: 'forgot-password',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.ResetPasswordPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },

    {
      path: 'verify-otp',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.VerifyOTPPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },

    {
      path: 'update-password/:token',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.UpdatePasswordPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },

    {
      path: 'add-company',
      element: (
        <GuestGuard>
          <AuthCenteredLayout>
            <Jwt.AddCompanyPage />
          </AuthCenteredLayout>
        </GuestGuard>
      ),
    },
  ],
};

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authJwt],
  },
];
