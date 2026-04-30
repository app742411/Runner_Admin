import { Helmet } from 'react-helmet-async';
import { useParams } from 'src/routes/hooks';
import { TaskDetailsView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function Page() {
  const params = useParams();
  const { id } = params;

  return (
    <>
      <Helmet>
        <title>Dashboard: Task Details | Runner</title>
      </Helmet>

      <TaskDetailsView id={id} />
    </>
  );
}
