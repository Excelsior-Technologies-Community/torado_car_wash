import CRUDPage from '../components/common/CRUDPage';
import { servicesAPI } from '../api';

const Services = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'problem_name', label: 'Problem Name', type: 'text' },
    { name: 'problem_description', label: 'Problem Description', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'file' },
    { name: 'icon', label: 'Icon', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    description: '',
    problem_name: '',
    problem_description: '',
    image: null,
    icon: null,
  };

  return (
    <CRUDPage
      title="Services"
      api={servicesAPI}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
    />
  );
};

export default Services;
