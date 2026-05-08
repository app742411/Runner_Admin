import axios from 'axios';

import { CONFIG } from 'src/config-global';
import { ROLES } from 'src/config/roles';
import { isApiAllowedForRole } from 'src/config/roleApiMap';
import store from 'src/store';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: CONFIG.site.apiUrl || CONFIG.site.serverUrl,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.skipAuth) {
      delete config.headers?.Authorization;
      return config;
    }

    let token = null;
    let userRole = ROLES.SUPER_ADMIN;

    try {
      const state = store.getState();
      token = state?.auth?.accessToken;
      userRole = state?.auth?.user?.role || ROLES.SUPER_ADMIN;
    } catch (e) {
      // fallback if store is not fully initialized
    }

    if (!token) {
      token = sessionStorage.getItem('jwt_access_token') || localStorage.getItem('accessToken');
    }

    const url = config.url || '';
    console.log(`[RBAC] User Role: "${userRole}" Target URL: "${url}"`);

    if (!isApiAllowedForRole(userRole, url)) {
      console.error(`[RBAC] Blocked: Role "${userRole}" is not allowed to call "${url}"`);
      return Promise.reject(
        Object.assign(new Error(`[RBAC] 403 Forbidden — "${userRole}" cannot access ${url}`), {
          status: 403,
          isRbacBlocked: true,
        })
      );
    }

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
