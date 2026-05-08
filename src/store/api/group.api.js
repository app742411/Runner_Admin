import api from 'src/utils/axios';

export const groupApi = {
  // Company Admin
  getEligibleUsers: () => api.get('/api/group/eligible-users'),
  getEligibleUsersByCompany: (companyId) => api.get(`/api/admin/eligible-users/${companyId}`),
  getAvailableContracts: () => api.get('/api/group/getAvailableContracts'),
  getAvailableContractsByCompany: (companyId) => api.get(`/api/admin/getAvailableContracts/${companyId}`),
  getAvailableTasks: (contractId) => api.get(`/api/group/getAvailableTasks?contractId=${contractId}`),
  getAvailableTasksByCompany: (companyId, contractId) => api.get(`/api/admin/getAvailableTasks/${companyId}?contractId=${contractId}`),
  suggestMembers: (contractId) => api.get(`/api/group/suggestMembers?contractId=${contractId}`),
  suggestMembersByCompany: (companyId, contractId) => api.get(`/api/admin/suggestMembers/${companyId}?contractId=${contractId}`),
  getAllGroups: (params) => api.get('/api/group/getAllGroups', { params }),
  getAllGroupsSuperAdmin: (params) => api.get('/api/admin/getAllGroups', { params }),
  getGroupById: (id) => api.get(`/api/group/getGroupDetails/${id}`),
  getGroupByIdSuperAdmin: (id) => api.get(`/api/admin/getGroupDetails/${id}`),
  createGroup: (data) => api.post('/api/group/createGroup', data),
  createGroupSuperAdmin: (data) => api.post('/api/admin/createGroup', data),
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
