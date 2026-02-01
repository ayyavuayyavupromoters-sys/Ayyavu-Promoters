import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard as Edit, Trash2, Save, X, Eye, MapPin, Home, Ruler, Phone, Mail, User, IndianRupee, Building, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';

const AdminPanel = () => {
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [viewingProperty, setViewingProperty] = useState<PropertyListing | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PropertyListing>>({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('property_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: string, newStatus: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('property_listings')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', propertyId);

      if (error) throw error;
      
      setProperties(prev => 
        prev.map(prop => 
          prop.id === propertyId 
            ? { ...prop, status: newStatus, updated_at: new Date().toISOString() }
            : prop
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating property status');
    }
  };

  const handleEdit = (property: PropertyListing) => {
    setEditingProperty(property);
    setEditFormData(property);
  };

  const handleSaveEdit = async () => {
    if (!editingProperty || !editFormData) return;

    try {
      const { error } = await supabase
        .from('property_listings')
        .update({
          ...editFormData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProperty.id);

      if (error) throw error;

      setProperties(prev =>
        prev.map(prop =>
          prop.id === editingProperty.id
            ? { ...prop, ...editFormData, updated_at: new Date().toISOString() }
            : prop
        )
      );

      setEditingProperty(null);
      setEditFormData({});
      alert('Property updated successfully!');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error updating property');
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      setProperties(prev => prev.filter(prop => prop.id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const handleBackClick = () => {
    window.history.back();
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950/20 to-gray-950 text-white flex items-center justify-center">
        <div className="text-xl">Loading admin panel...</div>
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
              onClick={handleBackClick}
              className="flex items-center space-x-2 text-white/90 hover:text-red-400 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <div className="text-sm text-gray-300">
              {properties.length} Properties
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">No properties found</div>
            <p className="text-gray-400 mt-2">Properties will appear here once submitted</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

                  {/* Timestamps */}
                  <div className="mb-4 text-xs text-gray-500">
                    <p>Created: {formatDate(property.created_at)}</p>
                    <p>Updated: {formatDate(property.updated_at)}</p>
                  </div>

                  {/* Status Controls */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => setViewingProperty(property)}
                      className="py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-blue-600 hover:bg-transparent hover:border-2 hover:border-blue-400 hover:text-blue-400 text-white text-sm flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEdit(property)}
                      className="py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-yellow-600 hover:bg-transparent hover:border-2 hover:border-yellow-400 hover:text-yellow-400 text-white text-sm flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(property.id)}
                      className="py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 text-white text-sm flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Property</h2>
              <button
                onClick={() => setEditingProperty(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Title</label>
                <input
                  type="text"
                  value={editFormData.title || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Price</label>
                  <input
                    type="text"
                    value={editFormData.price || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Area</label>
                  <input
                    type="text"
                    value={editFormData.area || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Location</label>
                <input
                  type="text"
                  value={editFormData.location || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Property Type</label>
                <select
                  value={editFormData.property_type || 'residential'}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, property_type: e.target.value as 'residential' | 'commercial' }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Description</label>
                <textarea
                  rows={4}
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Contact Name</label>
                  <input
                    type="text"
                    value={editFormData.contact_name || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Phone</label>
                  <input
                    type="tel"
                    value={editFormData.contact_phone || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Email</label>
                  <input
                    type="email"
                    value={editFormData.contact_email || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setEditingProperty(null)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewingProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Property Details</h2>
              <button
                onClick={() => setViewingProperty(null)}
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
                  {viewingProperty.images && viewingProperty.images.length > 0 ? (
                    viewingProperty.images.map((image, index) => (
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
                        <p className="text-white font-medium">{viewingProperty.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Type:</span>
                        <p className="text-white font-medium capitalize">{viewingProperty.property_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Price:</span>
                        <p className="text-white font-medium">{viewingProperty.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Ruler className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Area:</span>
                        <p className="text-white font-medium">{viewingProperty.area}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Location:</span>
                        <p className="text-white font-medium">{viewingProperty.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-2">Description</h4>
                  <p className="text-gray-300 leading-relaxed">{viewingProperty.description}</p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-red-400 mr-3" />
                      <span className="text-gray-300">{viewingProperty.contact_name}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-red-400 mr-3" />
                      <span className="text-gray-300">{viewingProperty.contact_phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-red-400 mr-3" />
                      <span className="text-gray-300">{viewingProperty.contact_email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-white mb-3">Status & Timestamps</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingProperty.status)}`}>
                        {viewingProperty.status.charAt(0).toUpperCase() + viewingProperty.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Created:</span>
                        <p className="text-gray-300 text-sm">{formatDate(viewingProperty.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-red-400 mr-3" />
                      <div>
                        <span className="text-gray-400 text-sm">Updated:</span>
                        <p className="text-gray-300 text-sm">{formatDate(viewingProperty.updated_at)}</p>
                      </div>
                    </div>
                  </div>
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