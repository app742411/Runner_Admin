import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.apiUrl || CONFIG.site.serverUrl });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt_access_token') || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: {
    list: '/api/chat/getChatList',
    messages: (chatId) => `/api/chat/getMessages/${chatId}`,
    send: '/api/chat/sendMessage',
    init: '/api/chat/initChat',
  },
  workReport: {
    list: '/api/company-admin/getAllWorkReports',
    details: (id) => `/api/company-admin/getWorkReportDetails/${id}`,
    approve: (id) => `/api/company-admin/approveWorkReport/${id}`,
    update: (id) => `/api/company-admin/updateWorkReport/${id}`,
  },
  companyAdmin: {
    dashboard: '/api/company-admin/getCompanyAdminDashboard',
    templates: '/api/company-admin/getTemplates',
    invoices: '/api/company-admin/getAllInvoices',
    invoiceDetails: (id) => `/api/company-admin/getInvoiceById/${id}`,
    sendInvoice: (id) => `/api/company-admin/sendInvoice/${id}`,
  },
  group: {
    eligibleUsers: '/api/group/eligible-users',
    availableContracts: '/api/group/getAvailableContracts',
    availableTasks: (contractId) => `/api/group/getAvailableTasks?contractId=${contractId}`,
    suggestMembers: (contractId) => `/api/group/suggestMembers?contractId=${contractId}`,
    list: '/api/group/getAllGroups',
    details: (id) => `/api/group/getGroupDetails/${id}`,
    create: '/api/group/createGroup',
    update: (id) => `/api/group/updateGroup/${id}`,
    delete: (id) => `/api/group/deleteGroup/${id}`,
    addMember: (id) => `/api/group/addGroupMember/${id}`,
    removeMember: (id) => `/api/group/removeGroupMember/${id}`,
    changeAdmin: (id) => `/api/group/changeGroupAdmin/${id}`,
    myGroups: '/api/group/getMyGroups',
    fullDetails: (id) => `/api/group/getGroupFullDetails/${id}`,
    dashboard: '/api/group/getGroupAdminDashboard',
    membersForAssign: (id) => `/api/group/getGroupMembersForAssign/${id}`,
    reviewWorkReport: (id) => `/api/group/reviewWorkReport/${id}`,
  },
  superAdmin: {
    dashboard: '/api/admin/getSuperAdminDashboard',
    employeePayments: '/api/admin/getEmployeePayments',
    documents: '/api/admin/getAllDocuments',
  },
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    getRole: '/api/auth/getRole',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
