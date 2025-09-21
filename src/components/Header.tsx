import React from 'react';
import { Instagram, MessageCircle, Youtube } from 'lucide-react';

const Header = () => {
  // Editable social media links - you can change these URLs
  const socialLinks = {
    instagram: 'https://www.instagram.com/ayyavu_construction?utm_source=qr&igsh=MW94OGlrYjdua2NnZQ==',
    whatsapp: 'https://wa.me/9360493616',
    youtube: 'https://youtube.com/@ayyavuconstruction4201?si=xvZCysH0be_Lup9B'
  };

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
        <div className="flex justify-between items-center py-2 px-4">
          {/* Social Media Icons */}
          <div className="flex items-center space-x-3">
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-pink-400 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href={socialLinks.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-green-400 transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a 
              href={socialLinks.youtube} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 hover:text-red-500 transition-all duration-300 hover:scale-110"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>

          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <img 
                src="/AC_new_logo_2x-removebg-preview.png" 
                alt="Ayyavu Promoters Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-base font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent hidden sm:block drop-shadow-lg">Ayyavu Promoters</h1>
            </div>
          </div>
          <nav className="flex space-x-3">
            <a href="#home" className="nav-link text-white/90 text-sm font-medium relative overflow-hidden">
              <span className="relative z-10">Home</span>
            </a>
            <a href="#services" className="nav-link text-white/90 text-sm font-medium relative overflow-hidden">
              <span className="relative z-10">Services</span>
            </a>
            <a href="#about" className="nav-link text-white/90 text-sm font-medium relative overflow-hidden">
              <span className="relative z-10">About</span>
            </a>
            <a href="#contact" className="nav-link text-white/90 text-sm font-medium relative overflow-hidden">
              <span className="relative z-10">Contact</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;