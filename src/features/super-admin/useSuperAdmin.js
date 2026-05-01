import { useQuery } from '@tanstack/react-query';
import { superAdminApi } from 'src/store/api/super-admin.api';

export function useSuperAdminDashboard() {
  return useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: async () => {
      const response = await superAdminApi.getDashboard();
      return response.data;
    },
  });
}

