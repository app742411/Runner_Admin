import api from 'src/utils/axios';

export const superAdminApi = {
  getDashboard: () => api.get('/api/admin/getSuperAdminDashboard'),
  getAllDocuments: (params) => api.get('/api/admin/getAllDocuments', { params }),
};
