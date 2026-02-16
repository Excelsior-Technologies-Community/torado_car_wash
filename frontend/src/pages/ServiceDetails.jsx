import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { servicesApi } from '../api';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const response = await servicesApi.getById(id);
      // Handle both direct response and wrapped response
      setService(response.data || response);
    } catch (error) {
      console.error('Error fetching service:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!service) return <div className="text-center py-20">Service not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/services" className="text-orange-500 hover:text-orange-600 mb-6 inline-block">&larr; Back to Services</Link>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            {service.icon && (
              <img src={`http://localhost:5000/uploads/${service.icon}`} alt="" className="w-16 h-16 rounded-full" />
            )}
            <h1 className="text-4xl font-bold">{service.name}</h1>
          </div>

          {service.image && (
            <img src={`http://localhost:5000/uploads/${service.image}`} alt={service.name} className="w-full h-96 object-cover rounded-lg mb-8" />
          )}

          {service.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Service</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{service.description}</p>
            </div>
          )}

          {service.problem_name && service.problem_description && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded">
              <h3 className="text-xl font-bold mb-3">{service.problem_name}</h3>
              <p className="text-gray-700 leading-relaxed">{service.problem_description}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/book" className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition inline-block">
              Book This Service
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ServiceDetails;
