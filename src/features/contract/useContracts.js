import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ROLES } from 'src/config/roles';
import { contractApi } from 'src/store/api';

export function useContracts(params) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useQuery({
    queryKey: ['contracts', params, role],
    queryFn: () => {
      if (role === ROLES.SUPER_ADMIN) {
        return contractApi.getAllContractsAdmin(params).then((res) => res.data);
      }
      return contractApi.getAllContractsCompany(params).then((res) => res.data);
    },
  });
}


export function useCreateContract() {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useMutation({
    mutationFn: (data) => {
      if (role === ROLES.SUPER_ADMIN) {
        return contractApi.createContractAdmin(data);
      }
      return contractApi.createContractCompany(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useContract(id) {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role;

  return useQuery({
    queryKey: ['contract', id, role],
    queryFn: () => {
      if (role === ROLES.SUPER_ADMIN) {
        return contractApi.getContractByIdAdmin(id).then((res) => res.data);
      }
      return contractApi.getContractByIdCompany(id).then((res) => res.data);
    },
    enabled: !!id,
  });
}

