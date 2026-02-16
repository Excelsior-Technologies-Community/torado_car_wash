import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaStar, FaGem, FaCheck, FaClock, FaArrowRight } from 'react-icons/fa';
import { vehicleCategoriesApi, washPackagesApi } from '../api';

const PricingPlan = () => {
  const [vehicleCategories, setVehicleCategories] = useState([]);
  const [washPackages, setWashPackages] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  useEffect(() => {
    fetchVehicleCategories();
    fetchWashPackages();
  }, []);

  const fetchVehicleCategories = async () => {
    try {
      const response = await vehicleCategoriesApi.getAll();
      const categories = Array.isArray(response) ? response : (response.data || []);
      setVehicleCategories(categories);
      if (categories.length > 0) setSelectedVehicle(categories[0].id);
    } catch (error) {
      console.error('Error fetching vehicle categories:', error);
    }
  };

  const fetchWashPackages = async () => {
    try {
      const response = await washPackagesApi.getAll();
      setWashPackages(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error('Error fetching wash packages:', error);
    }
  };

  const getIcon = (name) => {
    if (name === 'Basic') return <FaShieldAlt className="text-3xl" />;
    if (name === 'Pro') return <FaStar className="text-3xl" />;
    if (name === 'Elite') return <FaGem className="text-3xl" />;
    return <FaShieldAlt className="text-3xl" />;
  };

  const getColor = (name) => {
    if (name === 'Basic') return 'bg-blue-500';
    if (name === 'Pro') return 'bg-red-500';
    if (name === 'Elite') return 'bg-blue-600';
    return 'bg-blue-500';
  };

  const getPrice = (pkg) => {
    if (!selectedVehicle) return pkg.base_price;
    const pricing = pkg.pricing?.find(p => p.vehicle_category_id === selectedVehicle);
    return pricing ? pricing.final_price : pkg.base_price;
  };

  const groupFeatures = (features) => {
    const groups = [];
    for (let i = 0; i < features.length; i += 2) {
      groups.push(features.slice(i, i + 2));
    }
    return groups;
  };

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Choose a Plan</h2>

        {/* Vehicle Categories */}
        <div className="flex justify-center gap-8 mb-16 flex-wrap">
          {vehicleCategories.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`cursor-pointer text-center transition-all ${selectedVehicle === vehicle.id ? 'transform -translate-y-2' : ''
                }`}
            >
              <div className={`relative ${selectedVehicle === vehicle.id ? 'bg-yellow-400 rounded-full p-4' : ''}`}>
                <img
                  src={vehicle.image ? `http://localhost:5000/uploads/${vehicle.image}` : '/images/car-placeholder.png'}
                  alt={vehicle.name}
                  className="w-32 h-20 object-contain rounded-full "
                />
              </div>
              <p className="mt-2 font-semibold">{vehicle.name}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {washPackages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-50 rounded-lg p-8 relative">
              {/* Price Badge */}
              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${getColor(pkg.name)} text-white px-8 py-6 rounded-t-lg shadow-lg`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
                <div className="text-center">
                  <div className="text-sm">$</div>
                  <div className="text-5xl font-bold">{getPrice(pkg)}</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <FaClock className="text-sm" />
                    <span className="text-sm">{pkg.duration_minutes} min</span>
                  </div>
                </div>
              </div>

              {/* Package Name & Icon */}
              <div className="flex items-center justify-center gap-4 mt-16 mb-6">
                {getIcon(pkg.name)}
                <h3 className="text-3xl font-bold mt-6">{pkg.name}</h3>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {groupFeatures(pkg.features || []).map((group, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg">
                    <div className="bg-blue-100 rounded-full p-2 mt-1">
                      <FaCheck className="text-blue-600 text-sm" />
                    </div>
                    <p className="text-gray-700">
                      {group.map(f => f.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Get Started Button */}
              <Link to="/book" className="w-full flex items-center justify-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition">
                Get Started <FaArrowRight />
              </Link>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default PricingPlan;
