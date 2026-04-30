import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { companyApi } from 'src/store/api';

export function useUpdateCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isApproved }) => companyApi.updateStatus(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['active-companies']);
      queryClient.invalidateQueries(['pending-companies']);
    },
  });
}


export function useCompanies(params) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companyApi.list(params).then((res) => res.data),
  });
}

export function useActiveCompanies(params) {
  return useQuery({
    queryKey: ['active-companies', params],
    queryFn: () => companyApi.activeList(params).then((res) => res.data),
  });
}

export function usePendingCompanies(params) {
  return useQuery({
    queryKey: ['pending-companies', params],
    queryFn: () => companyApi.pendingList(params).then((res) => res.data),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => companyApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
    },
  });
}

export function useCompanyDetails(id) {
  return useQuery({
    queryKey: ['company-details', id],
    queryFn: () => companyApi.getDetails(id).then((res) => res.data.data),
    enabled: !!id,
  });
}
export function useAllCompanies() {
  return useQuery({
    queryKey: ['all-companies'],
    queryFn: () => companyApi.getCompanies().then((res) => res.data),
  });
}
