import { Helmet } from 'react-helmet-async';
import { AddExpensesView } from 'src/sections/system-analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Expenses Tracker | Runner Dashboard</title>
      </Helmet>

      <AddExpensesView />
    </>
  );
}
