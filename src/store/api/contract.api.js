import api from './axios';

export const contractApi = {
   // Super Admin
   getAllContractsAdmin: (params) => api.get('/api/admin/getAllContracts', { params }),
   getContractByIdAdmin: (id) => api.get(`/api/admin/getContractById/${id}`),
   
   // Company Admin
   getAllContractsCompany: (params) => api.get('/api/contract/getAllContracts', { params }),
   getContractByIdCompany: (id) => api.get(`/api/contract/getContractById/${id}`),

   createContractAdmin: (data) => api.post('/api/admin/createContract', data, {
     headers: { 'Content-Type': 'multipart/form-data' },
   }),

   createContractCompany: (data) => api.post('/api/contract/createContract', data, {
     headers: { 'Content-Type': 'multipart/form-data' },
   }),
 };


