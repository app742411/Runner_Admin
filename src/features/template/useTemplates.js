import { useQuery } from '@tanstack/react-query';
import { companyAdminApi } from 'src/store/api/company-admin.api';

// ----------------------------------------------------------------------

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => companyAdminApi.getTemplates().then((res) => res.data),
  });
}
