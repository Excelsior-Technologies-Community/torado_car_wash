import { useEffect, useState } from 'react';
import CRUDPage from '../components/common/CRUDPage';
import { servicePricingAPI, servicesAPI, vehicleCategoriesAPI } from '../api';

const ServicePricing = () => {
  const [serviceOptions, setServiceOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [{ data: servicesData }, { data: vehiclesData }] = await Promise.all([
          servicesAPI.getAll(),
          vehicleCategoriesAPI.getAll(),
        ]);

        const services = servicesData?.data || servicesData || [];
        const vehicles = vehiclesData?.data || vehiclesData || [];

        setServiceOptions(
          Array.isArray(services) ? services.map((item) => ({ value: item.id, label: item.name || item.title })) : []
        );
        setVehicleOptions(
          Array.isArray(vehicles) ? vehicles.map((item) => ({ value: item.id, label: item.name })) : []
        );
      } catch {
        setServiceOptions([]);
        setVehicleOptions([]);
      }
    };

    fetchOptions();
  }, []);

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Service', render: (row) => row.service_title || row.service_name || `#${row.service_id}` },
    { label: 'Vehicle Category', render: (row) => row.vehicle_category_name || `#${row.vehicle_category_id}` },
    { label: 'Final Price', render: (row) => `$${row.final_price}` },
  ];

  const formFields = [
    { name: 'service_id', label: 'Service', type: 'select', required: true, options: serviceOptions },
    { name: 'vehicle_category_id', label: 'Vehicle Category', type: 'select', required: true, options: vehicleOptions },
    { name: 'final_price', label: 'Final Price', type: 'number', required: true },
  ];

  const initialFormData = {
    service_id: '',
    vehicle_category_id: '',
    final_price: '',
  };

  const transformFormData = ({ nextData }) => ({
    ...nextData,
    service_id: nextData.service_id ? Number(nextData.service_id) : nextData.service_id,
    vehicle_category_id: nextData.vehicle_category_id ? Number(nextData.vehicle_category_id) : nextData.vehicle_category_id,
    final_price: nextData.final_price ? Number(nextData.final_price) : nextData.final_price,
  });

  return (
    <CRUDPage
      title="Service Pricing"
      api={servicePricingAPI}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      transformFormData={transformFormData}
    />
  );
};

export default ServicePricing;
