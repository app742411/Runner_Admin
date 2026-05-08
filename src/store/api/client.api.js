import api from 'src/utils/axios';

export const clientApi = {
  // Super Admin
  getAllClientsAdmin: (params) => api.get('/api/admin/getAllClients', { params }),

  // Company Admin
  getAllClientsCompany: (params) => api.get('/api/company-admin/getAllClients', { params }),
};

