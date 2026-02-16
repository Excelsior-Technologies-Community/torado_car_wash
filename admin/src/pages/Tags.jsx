import CRUDPage from '../components/common/CRUDPage';
import { tagsAPI } from '../api';

const Tags = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ];

  const initialFormData = { name: '' };

  return <CRUDPage title="Tags" api={tagsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default Tags;
