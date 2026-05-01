import { useQuery } from '@tanstack/react-query';
import { superAdminApi } from 'src/store/api/super-admin.api';

export function useDocuments(params) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => superAdminApi.getAllDocuments(params).then((res) => res.data),
  });
}
