import React from 'react';
import { Building, Home, Key, Users, MapPin, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const handleViewResidential = () => {
    navigate('/properties?type=residential');
  };

  const handleViewCommercial = () => {
    navigate('/properties?type=commercial');
  };

  const services = [
    {
      icon: Building,
      title: "Investment Advisory",
      description: "Expert guidance on real estate investments with market insights and analysis.",
      hasViewButton: false,
      size: "small"
    },
    {
      icon: Home,
      title: "Residential Projects",
      description: "Premium apartments and villas designed for modern living with world-class amenities.",
      hasViewButton: true,
      onView: handleViewResidential,
      size: "large"
    },
    {
      icon: Building,
      title: "Commercial Spaces",
      description: "Strategic commercial properties and office spaces in prime locations for your business.",
      hasViewButton: true,
      onView: handleViewCommercial,
      size: "large"
    },
    {
      icon: Key,
      title: "Property Management",
      description: "Complete property management services from documentation to maintenance.",
      hasViewButton: false,
      size: "small"
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/Gemini_Generated_Image_90g9q790g9q790g9.png)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-red-950/40"></div>
      {/* Smudge effects at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black via-black/60 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-red-950/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-red-950/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive real estate solutions tailored to meet your unique needs and aspirations
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          {services.map((service, index) => (
            <div key={index} className={`bg-gradient-to-br from-gray-900 to-red-950/50 rounded-3xl shadow-lg hover:shadow-2xl border border-red-600/30 hover:border-red-400 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden ${
              service.size === 'small' ? 'w-64 p-6' : 'w-80 p-8'
            }`}>
              <div className="flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-lg mb-6 mx-auto">
                <service.icon className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                {service.title}
              </h3>
              <p className="text-gray-300 text-center leading-relaxed mb-6">
                {service.description}
              </p>
              
              {service.hasViewButton && (
                <div className="flex justify-center">
                  <button
                    onClick={service.onView}
                    className="liquid-button relative px-8 py-3 bg-transparent border-2 border-red-400 text-red-400 rounded-full font-semibold transition-all duration-500 hover:text-white overflow-hidden group"
                  >
                    <span className="relative z-10">View</span>
                    <div className="liquid-fill absolute inset-0 bg-red-600 transform scale-0 rounded-full transition-all duration-700 ease-out group-hover:scale-150"></div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;