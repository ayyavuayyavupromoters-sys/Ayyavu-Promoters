import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, X, Calendar, MapPin, Phone, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  // Admin password - Change this to your desired password
  const ADMIN_PASSWORD = 'ayyavu2025admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchProperties();
    } else {
      alert('Invalid password');
    }
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase.from('property_listings').select('*').order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('property_listings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', propertyId);

      if (error) throw error;
      
      alert(`Property ${newStatus} successfully!`);
      fetchProperties();
      setSelectedProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [filter, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-900/80 to-red-950/30 p-8 rounded-2xl border border-red-600/30 backdrop-blur-sm max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white placeholder-gray-400"
              required
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white/90 hover:text-red-400 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Website</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-white/90 hover:text-red-400 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 p-2">
            <div className="flex space-x-2">
              {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    filter === status
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">No {filter} properties found.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div 
                key={property.id}
                className="bg-gradient-to-br from-gray-900/80 to-red-950/30 rounded-2xl overflow-hidden border border-red-600/30 hover:border-red-400 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={property.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">{property.title}</h3>
                  
                  <div className="flex items-center text-gray-300 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-red-400">{property.price}</span>
                    <span className="text-gray-300 text-sm">{property.area}</span>
                  </div>

                  <div className="flex items-center text-gray-400 text-xs mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(property.created_at)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                    
                    {property.status === 'pending' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'approved')}
                          className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => updatePropertyStatus(property.id, 'rejected')}
                          className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-1"
                        >
                          <X className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Property Details</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Property Images */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Images</h3>
                  <div className="space-y-4">
                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                      selectedProperty.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Property ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))
                    ) : (
                      <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">No images uploaded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Property Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Property Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Title</label>
                        <p className="text-white">{selectedProperty.title}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Type</label>
                        <p className="text-white capitalize">{selectedProperty.property_type}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Location</label>
                        <p className="text-white">{selectedProperty.location}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Price</label>
                        <p className="text-red-400 font-semibold">{selectedProperty.price}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Area</label>
                        <p className="text-white">{selectedProperty.area}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Description</label>
                        <p className="text-white">{selectedProperty.description}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-red-400" />
                        <span className="text-white">{selectedProperty.contact_name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-red-400" />
                        <span className="text-white">{selectedProperty.contact_phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-red-400" />
                        <span className="text-white">{selectedProperty.contact_email}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Status & Dates</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-gray-400 text-sm">Status</label>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ml-2 ${getStatusColor(selectedProperty.status)}`}>
                          {selectedProperty.status.charAt(0).toUpperCase() + selectedProperty.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Submitted</label>
                        <p className="text-white">{formatDate(selectedProperty.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Last Updated</label>
                        <p className="text-white">{formatDate(selectedProperty.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedProperty.status === 'pending' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'approved')}
                        className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <Check className="h-5 w-5" />
                        <span>Approve Property</span>
                      </button>
                      <button
                        onClick={() => updatePropertyStatus(selectedProperty.id, 'rejected')}
                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <X className="h-5 w-5" />
                        <span>Reject Property</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;