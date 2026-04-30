import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {  useNavigate } from 'react-router-dom';

import { authApi } from '../../store/api/auth.api';

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword, confirmPassword }) => {
      console.log('RESET API CALLED', token);
      return authApi.resetPassword(token, {
        newPassword,
        confirmPassword,
      });
    },

    onSuccess: () => {
      toast.success('Password updated successfully');
      navigate('/auth/jwt/sign-in');
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Reset failed');
    },
  });
};
