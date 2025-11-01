import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Check, X, Calendar, MapPin, Phone, Mail, User, Plus, Upload, Trash2, CreditCard as Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../lib/supabase';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyListing | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    location: '',
    property_type: 'residential' as 'residential' | 'commercial',
    contact_name: '',
    contact_phone: '',
    contact_email: ''
  });
  const [uploadImages, setUploadImages] = useState<File[]>([]);
  const [uploadImagePreviews, setUploadImagePreviews] = useState<string[]>([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    location: '',
    property_type: 'residential' as 'residential' | 'commercial',
    contact_name: '',
    contact_phone: '',
    contact_email: ''
  });
  const [editImages, setEditImages] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Admin password - Change this to your desired password
  const ADMIN_PASSWORD = 'ayyavu2004admin';

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
      console.log('Fetching properties with filter:', filter);
      
      let query = supabase
        .from('property_listings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Fetched properties:', data);
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      alert('Error fetching properties: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePropertyStatus = async (propertyId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('property_listings')
        .update({ 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', propertyId);

      if (error) throw error;
      
      alert(`Property ${newStatus} successfully!`);
      fetchProperties();
      setSelectedProperty(null);
    } catch (error: any) {
      console.error('Error updating property:', error);
      alert('Error updating property status: ' + error.message);
    }
  };

  const deleteProperty = async (propertyId: string, propertyTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('property_listings')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      alert('Property deleted successfully!');
      fetchProperties();
      setSelectedProperty(null);
    } catch (error: any) {
      console.error('Error deleting property:', error);
      alert('Error deleting property: ' + error.message);
    }
  };

  const handleUploadImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setUploadImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + editImages.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setEditImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditImage = (index: number) => {
    setEditImages(prev => prev.filter((_, i) => i !== index));
    setEditImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    setEditLoading(true);
    try {
      let imageUrls = [...(editingProperty.images || [])];

      // Upload new images if any
      if (editImages.length > 0) {
        imageUrls = [];
        for (const image of editImages) {
          const fileName = `edit-${Date.now()}-${image.name}`;
          const { data, error } = await supabase.storage
            .from('property-images')
            .upload(fileName, image);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          imageUrls.push(publicUrl);
        }
      }

      // Update property
      const { error } = await supabase
        .from('property_listings')
        .update({
          ...editFormData,
          images: imageUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProperty.id);

      if (error) throw error;

      alert('Property updated successfully!');
      setEditingProperty(null);
      setEditImages([]);
      setEditImagePreviews([]);
      fetchProperties();
    } catch (error: any) {
      console.error('Error updating property:', error);
      alert('Error updating property: ' + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const removeUploadImage = (index: number) => {
    setUploadImages(prev => prev.filter((_, i) => i !== index));
    setUploadImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdminUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);

    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = [];
      for (const image of uploadImages) {
        const fileName = `admin-${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Insert property listing with approved status
      const { error } = await supabase
        .from('property_listings')
        .insert({
          ...uploadFormData,
          images: imageUrls,
          user_id: null,
          status: 'approved' // Admin uploads are automatically approved
        });

      if (error) throw error;

      alert('Property uploaded and approved successfully!');
      
      // Reset form
      setUploadFormData({
        title: '',
        description: '',
        price: '',
        area: '',
        location: '',
        property_type: 'residential',
        contact_name: '',
        contact_phone: '',
        contact_email: ''
      });
      setUploadImages([]);
      setUploadImagePreviews([]);
      setShowUploadForm(false);
      
      // Refresh properties list
      fetchProperties();
    } catch (error: any) {
      console.error('Error uploading property:', error);
      alert('Error uploading property: ' + error.message);
    } finally {
      setUploadLoading(false);
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
            <div className="flex items-center space-x-4 flex-shrink-0">
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span className="whitespace-nowrap">Add Property</span>
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-white/90 hover:text-red-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                Logout
              </button>
            </div>
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

        {/* Debug Info */}
        <div className="mb-4 text-center text-gray-400 text-sm">
          Showing {properties.length} properties | Filter: {filter}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">Loading properties...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white text-xl">No {filter} properties found.</div>
            <p className="text-gray-400 mt-2">
              {filter === 'pending' ? 'No properties waiting for approval.' : `No ${filter} properties available.`}
            </p>
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

                    <button
                      onClick={() => {
                        setEditingProperty(property);
                        setEditFormData({
                          title: property.title,
                          description: property.description,
                          price: property.price,
                          area: property.area,
                          location: property.location,
                          property_type: property.property_type,
                          contact_name: property.contact_name,
                          contact_phone: property.contact_phone,
                          contact_email: property.contact_email
                        });
                        setEditImages([]);
                        setEditImagePreviews([]);
                      }}
                      className="w-full py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
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

                    {/* Delete Button - Available for all properties */}
                    <button
                      onClick={() => deleteProperty(property.id, property.title)}
                      className="w-full py-2 px-4 bg-red-800 hover:bg-red-900 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Property</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Property Modal */}
      {editingProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Property</h2>
                <button
                  onClick={() => setEditingProperty(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <div className="flex justify-center">
                    <div className="bg-black/5 backdrop-blur-md rounded-full border border-white/5 p-2">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setEditFormData(prev => ({ ...prev, property_type: 'residential' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            editFormData.property_type === 'residential'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditFormData(prev => ({ ...prev, property_type: 'commercial' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            editFormData.property_type === 'commercial'
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

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Title</label>
                    <input
                      type="text"
                      required
                      value={editFormData.title}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., Premium Residential Plot"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="text"
                      required
                      value={editFormData.price}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., ₹2.5 Cr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <input
                      type="text"
                      required
                      value={editFormData.area}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., 3 cent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      required
                      value={editFormData.location}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., Jubilee Hills, Hyderabad"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white resize-none"
                    placeholder="Describe the property in detail..."
                  />
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.contact_name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={editFormData.contact_phone}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="+91 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={editFormData.contact_email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="contact@email.com"
                    />
                  </div>
                </div>

                {/* Current Images Display */}
                <div>
                  <label className="block text-sm font-medium mb-2">Current Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {editingProperty.images && editingProperty.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Current ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-600"
                        />
                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          Current
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* New Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Replace Images (Optional - Max 5)</label>
                  <div className="border-2 border-dashed border-red-600/30 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">Click to upload new images (will replace current ones)</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {/* New Image Previews */}
                  {editImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      {editImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeEditImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <div className="absolute top-1 left-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            New
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingProperty(null)}
                    className="flex-1 py-4 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 py-4 px-6 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    {editLoading ? 'Updating...' : 'Update Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-red-950/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-600/30">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Property (Admin)</h2>
                <button
                  onClick={() => setShowUploadForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAdminUpload} className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <div className="flex justify-center">
                    <div className="bg-black/5 backdrop-blur-md rounded-full border border-white/5 p-2">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setUploadFormData(prev => ({ ...prev, property_type: 'residential' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            uploadFormData.property_type === 'residential'
                              ? 'bg-red-600 text-white shadow-lg'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          Residential
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadFormData(prev => ({ ...prev, property_type: 'commercial' }))}
                          className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            uploadFormData.property_type === 'commercial'
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

                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Title</label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.title}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., Premium Residential Plot"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.price}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., ₹2.5 Cr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Area</label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.area}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., 3 cent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Location</label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.location}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="e.g., Jubilee Hills, Hyderabad"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white resize-none"
                    placeholder="Describe the property in detail..."
                  />
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Name</label>
                    <input
                      type="text"
                      required
                      value={uploadFormData.contact_name}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={uploadFormData.contact_phone}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="+91 1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={uploadFormData.contact_email}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                      placeholder="contact@email.com"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Property Images (Max 5)</label>
                  <div className="border-2 border-dashed border-red-600/30 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadImageChange}
                      className="hidden"
                      id="admin-image-upload"
                    />
                    <label htmlFor="admin-image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {uploadImagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                      {uploadImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeUploadImage(index)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="flex-1 py-4 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadLoading}
                    className="flex-1 py-4 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    {uploadLoading ? 'Uploading...' : 'Add Property (Auto-Approved)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                  
                  {/* Delete Button in Modal */}
                  <div className="mt-4 pt-4 border-t border-red-600/30">
                    <button
                      onClick={() => deleteProperty(selectedProperty.id, selectedProperty.title)}
                      className="w-full py-3 px-4 bg-red-800 hover:bg-red-900 text-white rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Delete Property</span>
                    </button>
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