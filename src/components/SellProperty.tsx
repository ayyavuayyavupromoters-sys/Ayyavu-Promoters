import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, X, MapPin, Home, Ruler, Phone, Mail, User, IndianRupee, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SellProperty = () => {
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSubmitLoading(true);
    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Insert property listing
      const { error } = await supabase
        .from('property_listings')
        .insert({
          ...formData,
          images: imageUrls,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      alert('Property listing submitted successfully! It will be reviewed before being published.');
      
      // Reset form
      setFormData({
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
      setImages([]);
      setImagePreviews([]);
      
      // Redirect to properties page after successful submission
      setTimeout(() => {
        window.location.href = '/properties';
      }, 2000);
    } catch (error: any) {
      alert('Error submitting property: ' + error.message);
    } finally {
      setSubmitLoading(false);
    }
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
              Sell Your Property
            </h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Welcome, {user.email}</span>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-red-400 hover:text-white text-sm transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 border-2 border-transparent"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-gray-900/80 to-red-950/30 rounded-2xl p-8 border border-red-600/30 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-center mb-8">List Your Property</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Property Type</label>
              <div className="flex justify-center">
                <div className="bg-black/5 backdrop-blur-md rounded-full border border-white/5 p-2">
                  <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, property_type: 'residential' }))}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    formData.property_type === 'residential'
                        ? 'bg-red-600 text-white shadow-lg'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                      Residential
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, property_type: 'commercial' }))}
                      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    formData.property_type === 'commercial'
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
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  placeholder="e.g., Premium Residential Plot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                    placeholder="e.g., ₹2.5 Cr"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Area</label>
                <input
                  type="text"
                  required
                  value={formData.area}
                  onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                  placeholder="e.g., 3 cent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                    placeholder="e.g., Jubilee Hills, Hyderabad"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white resize-none"
                placeholder="Describe your property in detail..."
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-red-600/30 rounded-lg focus:outline-none focus:border-red-400 text-white"
                    placeholder="your@email.com"
                  />
                </div>
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
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Click to upload images or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
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
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:border-gray-600 disabled:hover:text-white text-white py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-transparent"
            >
              {submitLoading ? 'Submitting...' : 'Submit Property Listing'}
            </button>
          </form>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-red-600/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {authMode === 'login' ? 'Login' : 'Sign Up'}
              </h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:border-red-400 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-transparent hover:border-2 hover:border-red-400 hover:text-red-400 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:hover:border-gray-600 disabled:hover:text-white text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 border-2 border-transparent"
              >
                {loading ? 'Loading...' : (authMode === 'login' ? 'Login' : 'Sign Up')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="text-red-400 hover:text-red-300"
              >
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellProperty;