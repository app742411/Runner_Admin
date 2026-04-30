import api from './axios';

export const authApi = {
  login: async (payload) => {
    const res = await api.post('/api/auth/login', payload, { skipAuth: true });

    return {
      accessToken: res.data.token,
      user: res.data.user,
    };
  },

  getRole: async () => {
    const res = await api.get('/api/auth/getRole');
    return res.data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
  },

  forgotPassword: async (payload) => {
    const res = await api.post('/api/auth/forgot-password', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  resendOtp: async (payload) => {
    const res = await api.post('/api/auth/resendOtp', payload, {
      skipAuth: true,
    });
    return res.data;
  },

  verifyForgotOtp: async ({ id, code }) => {
    const res = await api.post(
      `/api/auth/forgot-verify-otp/${id}`,
      { otp: code },
      { skipAuth: true }
    );
    return res.data;
  },

  resetPassword: async (token, payload) => {
    const res = await api.post(`/api/auth/reset-password/${token}`, payload, { skipAuth: true });
    return res.data;
  },

  // CREATE COMPANY (ADMIN)
  createCompany: async ({ formData }) => {
    const res = await api.post('/api/admin/create-company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      skipAuth: true,
    });

    return res.data;
  },

  // SIGNUP COMPANY ADMIN (PUBLIC)
  signupCompanyAdmin: async ({ formData }) => {
    const res = await api.post('/api/auth/signup/company-admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      skipAuth: true,
    });

    return res.data;
  },
};

