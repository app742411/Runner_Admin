import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyAdminApi } from 'src/store/api/company-admin.api';
import { groupApi } from 'src/store/api/group.api';

export function useWorkReports(params) {
  return useQuery({
    queryKey: ['workReports', params],
    queryFn: () => companyAdminApi.getAllWorkReports(params).then((res) => res.data),
  });
}

export function useWorkReportDetails(id) {
  return useQuery({
    queryKey: ['workReport', id],
    queryFn: () => companyAdminApi.getWorkReportDetails(id).then((res) => res.data),
    enabled: !!id,
  });
}

export function useApproveWorkReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => companyAdminApi.approveWorkReport(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['workReports'] });
      queryClient.invalidateQueries({ queryKey: ['workReport', id] });
    },
  });
}

export function useUpdateWorkReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => companyAdminApi.updateWorkReport(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['workReports'] });
      queryClient.invalidateQueries({ queryKey: ['workReport', id] });
    },
  });
}

export function useReviewWorkReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => groupApi.reviewWorkReport(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['workReports'] });
      queryClient.invalidateQueries({ queryKey: ['workReport', id] });
    },
  });
}
