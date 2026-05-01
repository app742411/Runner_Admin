import { endpoints } from 'src/utils/axios';
import api from './axios';

export const groupApi = {
  // Company Admin
  getEligibleUsers: () => api.get(endpoints.group.eligibleUsers),
  getAvailableContracts: () => api.get(endpoints.group.availableContracts),
  getAvailableTasks: (contractId) => api.get(endpoints.group.availableTasks(contractId)),
  suggestMembers: (contractId) => api.get(endpoints.group.suggestMembers(contractId)),
  getAllGroups: (params) => api.get(endpoints.group.list, { params }),
  getGroupById: (id) => api.get(endpoints.group.details(id)),
  createGroup: (data) => api.post(endpoints.group.create, data),
  updateGroup: (id, data) => api.put(endpoints.group.update(id), data),
  deleteGroup: (id) => api.delete(endpoints.group.delete(id)),
  addGroupMember: (groupId, userIds) => api.patch(endpoints.group.addMember(groupId), { userId: userIds }),
  removeGroupMember: (groupId, userIds) => api.patch(endpoints.group.removeMember(groupId), { userId: userIds }),
  changeGroupAdmin: (groupId, newAdminId) => api.patch(endpoints.group.changeAdmin(groupId), { newAdminId }),
  getMyGroups: (params) => api.get(endpoints.group.myGroups, { params }),
  getGroupFullDetails: (id) => api.get(endpoints.group.fullDetails(id)),
  getGroupAdminDashboard: () => api.get(endpoints.group.dashboard),
  getGroupMembersForAssign: (groupId) => api.get(endpoints.group.membersForAssign(groupId)),
  reviewWorkReport: (id) => api.patch(endpoints.group.reviewWorkReport(id)),
};
