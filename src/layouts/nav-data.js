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
        path: paths.dashboard.company.root,
        icon: APP_ICONS.company,
        permission: 'company.view',
        children: [
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
        path: paths.dashboard.contract.list,
        icon: APP_ICONS.contract,
        permission: 'contract.view',
      },
      {
        id: 'Subscription',
        title: 'nav.subscription',
        path: paths.dashboard.subscription.list,
        icon: APP_ICONS.subscription,
        permission: 'subscription.view',
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
        path: paths.dashboard.employee.list,
        icon: APP_ICONS.employee,
        permission: 'user.view',
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
        title: 'nav.group',
        path: paths.dashboard.group.root,
        icon: APP_ICONS.roles,
        permission: 'group.view',
      },
    ],
  },

  // OPERATIONS
  {
    subheader: 'nav.operations',
    items: [
      {
        id: 'Task',
        title: 'nav.task',
        path: paths.dashboard.task.list,
        icon: APP_ICONS.task,
        permission: 'task.view',
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
