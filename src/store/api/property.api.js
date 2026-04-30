import api from './axios';

export const propertyApi = {
  // Super Admin
  getAllPropertiesAdmin: (params) => api.get('/api/admin/getAllProperties', { params }),

  // Company Admin  
  getAllPropertiesCompany: (params) => api.get('/api/company-admin/getAllProperties', { params }),
};
