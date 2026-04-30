import { Helmet } from 'react-helmet-async';
import { TaskListView } from 'src/sections/task/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Task List | Runner</title>
      </Helmet>

      <TaskListView />
    </>
  );
}
