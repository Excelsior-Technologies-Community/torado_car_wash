import React from 'react';

const ServiceCard = ({ service }) => {
  const hasImage = service.image;
  
  return (
    <div className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all cursor-pointer group bg-white relative overflow-hidden">
      
      {/* Background Image - Shows on Hover */}
      {hasImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(http://localhost:5000/uploads/${service.image})`
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-orange-100 group-hover:bg-orange-500 transition-colors">
          {service.icon ? (
            <img src={`http://localhost:5000/uploads/${service.icon}`} alt="" className="w-8 h-8" />
          ) : (
            <span className="text-2xl text-orange-500 group-hover:text-white transition-colors">🚗</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-4 text-black group-hover:text-white transition-colors">
          {service.name}
        </h3>

        {/* Description */}
        <p className="mb-6 leading-relaxed text-gray-600 group-hover:text-gray-200 transition-colors">
          {service.description}
        </p>

        {/* Learn More Link */}
        <button className="font-semibold hover:underline text-blue-600 group-hover:text-white transition-colors">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
