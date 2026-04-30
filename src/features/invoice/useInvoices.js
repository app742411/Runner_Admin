import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyAdminApi } from 'src/store/api/company-admin.api';

export function useInvoices(params) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => companyAdminApi.getAllInvoices(params).then((res) => res.data),
  });
}

export function useSendInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => companyAdminApi.sendInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => companyAdminApi.getInvoiceById(id).then((res) => res.data.data),
    enabled: !!id,
  });
}
