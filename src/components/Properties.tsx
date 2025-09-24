import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Home, Ruler, Calendar, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';


const Properties = () => {
  const [activeTab, setActiveTab] = useState<'residential' | 'commercial'>('residential');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => property.property_type === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleContactSeller = (property: PropertyListing) => {
    const message = `Hi, I'm interested in your property: ${property.title} located at ${property.location}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${property.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallSeller = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailSeller = (email: string, property: PropertyListing) => {
    const subject = `Inquiry about ${property.title}`;
    const body = `Hi,\n\nI'm interested in your property: ${property.title}\nLocation: ${property.location}\nPrice: ${property.price}\n\nCould you please provide more details?\n\nThank you.`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-white/90 hover:text-red-400 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">
              Available Properties
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Property Type Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex justify-center">
          <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 p-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('residential')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'residential'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Residential
              </button>
              <button
                onClick={() => setActiveTab('commercial')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'commercial'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Commercial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading properties...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">No {activeTab} properties available at the moment.</div>
            <p className="text-gray-400 mt-2">Check back later for new listings!</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div 
              key={property.id}
              className="bg-gradient-to-br from-gray-900/80 to-red-950/30 rounded-2xl overflow-hidden border border-red-600/30 hover:border-red-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer backdrop-blur-sm"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={property.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    {property.property_type === 'residential' ? <Home className="h-3 w-3 mr-1" /> : <Building className="h-3 w-3 mr-1" />}
                    {property.property_type === 'residential' ? 'Residential' : 'Commercial'}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
                
                <div className="flex items-center text-gray-300 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-red-400" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-red-400">{property.price}</span>
                  <span className="text-gray-300 text-sm">{property.area}</span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{property.description}</p>

                {/* Contact Info */}
                <div className="mb-4 text-sm text-gray-400">
                  <p>Contact: {property.contact_name}</p>
                  <p>Phone: {property.contact_phone}</p>
                  <p>Email: {property.contact_email}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={() => handleContactSeller(property)}
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-green-600 hover:bg-transparent hover:border-2 hover:border-green-400 hover:text-green-400 text-white flex items-center justify-center space-x-2"
                  >
                    <span>WhatsApp</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleCallSeller(property.contact_phone)}
                      className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-400 hover:text-blue-400 text-white text-sm"
                    >
                      Call
                    </button>
                    <button 
                      onClick={() => handleEmailSeller(property.contact_email, property)}
                      className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 text-white text-sm"
                    >
                      Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-red-950/30 to-gray-900/30 border-t border-red-600/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interested in Any Property?</h2>
          <p className="text-gray-300 mb-6">Contact us for site visits, documentation, and personalized assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <a href="tel:+919360493616">Schedule Site Visit</a>
            </button>
            <button className="border-2 border-red-400 text-red-400 hover:bg-transparent hover:border-white hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105">
              <a href="https://wa.me/919360493616?text=Hi, I would like to get price details for properties">Get Price Details</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;