import { paths } from '../routes/paths';
import { APP_ICONS } from '../config/appIcons';

const navData = [
  // OVERVIEW
  {
    subheader: 'nav.overview',
    items: [
      {
        id: 'Dashboard',
        title: 'nav.dashboard',
        path: paths.dashboard.root,
        icon: APP_ICONS.dashboard,
        permission: 'dashboard.view',
      },
    ],
  },

  // ORGANIZATION
  {
    subheader: 'nav.organization',
    items: [
      {
        id: 'Company',
        title: 'nav.company',
        path: paths.dashboard.company.overview,
        icon: APP_ICONS.company,
        permission: 'company.view',
        children: [
          { id: 'company_overview', title: 'nav.company_overview', path: paths.dashboard.company.overview },
          { id: 'create_company', title: 'nav.company_create', path: paths.dashboard.company.new },
          { id: 'company_list', title: 'nav.company_list', path: paths.dashboard.company.list },
          { id: 'active_company', title: 'nav.company_active', path: paths.dashboard.company.active },
          { id: 'pending_company', title: 'nav.company_pending', path: paths.dashboard.company.pending },
        ],
      },
      {
        id: 'Property List',
        title: 'nav.properties',
        path: paths.dashboard.property.list,
        icon: APP_ICONS.company,
        permission: 'property.view',
      },
      {
        id: 'Contract',
        title: 'nav.contract',
        path: paths.dashboard.contract.root,
        icon: APP_ICONS.contract,
        permission: 'contract.view',
        children: [
          { id: 'contract_overview', title: 'nav.contract_overview', path: paths.dashboard.contract.overview },
          { id: 'create_contract', title: 'nav.contract_create', path: paths.dashboard.contract.new },
          { id: 'all_contract', title: 'nav.contract_all', path: paths.dashboard.contract.all },
          { id: 'pending_contract', title: 'nav.contract_pending', path: paths.dashboard.contract.pending },
          { id: 'in_progress_contract', title: 'nav.contract_in_progress', path: paths.dashboard.contract.inProgress },
          { id: 'completed_contract', title: 'nav.contract_completed', path: paths.dashboard.contract.completed },
          { id: 'rejected_cancelled_contract', title: 'nav.contract_rejected_cancelled', path: paths.dashboard.contract.rejected },
        ],
      },
      {
        id: 'Subscription',
        title: 'nav.subscription',
        path: paths.dashboard.subscription.root,
        icon: APP_ICONS.subscription,
        permission: 'subscription.view',
        children: [
          { id: 'add_subscription', title: 'nav.subscription_add', path: paths.dashboard.subscription.new },
          { id: 'subscription_list', title: 'nav.subscription_list', path: paths.dashboard.subscription.list },
        ],
      },
    ],
  },

  // PEOPLE MANAGEMENT
  {
    subheader: 'nav.people_management',
    items: [
      {
        id: 'Client',
        title: 'nav.client',
        path: paths.dashboard.client.list,
        icon: APP_ICONS.user,
        permission: 'client.view',
      },
      {
        id: 'Employee',
        title: 'nav.employee',
        path: paths.dashboard.employee.root,
        icon: APP_ICONS.employee,
        permission: 'user.view',
        children: [
          { id: 'employee_overview', title: 'nav.employee_overview', path: paths.dashboard.employee.root },
          { id: 'create_employee', title: 'nav.employee_create', path: paths.dashboard.employee.new },
          { id: 'employee_list', title: 'nav.employee_list', path: paths.dashboard.employee.list },
        ],
      },
      {
        id: 'Runner’s User',
        title: 'nav.runners',
        path: paths.dashboard.user.list,
        icon: APP_ICONS.runner,
        permission: 'runner.view',
      },
      {
        id: 'Roles Management',
        title: 'nav.roles',
        path: '/roles',
        icon: APP_ICONS.roles,
        permission: 'role.manage',
      },
      {
        id: 'Group',
        title: 'nav.group_manage',
        path: paths.dashboard.group.overview,
        icon: APP_ICONS.roles,
        permission: 'group.view',
        children: [
          { id: 'group_overview', title: 'nav.group_overview', path: paths.dashboard.group.overview },
          { id: 'create_group', title: 'nav.group_create', path: paths.dashboard.group.new },
          { id: 'all_group', title: 'nav.group_all', path: paths.dashboard.group.list },
        ],
      },
    ],
  },

  // OPERATIONS
  {
    subheader: 'nav.operations',
    items: [
      {
        id: 'Task',
        title: 'nav.task_manage',
        path: paths.dashboard.task.root,
        icon: APP_ICONS.task,
        permission: 'task.view',
        children: [
          { id: 'task_overview', title: 'nav.task_overview', path: paths.dashboard.task.overview },
          { id: 'all_task', title: 'nav.task_all', path: paths.dashboard.task.all },
          { id: 'pending_task', title: 'nav.task_pending', path: paths.dashboard.task.pending },
          { id: 'in_progress_task', title: 'nav.task_in_progress', path: paths.dashboard.task.inProgress },
          { id: 'completed_task', title: 'nav.task_completed', path: paths.dashboard.task.completed },
          { id: 'cancelled_task', title: 'nav.task_cancelled', path: paths.dashboard.task.cancelled },
          { id: 'hold_task', title: 'nav.task_hold', path: paths.dashboard.task.hold },
        ],
      },
      {
        id: 'Generate Reports',
        title: 'nav.reports',
        path: paths.dashboard.report.root,
        icon: APP_ICONS.report,
        permission: 'report.view',
        children: [
          { id: 'work_reports', title: 'nav.work_reports', path: paths.dashboard.report.work_reports },
        ],
      },
      {
        id: 'Document Management',
        title: 'nav.documents',
        path: paths.dashboard.document.list,
        icon: APP_ICONS.document,
        permission: 'document.view',
      },
      {
        id: 'Invoice',
        title: 'nav.invoice',
        path: paths.dashboard.invoice.list,
        icon: APP_ICONS.invoice,
        permission: 'invoice.view',
      },
    ],
  },

  // FINANCE
  {
    subheader: 'nav.finance_group',
    items: [
      {
        id: 'Financial',
        title: 'nav.finance',
        path: paths.dashboard.finance.root,
        icon: APP_ICONS.finance,
        permission: 'finance.view',
      },
      {
        id: 'Financial Management',
        title: 'nav.financial_management',
        path: paths.dashboard.finance.root,
        icon: APP_ICONS.finance,
        permission: 'finance.view',
      },
      {
        id: 'Marketplace',
        title: 'nav.marketplace',
        path: paths.dashboard.finance.marketplace,
        icon: APP_ICONS.marketplace,
      },
      {
        id: 'Accounting',
        title: 'nav.accounting',
        path: paths.dashboard.finance.accounting.root,
        icon: APP_ICONS.accounting,
        children: [
          { id: 'bookings', title: 'nav.bookings', path: paths.dashboard.finance.accounting.bookings },
          { id: 'cashbook', title: 'nav.cashbook', path: paths.dashboard.finance.accounting.cashbook },
          { id: 'balanceSheet', title: 'nav.balanceSheet', path: paths.dashboard.finance.accounting.balanceSheet },
          { id: 'generalLedger', title: 'nav.generalLedger', path: paths.dashboard.finance.accounting.generalLedger },
          { id: 'trialBalance', title: 'nav.trialBalance', path: paths.dashboard.finance.accounting.trialBalance },
        ],
      },
      {
        id: 'Receivables',
        title: 'nav.receivables',
        path: paths.dashboard.finance.receivables,
        icon: APP_ICONS.receivables,
      },
      {
        id: 'Payables',
        title: 'nav.payables',
        path: paths.dashboard.finance.payables,
        icon: APP_ICONS.payable,
      },
      {
        id: 'Company Finance Overview',
        title: 'nav.financeOverview',
        path: paths.dashboard.finance.overview,
        icon: APP_ICONS.finance,
      },
      {
        id: 'VAT',
        title: 'nav.vat',
        path: paths.dashboard.finance.vat,
        icon: APP_ICONS.vat,
      },
      {
        id: 'Financial Statements',
        title: 'nav.financeStatements',
        path: paths.dashboard.finance.statements,
        icon: APP_ICONS.flag,
      },
      {
        id: 'Payroll',
        title: 'nav.payroll',
        path: paths.dashboard.finance.payroll,
        icon: APP_ICONS.flag,
      },
      {
        id: 'Analytics',
        title: 'nav.analytics',
        path: paths.dashboard.finance.analytics,
        icon: APP_ICONS.report,
      },
      {
        id: 'Task & Cost',
        title: 'nav.taskCost',
        path: paths.dashboard.finance.taskCost,
        icon: APP_ICONS.task,
      },
      {
        id: 'Employee Payment',
        title: 'nav.employee_payment',
        path: paths.dashboard.finance.employeePayment,
        icon: APP_ICONS.finance,
      },
      {
        id: 'Finance Settings',
        title: 'nav.financeSettings',
        path: paths.dashboard.finance.settings,
        icon: APP_ICONS.settings,
      },
    ],
  },

  // COMMUNICATION
  {
    subheader: 'nav.communication',
    items: [
      {
        id: 'Chat',
        title: 'nav.chat',
        path: paths.dashboard.chat,
        icon: APP_ICONS.chat,
        permission: 'chat.view',
      },
      {
        id: 'Mail',
        title: 'nav.mail',
        path: paths.dashboard.mail,
        icon: APP_ICONS.mail,
        permission: 'mail.view',
      },
      {
        id: 'Notification',
        title: 'nav.notification',
        path: paths.dashboard.notification.list,
        icon: APP_ICONS.notification,
        permission: 'notification.view',
      },
      {
        id: 'Support',
        title: 'nav.support',
        path: paths.dashboard.support.root,
        icon: APP_ICONS.support,
        permission: 'support.view',
      },
    ],
  },

  // SYSTEM
  {
    subheader: 'nav.system',
    items: [
      {
        id: 'Templates',
        title: 'nav.templates',
        path: paths.dashboard.template.root,
        icon: APP_ICONS.template,
        permission: 'template.view',
      },
      {
        id: 'System & Analytics',
        title: 'nav.system_analytics',
        path: paths.dashboard.systemAnalytics.root,
        icon: APP_ICONS.report,
        permission: 'settings.view',
        children: [
          { id: 'system_reports', title: 'nav.system_reports', path: paths.dashboard.systemAnalytics.reports },
          { id: 'add_expenses', title: 'nav.add_expenses', path: paths.dashboard.systemAnalytics.expenses },
          { id: 'user_activity_reports', title: 'nav.user_activity_reports', path: paths.dashboard.systemAnalytics.activity },
          { id: 'system_logs', title: 'nav.system_logs', path: paths.dashboard.systemAnalytics.logs },
          { id: 'custom_reports', title: 'nav.custom_reports', path: paths.dashboard.systemAnalytics.custom },
        ],
      },
      {
        id: 'Settings',
        title: 'nav.settings',
        path: paths.dashboard.settings,
        icon: APP_ICONS.settings,
        permission: 'settings.view',
      },
    ],
  },

  // USER
  {
    subheader: 'nav.user',
    items: [
      {
        id: 'Profile',
        title: 'nav.profile',
        path: paths.dashboard.employee.profile,
        icon: APP_ICONS.user,
        permission: 'profile.view',
      },
      {
        id: 'Calendar',
        title: 'nav.calendar',
        path: '/calendar',
        icon: APP_ICONS.schedule,
        permission: 'calendar.view',
      },
    ],
  },
];

export default navData;
