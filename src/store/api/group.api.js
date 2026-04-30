import api from './axios';

export const groupApi = {
  // Company Admin
  getEligibleUsers: () => api.get('/api/group/eligible-users'),
  getAvailableContracts: () => api.get('/api/group/getAvailableContracts'),
  getAvailableTasks: (contractId) => api.get(`/api/group/getAvailableTasks?contractId=${contractId}`),
  suggestMembers: (contractId) => api.get(`/api/group/suggestMembers?contractId=${contractId}`),
  getAllGroups: (params) => api.get('/api/group/getAllGroups', { params }),
  getGroupById: (id) => api.get(`/api/group/getGroupDetails/${id}`),
  createGroup: (data) => api.post('/api/group/createGroup', data),
  updateGroup: (id, data) => api.put(`/api/group/updateGroup/${id}`, data),
  deleteGroup: (id) => api.delete(`/api/group/deleteGroup/${id}`),
  addGroupMember: (groupId, userIds) => api.patch(`/api/group/addGroupMember/${groupId}`, { userId: userIds }),
  removeGroupMember: (groupId, userIds) => api.patch(`/api/group/removeGroupMember/${groupId}`, { userId: userIds }),
  changeGroupAdmin: (groupId, newAdminId) => api.patch(`/api/group/changeGroupAdmin/${groupId}`, { newAdminId }),
  getMyGroups: (params) => api.get('/api/group/getMyGroups', { params }),
  getGroupFullDetails: (id) => api.get(`/api/group/getGroupFullDetails/${id}`),
  getGroupAdminDashboard: () => api.get('/api/group/getGroupAdminDashboard'),
  getGroupMembersForAssign: (groupId) => api.get(`/api/group/getGroupMembersForAssign/${groupId}`),
  reviewWorkReport: (id) => api.patch(`/api/group/reviewWorkReport/${id}`),
};
