import { createSlice } from '@reduxjs/toolkit';

import { ROLE_PERMISSIONS } from '../../config/rolePermissions';
import { ROLES } from '../../config/roles';

const persistedToken = localStorage.getItem('accessToken');
const persistedUser = localStorage.getItem('user');

const initialState = {
  isAuthenticated: !!persistedToken,
  accessToken: persistedToken || null,
  user: persistedUser ? JSON.parse(persistedUser) : null,
  permissions: persistedUser ? ROLE_PERMISSIONS[JSON.parse(persistedUser).role] || [] : [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { accessToken, user } = action.payload;

      //  Normalize role: elevation for Group Admins, otherwise retain Employee status
      if (user.role === ROLES.EMPLOYEE && user.isGroupAdmin === true) {
        user.role = ROLES.GROUP_ADMIN;
      }

      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.user = user;

      // persist to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      //  derive permissions from role
      state.permissions = ROLE_PERMISSIONS[user.role] || [];
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.user = null;
      state.permissions = [];

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
