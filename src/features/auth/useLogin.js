import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

import { authApi } from '../../store/api/auth.api';
import { setAuth } from '../../store/auth/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: (data) => {
      dispatch(setAuth(data));
      toast.success('Login successful');
    },

    onError: (error) => {
      const message = error?.response?.data?.message || error?.message || 'Login failed';

      toast.error(message);
    },
  });
};
