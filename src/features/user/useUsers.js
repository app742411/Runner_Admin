import { useQuery } from '@tanstack/react-query';

import { userApi } from 'src/store/api';

export function useUsers(params) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.getAllUsers(params).then((res) => res.data),
  });
}
