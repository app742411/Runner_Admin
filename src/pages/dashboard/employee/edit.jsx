import { Helmet } from 'react-helmet-async';
import { EmployeeEditView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Edit Employee | Runner</title>
      </Helmet>

      <EmployeeEditView />
    </>
  );
}
