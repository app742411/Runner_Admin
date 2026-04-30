import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi } from 'src/store/api';

export function useTickets(params) {
  return useQuery({
    queryKey: ['tickets', params],
    queryFn: () => ticketApi.getTickets(params).then((res) => res.data),
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ticketApi.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useAssignableUsers() {
  return useQuery({
    queryKey: ['assignable-users'],
    queryFn: () => ticketApi.getAssignableUsers().then((res) => res.data),
  });
}

export function useAcceptTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }) => ticketApi.acceptTicket(ticketId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketApi.getTicketById(id).then((res) => res.data),
    enabled: !!id,
  });
}
