import { Helmet } from 'react-helmet-async';

import { EmployeePaymentView } from 'src/sections/finance/view';

// ----------------------------------------------------------------------

export default function EmployeePaymentPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Employee Payment</title>
      </Helmet>

      <EmployeePaymentView />
    </>
  );
}
