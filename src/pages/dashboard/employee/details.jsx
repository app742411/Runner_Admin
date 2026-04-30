import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { EmployeeDetailsView } from 'src/sections/employee/view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Dashboard: Employee Details | Runner</title>
      </Helmet>

      <EmployeeDetailsView id={id} />
    </>
  );
}
