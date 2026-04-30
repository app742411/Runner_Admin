import { Helmet } from 'react-helmet-async';
import { TemplateListView } from 'src/sections/template/view';

// ----------------------------------------------------------------------

export default function TemplateListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Template List</title>
      </Helmet>

      <TemplateListView />
    </>
  );
}
