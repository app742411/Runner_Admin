import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { groupApi } from 'src/store/api/group.api';

// ----------------------------------------------------------------------

export function useEligibleUsers() {
  return useQuery({
    queryKey: ['eligible-users'],
    queryFn: () => groupApi.getEligibleUsers().then((res) => {
      const data = res.data?.data || res.data;
      return Array.isArray(data) ? data : [];
    }),
  });
}

export function useAvailableContracts() {
  return useQuery({
    queryKey: ['available-contracts'],
    queryFn: () => groupApi.getAvailableContracts().then((res) => {
      const data = res.data?.data || res.data;
      return Array.isArray(data) ? data : (data?.contracts || []);
    }),
  });
}

export function useAvailableTasks(contractIds) {
  const ids = Array.isArray(contractIds) ? contractIds.join(',') : contractIds;
  return useQuery({
    queryKey: ['available-tasks', ids],
    queryFn: () => groupApi.getAvailableTasks(ids).then((res) => {
      const data = res.data?.data || res.data;
      return Array.isArray(data) ? data : [];
    }),
    enabled: !!ids && ids.length > 0,
  });
}

export function useSuggestMembers(contractIds) {
  const ids = Array.isArray(contractIds) ? contractIds.join(',') : contractIds;
  return useQuery({
    queryKey: ['suggest-members', ids],
    queryFn: () => groupApi.suggestMembers(ids).then((res) => {
      const data = res.data?.data || res.data;
      return Array.isArray(data) ? data : [];
    }),
    enabled: !!ids && ids.length > 0,
  });
}

export function useGroups(params) {
  return useQuery({
    queryKey: ['groups', params],
    queryFn: () => groupApi.getAllGroups(params).then((res) => res.data),
  });
}

export function useGroup(id, options = {}) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => groupApi.getGroupById(id).then((res) => res.data.data),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => groupApi.updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['group']);
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => groupApi.deleteGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['my-groups']);
    },
  });
}

export function useAddGroupMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userIds }) => groupApi.addGroupMember(groupId, userIds),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries(['group', groupId]);
      queryClient.invalidateQueries(['group-full-details', groupId]);
    },
  });
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userIds }) => groupApi.removeGroupMember(groupId, userIds),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries(['group', groupId]);
      queryClient.invalidateQueries(['group-full-details', groupId]);
    },
  });
}

export function useChangeGroupAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, newAdminId }) => groupApi.changeGroupAdmin(groupId, newAdminId),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries(['group', groupId]);
      queryClient.invalidateQueries(['group-full-details', groupId]);
    },
  });
}

export function useMyGroups(params) {
  return useQuery({
    queryKey: ['my-groups', params],
    queryFn: () => groupApi.getMyGroups(params).then((res) => res.data),
  });
}

export function useGroupFullDetails(id, options = {}) {
  return useQuery({
    queryKey: ['group-full-details', id],
    queryFn: () => groupApi.getGroupFullDetails(id).then((res) => res.data.data),
    enabled: !!id,
    ...options,
  });
}

export function useGroupAdminDashboard() {
  return useQuery({
    queryKey: ['group-admin-dashboard'],
    queryFn: () => groupApi.getGroupAdminDashboard().then((res) => res.data.data),
  });
}

export function useGroupMembersForAssign(groupId) {
  return useQuery({
    queryKey: ['group-members-assign', groupId],
    queryFn: () => groupApi.getGroupMembersForAssign(groupId).then((res) => res.data.data),
    enabled: !!groupId,
  });
}
