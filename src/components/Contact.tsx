import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const isFormValid = formData.name && formData.email && formData.phone && formData.message;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send email notification (optional - requires edge function setup)
      try {
        await supabase.functions.invoke('send-contact-email', {
          body: formData
        });
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
        // Don't fail the whole process if email fails
      }

      alert('Thank you for your message! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error: any) {
      alert('Error sending message: ' + error.message);
    }
  };
  return (
    <section id="contact" className="py-20 text-white relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-red-950/40"></div>
      {/* Smudge effect at top */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black via-black/60 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-red-950/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to find your dream property? Contact us today and let's make it happen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          <div>
            <h3 className="text-2xl font-semibold mb-8">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Phone className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-gray-300"><a href="tel:+91 93604 93616">+91 93604 93616</a></div>
                  <div className="text-gray-300"><a href="tel:+91 93457 70330">+91 93457 70330</a></div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Mail className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-gray-300"><a href="mailto:ayyavu.ayyavupromoters@gmail.com">ayyavu.ayyavupromoters@gmail.com </a></div>
                
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <MapPin className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-gray-300">
                   No-17, Vidhya Colony 5th cross, Thadagam rd<br />
                    TVS Nagar,<br />
                    Coimbatore - 641025
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 hover:scale-105 hover:bg-white/10 p-4 rounded-lg transition-all duration-300 cursor-pointer">
                <Clock className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-medium">Business Hours</div>
                  <div className="text-gray-300">Monday - Saturday: 9:00 AM - 7:00 PM</div>
                  <div className="text-gray-300">Sunday: 10:00 AM - 5:00 PM</div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-8">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-white/5 via-white/10 to-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:backdrop-blur-2xl hover:bg-gradient-to-br hover:from-white/10 hover:via-white/15 hover:to-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-white/10 hover:border-white/30 hover:bg-white/8 transition-all duration-300 text-white placeholder-gray-300 backdrop-blur-md"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-white/10 hover:border-white/30 hover:bg-white/8 transition-all duration-300 text-white placeholder-gray-300 backdrop-blur-md"
                />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your Phone"
                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-white/10 hover:border-white/30 hover:bg-white/8 transition-all duration-300 text-white placeholder-gray-300 backdrop-blur-md"
              />
              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Your Message"
                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl focus:outline-none focus:border-white/40 focus:bg-white/10 hover:border-white/30 hover:bg-white/8 transition-all duration-300 resize-none text-white placeholder-gray-300 backdrop-blur-md"
              ></textarea>
              <div className="relative group">
                <button
                  type="submit"
                  className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-500 backdrop-blur-md ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-red-600/80 to-red-500/80 hover:from-red-500 hover:to-red-400 text-white shadow-lg hover:shadow-xl border border-red-400/30 hover:border-red-300' 
                      : 'bg-white/5 hover:bg-gradient-to-r hover:from-red-600/60 hover:to-red-500/60 text-white/60 hover:text-white border border-white/10 hover:border-red-400/50'
                  } hover:scale-105`}
                  disabled={!isFormValid}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;