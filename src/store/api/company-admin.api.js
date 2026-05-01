import { endpoints } from 'src/utils/axios';
import api from './axios';

export const companyAdminApi = {
  getDashboard: () => api.get(endpoints.companyAdmin.dashboard),
  getTemplates: () => api.get(endpoints.companyAdmin.templates),
  getAllWorkReports: (params) => api.get(endpoints.workReport.list, { params }),
  getWorkReportDetails: (id) => api.get(endpoints.workReport.details(id)),
  approveWorkReport: (id) => api.patch(endpoints.workReport.approve(id)),
  getAllInvoices: (params) => api.get(endpoints.companyAdmin.invoices, { params }),
  sendInvoice: (id) => api.patch(endpoints.companyAdmin.sendInvoice(id)),
  getInvoiceById: (id) => api.get(endpoints.companyAdmin.invoiceDetails(id)),
  updateWorkReport: (id, data) => api.put(endpoints.workReport.update(id), data),
};
