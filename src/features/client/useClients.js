import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { ROLES } from 'src/config/roles';
import { clientApi } from 'src/store/api/client.api';

export function useClients(params) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useQuery({
    queryKey: ['clients', params, role],
    queryFn: () => {
      if (role === ROLES.SUPER_ADMIN) {
        return clientApi.getAllClientsAdmin(params).then((res) => res.data);
      }
      return clientApi.getAllClientsCompany(params).then((res) => res.data);
    },
  });
}

