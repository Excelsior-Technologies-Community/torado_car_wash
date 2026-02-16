import CRUDPage from '../components/common/CRUDPage';
import { washTypesAPI } from '../api';

const WashTypes = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ];

  const initialFormData = {
    name: '',
    description: '',
  };

  return <CRUDPage title="Wash Types" api={washTypesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default WashTypes;
