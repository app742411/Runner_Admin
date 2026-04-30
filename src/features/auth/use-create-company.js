import { useMutation } from '@tanstack/react-query';

import { authApi } from '../../store/api/auth.api';

export const useCreateCompany = () =>
  useMutation({
    mutationFn: authApi.signupCompanyAdmin,
  });
