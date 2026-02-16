import CRUDPage from '../components/common/CRUDPage';
import { washPackagesAPI } from '../api';

const WashPackages = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Title', field: 'title' },
    { label: 'Base Price', render: (row) => `$${row.base_price}` },
    { label: 'Duration', render: (row) => `${row.duration_minutes} min` },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'base_price', label: 'Base Price', type: 'number', required: true },
    { name: 'duration_minutes', label: 'Duration (minutes)', type: 'number', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number' },
    { name: 'icon', label: 'Icon', type: 'file' },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    title: '',
    description: '',
    base_price: '',
    duration_minutes: '',
    display_order: '',
    icon: null,
    image: null,
  };

  return (
    <CRUDPage
      title="Wash Packages"
      api={washPackagesAPI}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
    />
  );
};

export default WashPackages;
