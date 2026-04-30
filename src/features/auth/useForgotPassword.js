import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../../store/api/auth.api';

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.forgotPassword,

    onSuccess: (data, variables) => {
      const id = data?.data;

      if (!id) {
        toast.error('Invalid server response');
        return;
      }

      // STORE BOTH
      sessionStorage.setItem('fp_id', id);
      sessionStorage.setItem('fp_email', variables.email);

      toast.success('OTP sent to your email');
      navigate('/auth/jwt/verify-otp');
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Email not found');
    },
  });
};
