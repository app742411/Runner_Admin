import { useQuery } from '@tanstack/react-query';
import { companyAdminApi } from 'src/store/api/company-admin.api';

export function useCompanyAdminDashboard() {
  return useQuery({
    queryKey: ['company-admin-dashboard'],
    queryFn: async () => {
      const response = await companyAdminApi.getDashboard();
      return response.data;
    },
  });
}
