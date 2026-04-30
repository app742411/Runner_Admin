import { Helmet } from 'react-helmet-async';
import { EmployeeListView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Employee List | Runner</title>
      </Helmet>

      <EmployeeListView />
    </>
  );
}
