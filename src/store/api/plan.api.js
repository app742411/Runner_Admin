import api from 'src/utils/axios';

export const planApi = {
  getAllPlans: (params) => api.get('/api/plan/getAllPlans', { params }),
  createPlan: (data) => api.post('/api/plan/create', data),
  togglePlanStatus: (id) => api.patch(`/api/plan/toggle-status/${id}`),
  deletePlan: (id) => api.delete(`/api/plan/delete/${id}`),
  purchasePlan: (data) => api.post('/api/plan/purchase-plan', data),
};
