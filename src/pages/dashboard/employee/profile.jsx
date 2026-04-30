import { Helmet } from 'react-helmet-async';
import { EmployeeDetailsView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Profile | Runner</title>
      </Helmet>

      <EmployeeDetailsView />
    </>
  );
}
