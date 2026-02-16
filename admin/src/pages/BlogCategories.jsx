import CRUDPage from '../components/common/CRUDPage';
import { blogCategoriesAPI } from '../api';

export const BlogCategories = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ];

  const initialFormData = { name: '' };

  return <CRUDPage title="Blog Categories" api={blogCategoriesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default BlogCategories;
