import axios from 'axios';

import { ROLES } from 'src/config/roles';
import { isApiAllowedForRole } from 'src/config/roleApiMap';

import store from '../index';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // If request says skipAuth, do NOT attach token
    if (config.skipAuth) {
      delete config.headers?.Authorization;
      return config;
    }

    const state = store.getState();
    const token = state?.auth?.accessToken || localStorage.getItem('accessToken');

    // ─── RBAC: Check if this role is allowed to call this URL ───
    const userRole = state?.auth?.user?.role || ROLES.SUPER_ADMIN;
    const url = config.url || '';

    console.log(`[RBAC] User Role: "${userRole}" Target URL: "${url}"`);

    if (!isApiAllowedForRole(userRole, url)) {
      console.error(`[RBAC] Blocked: Role "${userRole}" is not allowed to call "${url}"`);
      // Block the request — do NOT let it reach the server
      return Promise.reject(
        Object.assign(new Error(`[RBAC] 403 Forbidden — "${userRole}" cannot access ${url}`), {
          status: 403,
          isRbacBlocked: true,
        })
      );
    }


    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
