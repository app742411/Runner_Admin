import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { propertyApi } from 'src/store/api/property.api';

export function useProperties(params) {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'superAdmin';

  return useQuery({
    queryKey: ['properties', params, user?.role],
    queryFn: () => {
      const apiCall = isAdmin ? propertyApi.getAllPropertiesAdmin : propertyApi.getAllPropertiesCompany;
      return apiCall(params).then((res) => res.data);
    },
  });
}
