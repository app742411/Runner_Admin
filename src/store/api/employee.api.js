import api from './axios';

export const employeeApi = {
  // Super Admin
  getAllEmployeesAdmin: (params) => api.get('/api/admin/runner-employees', { params }),
  getEmployeeByIdAdmin: (id) => api.get(`/api/admin/runner-employee/${id}`),
  createEmployeeAdmin: (data) => api.post('/api/admin/create-runner-employee', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateEmployeeAdmin: (id, data) => api.put(`/api/admin/runner-employee-update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteEmployeeAdmin: (id) => api.delete(`/api/admin/runner-employee-delete/${id}`),

  // Company Admin
  getAllEmployeesCompany: (params) => api.get('/api/employee/getAllEmployees', { params }),
  getEmployeeByIdCompany: (id) => api.get(`/api/employee/getEmployeeById/${id}`),
  createEmployeeCompany: (data) => api.post('/api/employee/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateEmployeeCompany: (id, data) => api.put(`/api/employee/update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteEmployeeCompany: (id) => api.delete(`/api/employee/delete/${id}`),

  // Employee
  getEmployeeDashboard: () => api.get('/api/employee/getEmployeeDashboard'),
  getEmployeeFinancial: () => api.get('/api/employee/getEmployeeFinancial'),
  getProfile: () => api.get('/api/employee/getProfile'),
  updateProfile: (data) => api.put('/api/employee/updateEmployeeProfile', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

