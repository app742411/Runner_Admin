import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiCheckSquare,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLayers,
  FiMail,
  FiMessageSquare,
  FiShield,
  FiClipboard,
  FiHelpCircle,
  FiCalendar,
  FiBell,
  FiShoppingBag,
  FiBook,
  FiList,
  FiFileText,
  FiPercent,
  FiFlag,
} from 'react-icons/fi';

import {
  MdOutlineDashboard,
  MdOutlineAssignment,
  MdOutlineDescription,
} from 'react-icons/md';

/**
 *  SINGLE SOURCE OF ICONS
 * Use everywhere in app
 */
export const APP_ICONS = {
  // Dashboard / Overview
  dashboard: <MdOutlineDashboard />,
  home: <FiHome />,

  // Company & Users
  company: <FiBriefcase />,
  employee: <FiUsers />,
  runner: <FiUserCheck />,
  users: <FiUsers />,
  user: <FiUser />,

  // Tasks & Contracts
  task: <FiCheckSquare />,
  contract: <MdOutlineAssignment />,
  document: <MdOutlineDescription />,

  // Finance
  finance: <FiDollarSign />,
  subscription: <FiDollarSign />,

  // Reports & Data
  report: <FiBarChart2 />,
  property: <FiLayers />,

  // Support & Communication
  support: <FiHelpCircle />,
  chat: <FiMessageSquare />,
  mail: <FiMail />,
  notification: <FiBell />,

  // Roles & Settings
  roles: <FiShield />,
  settings: <FiSettings />,

  // Misc
  template: <FiClipboard />,
  schedule: <FiCalendar />,
  marketplace: <FiShoppingBag />,
  accounting: <FiBook />,
  receivables: <FiList />,
  payable: <FiFileText />,
  vat: <FiPercent />,
  flag: <FiFlag />,
  invoice: <FiFileText />,
};
