import CRUDPage from '../components/common/CRUDPage';
import { contentAPI } from '../api';

const PagesManager = () => {
  const api = {
    getAll: contentAPI.getAllPages,
    create: contentAPI.createPage,
    update: contentAPI.updatePage,
    delete: contentAPI.deletePage,
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Slug', field: 'slug' },
    { label: 'Title', field: 'title' },
    { label: 'Updated', render: (row) => new Date(row.updated_at).toLocaleString() },
  ];

  const formFields = [
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', rows: 12 },
  ];

  const initialFormData = {
    slug: '',
    title: '',
    content: '',
  };

  return (
    <CRUDPage
      title="Pages"
      api={api}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
    />
  );
};

export default PagesManager;
