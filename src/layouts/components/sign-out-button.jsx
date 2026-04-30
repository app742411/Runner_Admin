import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';
import { authApi } from 'src/store/api/auth.api';
import { clearAuth } from 'src/store/auth/authSlice';

export function SignOutButton({ onClose, ...other }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      // 1️⃣ Call backend logout (optional)
      await authApi.logout();
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      // 2️⃣ Clear redux auth state
      dispatch(clearAuth());

      // 3️⃣ Clear storage tokens (VERY IMPORTANT)
      localStorage.removeItem('accessToken');
      sessionStorage.clear();

      // 4️⃣ Close menu
      onClose?.();

      // 5️⃣ Redirect to login
      router.push('/auth/jwt/sign-in');
    }
  }, [dispatch, onClose, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="error" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
