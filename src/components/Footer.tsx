import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-950 via-red-950 to-gray-950 text-white py-8 border-t border-red-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg">Ayyavu Promoters</h3>
            <p className="text-gray-400 mt-1"><h3><b>Creating Heavens on Earth</b></h3></p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              © 2025 Ayyavu Promoters. All rights reserved.
            </p>
            <button
              onClick={() => window.location.href = '/admin'}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors mt-2 opacity-50 hover:opacity-100"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;