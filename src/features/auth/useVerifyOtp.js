import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../../store/api/auth.api';

export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.verifyForgotOtp,

    onSuccess: (data) => {
      const resetToken = data?.data;

      if (!resetToken) {
        toast.error('Invalid reset token from server');
        return;
      }

      sessionStorage.setItem('reset_token', resetToken);

      // redirect
      navigate(`/auth/jwt/update-password/${resetToken}`);
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Invalid or expired OTP');
    },
  });
};
