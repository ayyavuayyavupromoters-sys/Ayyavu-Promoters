import React from 'react';
import { Building, Home, Key, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Building,
      title: "Residential Projects",
      description: "Premium apartments and villas designed for modern living with world-class amenities."
    },
    {
      icon: Home,
      title: "Commercial Spaces",
      description: "Strategic commercial properties and office spaces in prime locations for your business."
    },
    {
      icon: Key,
      title: "Property Management",
      description: "Complete property management services from documentation to maintenance."
    },
    {
      icon: Users,
      title: "Investment Advisory",
      description: "Expert guidance on real estate investments with market insights and analysis."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {services.map((service, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 to-red-950/50 p-8 rounded-3xl shadow-lg hover:shadow-2xl border border-red-600/30 hover:border-red-400 transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:-translate-y-2 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-lg mb-6 mx-auto">
                <service.icon className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                {service.title}
              </h3>
              <p className="text-gray-300 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;