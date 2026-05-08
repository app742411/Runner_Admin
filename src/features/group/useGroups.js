import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { ROLES } from 'src/config/roles';
import { groupApi } from 'src/store/api/group.api';

// ----------------------------------------------------------------------

export function useEligibleUsers(arg) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const companyId = typeof arg === 'string' ? arg : arg?.companyId;
  const options = typeof arg === 'object' && arg !== null ? arg : {};

  return useQuery({
    queryKey: ['eligible-users', companyId],
    queryFn: () => {
      if (isSuperAdmin) {
        if (!companyId) return [];
        return groupApi.getEligibleUsersByCompany(companyId).then((res) => {
          const data = res.data?.data || res.data;
          return Array.isArray(data) ? data : [];
        });
      }
      return groupApi.getEligibleUsers().then((res) => {
        const data = res.data?.data || res.data;
        return Array.isArray(data) ? data : [];
      });
    },
    enabled: isSuperAdmin ? !!companyId : true,
    ...options,
  });
}

export function useAvailableContracts(arg) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const companyId = typeof arg === 'string' ? arg : arg?.companyId;
  const options = typeof arg === 'object' && arg !== null ? arg : {};

  return useQuery({
    queryKey: ['available-contracts', companyId],
    queryFn: () => {
      if (isSuperAdmin) {
        if (!companyId) return [];
        return groupApi.getAvailableContractsByCompany(companyId).then((res) => {
          const data = res.data?.data || res.data;
          return Array.isArray(data) ? data : (data?.contracts || []);
        });
      }
      return groupApi.getAvailableContracts().then((res) => {
        const data = res.data?.data || res.data;
        return Array.isArray(data) ? data : (data?.contracts || []);
      });
    },
    enabled: isSuperAdmin ? !!companyId : true,
    ...options,
  });
}

export function useAvailableTasks(contractIds, companyId) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const ids = Array.isArray(contractIds) ? contractIds.join(',') : contractIds;
  return useQuery({
    queryKey: ['available-tasks', ids, companyId],
    queryFn: () => {
      if (isSuperAdmin) {
        if (!companyId || !ids || ids.length === 0) return [];
        return groupApi.getAvailableTasksByCompany(companyId, ids).then((res) => {
          const data = res.data?.data || res.data;
          return Array.isArray(data) ? data : [];
        });
      }
      return groupApi.getAvailableTasks(ids).then((res) => {
        const data = res.data?.data || res.data;
        return Array.isArray(data) ? data : [];
      });
    },
    enabled: isSuperAdmin ? (!!ids && ids.length > 0 && !!companyId) : (!!ids && ids.length > 0),
  });
}

export function useSuggestMembers(contractIds, companyId) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  const ids = Array.isArray(contractIds) ? contractIds.join(',') : contractIds;
  return useQuery({
    queryKey: ['suggest-members', ids, companyId],
    queryFn: () => {
      if (isSuperAdmin) {
        if (!companyId || !ids || ids.length === 0) return [];
        return groupApi.suggestMembersByCompany(companyId, ids).then((res) => {
          const data = res.data?.data || res.data;
          return Array.isArray(data) ? data : [];
        });
      }
      return groupApi.suggestMembers(ids).then((res) => {
        const data = res.data?.data || res.data;
        return Array.isArray(data) ? data : [];
      });
    },
    enabled: isSuperAdmin ? (!!ids && ids.length > 0 && !!companyId) : (!!ids && ids.length > 0),
  });
}

export function useGroups(params) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  return useQuery({
    queryKey: ['groups', params],
    queryFn: () => {
      if (isSuperAdmin) {
        return groupApi.getAllGroupsSuperAdmin(params).then((res) => res.data);
      }
      return groupApi.getAllGroups(params).then((res) => res.data);
    },
  });
}

export function useGroup(id, options = {}) {
  const user = useSelector((state) => state.auth.user);
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

  return useQuery({
    queryKey: ['group', id],
    queryFn: () => {
      if (isSuperAdmin) {
        return groupApi.getGroupByIdSuperAdmin(id).then((res) => res.data.data);
      }
      return groupApi.getGroupById(id).then((res) => res.data.data);
    },
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
