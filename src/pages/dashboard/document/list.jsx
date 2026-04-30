import { Helmet } from 'react-helmet-async';
import { DocumentListView } from 'src/sections/document/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Document List | Runner</title>
      </Helmet>

      <DocumentListView />
    </>
  );
}
