import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { SimpleLayout } from 'src/layouts/simple';
import { LoadingScreen } from 'src/components/loading-screen';
import { useNavData } from 'src/layouts/dashboard/useNavData';

import AuthGuard from '../AuthGuard';
import SubscriptionGuard from '../../auth/guard/subscription-guard';

// ----------------------------------------------------------------------
// Lazy loaded pages
// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/dashboard/one'));
const PageTwo = lazy(() => import('src/pages/dashboard/two'));
const PageThree = lazy(() => import('src/pages/dashboard/three'));
const PageFour = lazy(() => import('src/pages/dashboard/four'));
const PageFive = lazy(() => import('src/pages/dashboard/five'));
const PageSix = lazy(() => import('src/pages/dashboard/six'));
const CompanyListPage = lazy(() => import('src/pages/dashboard/company/list'));
const CompanyOverviewPage = lazy(() => import('src/pages/dashboard/company/overview'));
const GroupListPage = lazy(() => import('src/pages/dashboard/group/list'));
const GroupOverviewPage = lazy(() => import('src/pages/dashboard/group/overview'));
const GroupNewPage = lazy(() => import('src/pages/dashboard/group/new'));
const GroupDetailsPage = lazy(() => import('src/pages/dashboard/group/details'));
const CompanyActivePage = lazy(() => import('src/pages/dashboard/company/active'));
const CompanyPendingPage = lazy(() => import('src/pages/dashboard/company/pending'));
const CompanyNewPage = lazy(() => import('src/pages/dashboard/company/new'));
const CompanyDetailsPage = lazy(() => import('src/pages/dashboard/company/details'));
const CompanyEditPage = lazy(() => import('src/pages/dashboard/company/edit'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const ContractListPage = lazy(() => import('src/pages/dashboard/contract/list'));
const ContractOverviewPage = lazy(() => import('src/pages/dashboard/contract/overview'));
const ContractNewPage = lazy(() => import('src/pages/dashboard/contract/new'));
const TaskListPage = lazy(() => import('src/pages/dashboard/task/list'));
const TaskDetailsPage = lazy(() => import('src/pages/dashboard/task/details'));
const ContractDetailsPage = lazy(() => import('src/pages/dashboard/contract/details'));
const EmployeeListPage = lazy(() => import('src/pages/dashboard/employee/list'));
const EmployeeDetailsPage = lazy(() => import('src/pages/dashboard/employee/details'));
const EmployeeNewPage = lazy(() => import('src/pages/dashboard/employee/new'));
const EmployeeEditPage = lazy(() => import('src/pages/dashboard/employee/edit'));
const SubscriptionListPage = lazy(() => import('src/pages/dashboard/subscription/list'));
const SubscriptionNewPage = lazy(() => import('src/pages/dashboard/subscription/new'));
const PropertyListPage = lazy(() => import('src/pages/dashboard/property/list'));
const ClientListPage = lazy(() => import('src/pages/dashboard/client/list'));
const DocumentListPage = lazy(() => import('src/pages/dashboard/document/list'));
const NotificationListPage = lazy(() => import('src/pages/dashboard/notification/list'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const SubscriptionSelectPage = lazy(() => import('src/pages/dashboard/subscription/select'));
const SubscriptionCheckoutPage = lazy(() => import('src/pages/dashboard/subscription/checkout'));
const ReportPage = lazy(() => import('src/pages/dashboard/report'));
const WorkReportListPage = lazy(() => import('src/pages/dashboard/report/work-reports'));
const WorkReportDetailsPage = lazy(() => import('src/pages/dashboard/report/work-report-details'));
const SettingsPage = lazy(() => import('src/pages/dashboard/settings'));
const CompanyAdminPage = lazy(() => import('src/pages/dashboard/company-admin'));
const EmployeeFinancePage = lazy(() => import('src/pages/dashboard/employee/finance'));
const EmployeeProfilePage = lazy(() => import('src/pages/dashboard/employee/profile'));
const SystemReportsPage = lazy(() => import('src/pages/dashboard/system-analytics/reports'));
const SystemExpensesPage = lazy(() => import('src/pages/dashboard/system-analytics/expenses'));
const UserActivityPage = lazy(() => import('src/pages/dashboard/system-analytics/activity'));
const SystemLogsPage = lazy(() => import('src/pages/dashboard/system-analytics/logs'));
const CustomReportsPage = lazy(() => import('src/pages/dashboard/system-analytics/custom'));
const EmployeeEditProfilePage = lazy(() => import('src/pages/dashboard/employee/edit-profile'));
const TemplateListPage = lazy(() => import('src/pages/dashboard/template/list'));
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const SupportListPage = lazy(() => import('src/pages/dashboard/support/list'));
const SupportNewPage = lazy(() => import('src/pages/dashboard/support/new'));
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const EmployeePaymentPage = lazy(() => import('src/pages/dashboard/finance/employee-payment'));
// ----------------------------------------------------------------------
// THIS IS THE KEY FIX: WRAPPER COMPONENT
// Hooks are allowed ONLY here
// ----------------------------------------------------------------------

function DashboardLayoutWrapper() {
  const nav = useNavData();

  return (
    <DashboardLayout data={{ nav }}>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </DashboardLayout>
  );
}

function SubscriptionLayoutWrapper() {
  return (
    <SimpleLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </SimpleLayout>
  );
}

// ----------------------------------------------------------------------
// Routes (NO hooks here )
// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? (
      <DashboardLayoutWrapper />
    ) : (
      <AuthGuard>
        <SubscriptionGuard>
          <DashboardLayoutWrapper />
        </SubscriptionGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'company',
        children: [
          { index: true, element: <CompanyOverviewPage /> },
          { path: 'overview', element: <CompanyOverviewPage /> },
          { path: 'list', element: <CompanyListPage /> },
          { path: 'active', element: <CompanyActivePage /> },
          { path: 'pending', element: <CompanyPendingPage /> },
          { path: 'new', element: <CompanyNewPage /> },
          { path: ':id', element: <CompanyDetailsPage /> },
          { path: ':id/edit', element: <CompanyEditPage /> },
        ],
      },
      {
        path: 'user',
        children: [{ index: true, element: <UserListPage /> }, { path: 'list', element: <UserListPage /> }],
      },
      {
        path: 'contract',
        children: [
          { index: true, element: <ContractOverviewPage /> },
          { path: 'overview', element: <ContractOverviewPage /> },
          { path: 'list', element: <ContractListPage /> },
          { path: 'new', element: <ContractNewPage /> },
          { path: 'details/:id', element: <ContractDetailsPage /> },
        ],
      },
      {
        path: 'group',
        children: [
          { index: true, element: <GroupOverviewPage /> },
          { path: 'overview', element: <GroupOverviewPage /> },
          { path: 'list', element: <GroupListPage /> },
          { path: 'new', element: <GroupNewPage /> },
          { path: 'details/:id', element: <GroupDetailsPage /> },
        ],
      },
      {
        path: 'task',
        children: [
          { index: true, element: <TaskListPage /> },
          { path: 'list', element: <TaskListPage /> },
          { path: 'details/:id', element: <TaskDetailsPage /> },
        ],
      },
      {
        path: 'employee',
        children: [
          { index: true, element: <EmployeeListPage /> },
          { path: 'list', element: <EmployeeListPage /> },
          { path: 'new', element: <EmployeeNewPage /> },
          { path: 'details/:id', element: <EmployeeDetailsPage /> },
          { path: ':id/edit', element: <EmployeeEditPage /> },
          { path: 'profile', element: <EmployeeProfilePage /> },
          { path: 'edit-profile', element: <EmployeeEditProfilePage /> },
        ],
      },
      {
        path: 'subscription',
        children: [
          { index: true, element: <SubscriptionListPage /> },
          { path: 'list', element: <SubscriptionListPage /> },
          { path: 'new', element: <SubscriptionNewPage /> },
        ],
      },
      {
        path: 'property',
        children: [
          { index: true, element: <PropertyListPage /> },
          { path: 'list', element: <PropertyListPage /> },
        ],
      },
      {
        path: 'client',
        children: [
          { index: true, element: <ClientListPage /> },
          { path: 'list', element: <ClientListPage /> },
        ],
      },
      {
        path: 'document',
        children: [
          { index: true, element: <DocumentListPage /> },
          { path: 'list', element: <DocumentListPage /> },
        ],
      },
      {
        path: 'notification',
        children: [
          { index: true, element: <NotificationListPage /> },
          { path: 'list', element: <NotificationListPage /> },
        ],
      },
      {
        path: 'mail',
        element: <MailPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'report',
        element: <ReportPage />,
      },
      {
        path: 'report/work-reports',
        element: <WorkReportListPage />,
      },
      {
        path: 'report/work-reports/:id',
        element: <WorkReportDetailsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'company-admin',
        element: <CompanyAdminPage />,
      },
      {
        path: 'finance',
        children: [
          { index: true, element: <EmployeeFinancePage /> },
          { path: 'employee-payment', element: <EmployeePaymentPage /> },
        ],
      },
      {
        path: 'template',
        children: [
          { index: true, element: <TemplateListPage /> },
          { path: 'list', element: <TemplateListPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: 'list', element: <InvoiceListPage /> },
          { path: 'details/:id', element: <InvoiceDetailsPage /> },
        ],
      },
      {
        path: 'support',
        children: [
          { index: true, element: <SupportListPage /> },
          { path: 'list', element: <SupportListPage /> },
          { path: 'new', element: <SupportNewPage /> },
        ],
      },
      {
        path: 'system-analytics',
        children: [
          { index: true, element: <SystemReportsPage /> },
          { path: 'reports', element: <SystemReportsPage /> },
          { path: 'expenses', element: <SystemExpensesPage /> },
          { path: 'activity', element: <UserActivityPage /> },
          { path: 'logs', element: <SystemLogsPage /> },
          { path: 'custom', element: <CustomReportsPage /> },
        ],
      },
    ],
  },
  {
    path: 'dashboard/subscription',
    element: (
      <AuthGuard>
        <SubscriptionLayoutWrapper />
      </AuthGuard>
    ),
    children: [
      { path: 'select', element: <SubscriptionSelectPage /> },
      { path: 'checkout', element: <SubscriptionCheckoutPage /> },
    ],
  },
];
