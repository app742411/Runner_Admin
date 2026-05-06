import api from './axios';

export const taskApi = {
  getAllTasksAdmin: (params) => api.get('/api/admin/getAllTask', { params }),
  getAllTasksCompany: (params) => api.get('/api/task/getAllTasks', { params }),
  getTaskById: (id) => api.get(`/api/admin/getTask/${id}`),
  getEmployeeForAssign: (id) => api.get(`/api/admin/getEmployeeForAssign/${id}`),
  assignUsers: (subTaskId, data) => api.put(`/api/admin/assignUsers/${subTaskId}`, data),
  removeUsers: (subTaskId, userIds) => api.put(`/api/admin/removeUsers/${subTaskId}`, { userIds }),
  deleteTaskAdmin: (id) => api.delete(`/api/task/delete/${id}`),
  getMySubTasks: (params) => api.get('/api/employee/getMySubTasks', { params }),
  startTimer: (subTaskId) => api.patch(`/api/employee/startSubTaskTimer/${subTaskId}`),
  stopTimer: (subTaskId) => api.patch(`/api/employee/stopSubTaskTimer/${subTaskId}`),

  // uploadBeforeImage: (subTaskId, formData) => api.patch(`/api/employee/uploadBeforeWorkImage/${subTaskId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  // uploadAfterImage: (subTaskId, formData) => api.patch(`/api/employee/uploadAfterWorkImage/${subTaskId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  uploadBeforeImage: (subTaskId, formData) => api.patch(`/api/employee/uploadBeforeWorkImage/${subTaskId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadAfterImage: (subTaskId, formData) => api.patch(`/api/employee/uploadAfterWorkImage/${subTaskId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getGroupMembersForAssign: (groupId) => api.get(`/api/group/getGroupMembersForAssign/${groupId}`),
  addComment: (subTaskId, text) => api.patch(`/api/employee/addComment/${subTaskId}`, { text }),
  addReply: (subTaskId, commentId, text) => api.patch(`/api/employee/addReply/${subTaskId}/${commentId}`, { text }),
};

