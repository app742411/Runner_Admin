// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',

  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
      addCompany: `${ROOTS.AUTH}/jwt/add-company`, // NEW
    },
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    company: {
      root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      list: `${ROOTS.DASHBOARD}/company/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
      active: `${ROOTS.DASHBOARD}/company/active`,
      pending: `${ROOTS.DASHBOARD}/company/pending`,
      details: (id) => `${ROOTS.DASHBOARD}/company/${id}`,
    },
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      new: `${ROOTS.DASHBOARD}/group/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/group/${id}/edit`,
      list: `${ROOTS.DASHBOARD}/group/list`,
      details: (id) => `${ROOTS.DASHBOARD}/group/details/${id}`,
    },
    user: {
      list: `${ROOTS.DASHBOARD}/user/list`,
    },
    contract: {
      root: `${ROOTS.DASHBOARD}/contract`,
      list: `${ROOTS.DASHBOARD}/contract/list`,
      new: `${ROOTS.DASHBOARD}/contract/new`,
      details: (id) => `${ROOTS.DASHBOARD}/contract/details/${id}`,
    },
    task: {
      root: `${ROOTS.DASHBOARD}/task`,
      list: `${ROOTS.DASHBOARD}/task/list`,
      details: (id) => `${ROOTS.DASHBOARD}/task/details/${id}`,
    },
    employee: {
      root: `${ROOTS.DASHBOARD}/employee`,
      list: `${ROOTS.DASHBOARD}/employee/list`,
      new: `${ROOTS.DASHBOARD}/employee/new`,
      details: (id) => `${ROOTS.DASHBOARD}/employee/details/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/employee/${id}/edit`,
      profile: `${ROOTS.DASHBOARD}/employee/profile`,
      editProfile: `${ROOTS.DASHBOARD}/employee/edit-profile`,
    },
    subscription: {
      root: `${ROOTS.DASHBOARD}/subscription`,
      list: `${ROOTS.DASHBOARD}/subscription/list`,
      new: `${ROOTS.DASHBOARD}/subscription/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/subscription/${id}/edit`,
      select: `${ROOTS.DASHBOARD}/subscription/select`,
      checkout: `${ROOTS.DASHBOARD}/subscription/checkout`,
    },
    property: {
      root: `${ROOTS.DASHBOARD}/property`,
      list: `${ROOTS.DASHBOARD}/property/list`,
    },
    client: {
      root: `${ROOTS.DASHBOARD}/client`,
      list: `${ROOTS.DASHBOARD}/client/list`,
    },
    document: {
      root: `${ROOTS.DASHBOARD}/document`,
      list: `${ROOTS.DASHBOARD}/document/list`,
    },
    notification: {
      root: `${ROOTS.DASHBOARD}/notification`,
      list: `${ROOTS.DASHBOARD}/notification/list`,
    },
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    report: {
      root: `${ROOTS.DASHBOARD}/report`,
      work_reports: `${ROOTS.DASHBOARD}/report/work-reports`,
      details: (id) => `${ROOTS.DASHBOARD}/report/work-reports/${id}`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      list: `${ROOTS.DASHBOARD}/invoice/list`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/details/${id}`,
    },
    settings: `${ROOTS.DASHBOARD}/settings`,
    finance: {
      root: `${ROOTS.DASHBOARD}/finance`,
      marketplace: `${ROOTS.DASHBOARD}/finance/marketplace`,
      accounting: {
        root: `${ROOTS.DASHBOARD}/finance/accounting`,
        bookings: `${ROOTS.DASHBOARD}/finance/accounting/bookings`,
        cashbook: `${ROOTS.DASHBOARD}/finance/accounting/cashbook`,
        balanceSheet: `${ROOTS.DASHBOARD}/finance/accounting/balance-sheet`,
        generalLedger: `${ROOTS.DASHBOARD}/finance/accounting/general-ledger`,
        trialBalance: `${ROOTS.DASHBOARD}/finance/accounting/trial-balance`,
      },
      receivables: `${ROOTS.DASHBOARD}/finance/receivables`,
      payables: `${ROOTS.DASHBOARD}/finance/payables`,
      overview: `${ROOTS.DASHBOARD}/finance/overview`,
      vat: `${ROOTS.DASHBOARD}/finance/vat`,
      statements: `${ROOTS.DASHBOARD}/finance/statements`,
      payroll: `${ROOTS.DASHBOARD}/finance/payroll`,
      employeePayment: `${ROOTS.DASHBOARD}/finance/employee-payment`,
      analytics: `${ROOTS.DASHBOARD}/finance/analytics`,
      taskCost: `${ROOTS.DASHBOARD}/finance/task-cost`,
      settings: `${ROOTS.DASHBOARD}/finance/settings`,
    },
    company_admin: `${ROOTS.DASHBOARD}/company-admin`,
    template: {
      root: `${ROOTS.DASHBOARD}/template`,
    },
    support: {
      root: `${ROOTS.DASHBOARD}/support`,
      list: `${ROOTS.DASHBOARD}/support/list`,
      new: `${ROOTS.DASHBOARD}/support/new`,
      details: (id) => `${ROOTS.DASHBOARD}/support/details/${id}`,
    },
  },
};
