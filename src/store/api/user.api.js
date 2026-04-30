import api from './axios';

export const userApi = {
  create: (data) => api.post('/users', data),

  list: (params) => api.get('/users', { params }),

  getAllUsers: (params) => api.get('/api/admin/getAllUsers', { params }),

  update: (id, data) => api.put(`/users/${id}`, data),

  delete: (id) => api.delete(`/users/${id}`),

  assignRole: (data) => api.post('/users/assign-role', data),
};
