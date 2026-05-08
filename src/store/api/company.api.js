import api from 'src/utils/axios';

export const companyApi = {
  list: (params) => api.get('/api/admin/list-company', { params }),

  activeList: (params) => api.get('/api/admin/active-subscription-companies', { params }),

  pendingList: (params) => api.get('/api/admin/pending-subscription-companies', { params }),

  create: (data) => api.post('/api/admin/create-company', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  getDetails: (id) => api.get(`/api/admin/companies/${id}`),
  update: (id, data) => api.put(`/api/admin/companies/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateStatus: (id, isApproved) => api.put(`/api/admin/updateCompanyStatus/${id}`, { isApproved }),
  getCompanies: () => api.get('/api/admin/getCompanies'),
};
