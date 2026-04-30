import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { planApi } from 'src/store/api/plan.api';

export function usePlans(params) {
  return useQuery({
    queryKey: ['plans', params],
    queryFn: () => planApi.getAllPlans(params).then((res) => res.data),
  });
}

export function useTogglePlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => planApi.togglePlanStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => planApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
  });
}

export function usePurchasePlan() {
  return useMutation({
    mutationFn: (data) => planApi.purchasePlan(data),
  });
}
