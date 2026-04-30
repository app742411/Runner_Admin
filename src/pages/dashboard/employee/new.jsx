import { Helmet } from 'react-helmet-async';
import { EmployeeCreateView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Add New Employee | Runner</title>
      </Helmet>

      <EmployeeCreateView />
    </>
  );
}
