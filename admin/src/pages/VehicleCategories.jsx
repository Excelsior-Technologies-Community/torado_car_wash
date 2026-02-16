import CRUDPage from '../components/common/CRUDPage';
import { vehicleCategoriesAPI } from '../api';

const VehicleCategories = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Price Multiplier', field: 'price_multiplier' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price_multiplier', label: 'Price Multiplier', type: 'number', required: true },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    price_multiplier: '',
    image: null,
  };

  return <CRUDPage title="Vehicle Categories" api={vehicleCategoriesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default VehicleCategories;
