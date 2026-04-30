import { Routes, Route, Navigate } from 'react-router-dom';

import PermissionRoute from './PermissionRoute';
import GuestGuard from './GuestGuard';

import { PERMISSIONS } from '@/constants/permissions';

import LoginPage from '@/pages/LoginPage';
import CompaniesPage from '@/pages/CompaniesPage';
import UsersPage from '@/pages/UsersPage';
import TasksPage from '@/pages/TasksPage';
import Forbidden from '@/pages/Forbidden';
import NotFound from '@/pages/NotFound';
import DashboardPage from '@/pages/DashboardPage';
import ForgetPasswordPage from '../pages/auth/forget-password';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ───────── Public ───────── */}
      <Route
        path="/login"
        element={
          <GuestGuard>
            <LoginPage />
          </GuestGuard>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestGuard>
            <ForgetPasswordPage />
          </GuestGuard>
        }
      />

      {/* ───────── Dashboard Redirect ───────── */}
      <Route
        path="/dashboard"
        element={
          <PermissionRoute permission={PERMISSIONS.DASHBOARD_VIEW}>
            <DashboardPage />
          </PermissionRoute>
        }
      />

      {/* ───────── Companies ───────── */}
      <Route
        path="/companies"
        element={
          <PermissionRoute permission={PERMISSIONS.COMPANY_VIEW}>
            <CompaniesPage />
          </PermissionRoute>
        }
      />

      {/* ───────── Users ───────── */}
      <Route
        path="/users"
        element={
          <PermissionRoute permission={PERMISSIONS.USER_VIEW}>
            <UsersPage />
          </PermissionRoute>
        }
      />

      {/* ───────── Tasks ───────── */}
      <Route
        path="/tasks"
        element={
          <PermissionRoute permission={PERMISSIONS.TASK_VIEW}>
            <TasksPage />
          </PermissionRoute>
        }
      />

      {/* ───────── Utility ───────── */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
