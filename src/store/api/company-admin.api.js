import api from 'src/utils/axios';

export const companyAdminApi = {
  getDashboard: () => api.get('/api/company-admin/getCompanyAdminDashboard'),
  getTemplates: () => api.get('/api/company-admin/getTemplates'),
  getAllWorkReports: (params) => api.get('/api/company-admin/getAllWorkReports', { params }),
  getWorkReportDetails: (id) => api.get(`/api/company-admin/getWorkReportDetails/${id}`),
  approveWorkReport: (id) => api.patch(`/api/company-admin/approveWorkReport/${id}`),
  getAllInvoices: (params) => api.get('/api/company-admin/getAllInvoices', { params }),
  sendInvoice: (id) => api.patch(`/api/company-admin/sendInvoice/${id}`),
  getInvoiceById: (id) => api.get(`/api/company-admin/getInvoiceById/${id}`),
  updateWorkReport: (id, data) => api.put(`/api/company-admin/updateWorkReport/${id}`, data),
  updateExpenseStatus: (subTaskId, expenseId, data) => api.patch(`/api/company-admin/updateExpenseStatus/${subTaskId}/${expenseId}`, data),
};
