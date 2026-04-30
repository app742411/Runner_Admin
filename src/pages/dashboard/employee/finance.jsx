import { Helmet } from 'react-helmet-async';

import EmployeeFinanceView from 'src/sections/dashboard/roles/employee/finance-view';

// ----------------------------------------------------------------------

export default function EmployeeFinancePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Finance</title>
      </Helmet>

      <EmployeeFinanceView />
    </>
  );
}
