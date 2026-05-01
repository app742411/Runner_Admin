import { endpoints } from 'src/utils/axios';
import api from './axios';

export const superAdminApi = {
  getDashboard: () => api.get(endpoints.superAdmin.dashboard),
  getAllDocuments: (params) => api.get(endpoints.superAdmin.documents, { params }),
};
