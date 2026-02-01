import React from 'react';
import { X, MapPin, Home, Ruler, Phone, Mail, User, IndianRupee, Building, Calendar } from 'lucide-react';
import type { PropertyListing } from '../lib/supabase';

interface PropertyDetailsProps {
  property: PropertyListing;
  onClose: () => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onClose }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleContactSeller = () => {
    const message = `Hi, I'm interested in your property: ${property.title} located at ${property.location}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${property.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallSeller = () => {
    window.location.href = `tel:${property.contact_phone}`;
  };

  const handleEmailSeller = () => {
    const subject = `Inquiry about ${property.title}`;
    const body = `Hi,\n\nI'm interested in your property: ${property.title}\nLocation: ${property.location}\nPrice: ${property.price}\n\nCould you please provide more details?\n\nThank you.`;
    window.location.href = `mailto:${property.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Property Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
            <div className="space-y-4">
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))
              ) : (
                <img
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Default property"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Title:</span>
                    <p className="text-white font-medium">{property.title}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Type:</span>
                    <p className="text-white font-medium capitalize">{property.property_type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Price:</span>
                    <p className="text-white font-medium">{property.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Ruler className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Area:</span>
                    <p className="text-white font-medium">{property.area}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Location:</span>
                    <p className="text-white font-medium">{property.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-2">Description</h4>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-red-400 mr-3" />
                  <span className="text-gray-300">{property.contact_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-red-400 mr-3" />
                  <span className="text-gray-300">{property.contact_phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-red-400 mr-3" />
                  <span className="text-gray-300">{property.contact_email}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Status & Timestamps</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Created:</span>
                    <p className="text-gray-300 text-sm">{formatDate(property.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-red-400 mr-3" />
                  <div>
                    <span className="text-gray-400 text-sm">Updated:</span>
                    <p className="text-gray-300 text-sm">{formatDate(property.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-white">Contact Seller</h4>
              <div className="space-y-2">
                <button 
                  onClick={handleContactSeller}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-green-600 hover:bg-transparent hover:border-2 hover:border-green-400 hover:text-green-400 text-white flex items-center justify-center space-x-2"
                >
                  <span>WhatsApp</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleCallSeller}
                    className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-400 hover:text-blue-400 text-white text-sm"
                  >
                    Call
                  </button>
                  <button 
                    onClick={handleEmailSeller}
                    className="py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 text-white text-sm"
                  >
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;