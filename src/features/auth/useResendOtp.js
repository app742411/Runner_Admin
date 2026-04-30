import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../../store/api/auth.api';

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authApi.resendOtp,

    onSuccess: () => {
      toast.success('OTP resent successfully');
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || 'Failed to resend OTP'
      );
    },
  });
};
