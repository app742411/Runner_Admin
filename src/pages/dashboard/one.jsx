import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { CONFIG } from 'src/config-global';
import { ROLES } from 'src/config/roles';

// ── Role-specific dashboard components ──────────────────────────────────
// Each role gets its own view. Same URL (/dashboard), different component.
// To add a new role: create a view file and add a case below.
// ────────────────────────────────────────────────────────────────────────
import SuperAdminView    from 'src/sections/dashboard/roles/super-admin/view';
import CompanyAdminView  from 'src/sections/dashboard/roles/company-admin/view';
import GroupAdminView    from 'src/sections/dashboard/roles/group-admin/view';
import EmployeeView      from 'src/sections/dashboard/roles/employee/view';
import FinanceManagerView from 'src/sections/dashboard/roles/finance-manager/view';
import { BlankView }     from 'src/sections/blank/view';

// ----------------------------------------------------------------------

export default function Page() {
  const { t }  = useTranslation();
  const user   = useSelector((state) => state.auth.user);
  const role   = user?.role;
  const title  = t('dashboard.title');

  const renderDashboard = () => {
    switch (role) {
      // ── SUPER ADMIN: Full admin dashboard (6 cards, charts, company table)
      case ROLES.SUPER_ADMIN:
        return <SuperAdminView />;

      // ── COMPANY ADMIN: Company-scoped dashboard (3 cards, sales chart, employees/tasks)
      case ROLES.COMPANY_ADMIN:
        return <CompanyAdminView />;

      // ── GROUP ADMIN: Group-level dashboard
      case ROLES.GROUP_ADMIN:
        return <GroupAdminView />;

      // ── FINANCE MANAGER: Specific financial dashboard
      case ROLES.FINANCE_MANAGER:
        return <FinanceManagerView />;

      // ── EMPLOYEE: Personal task dashboard
      case ROLES.EMPLOYEE:
        return <EmployeeView />;

      // ── FALLBACK: Unknown role — show blank
      default:
        return <BlankView title={title} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${title} | ${CONFIG.site.name}`}</title>
      </Helmet>

      {renderDashboard()}
    </>
  );
}
