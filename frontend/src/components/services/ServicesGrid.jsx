import { useServices } from '../../hooks/useServices';
import ServiceCard from './ServiceCard';

const ServicesGrid = () => {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(6)].map((_, i) => (
          <div key={`skeleton-${i}`} className='bg-gray-200 animate-pulse rounded-lg h-80'></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className='text-center text-red-500'>Failed to load services</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {services?.slice(0, 6).map((service, index) => (
        <ServiceCard key={service._id || service.id || index} service={service} />
      ))}
    </div>
  );
};

export default ServicesGrid;
