import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, Users, Award } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleBuyClick = () => {
    navigate('/properties');
  };

  const handleSellClick = () => {
    navigate('/sell');
  };

  return (
    <section id="home" className="relative min-h-screen text-white py-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/Gemini_Generated_Image_8eyuzk8eyuzk8eyu.png)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-red-950/30"></div>
      {/* Smudge effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-red-950/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative z-10 pt-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ayyavu Promoters
          </h2>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            <h1><b className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm shadow-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300"> Creating Heavens on Earth</b></h1><br />
            Ayyavu Promoters - Building trust, creating homes, and shaping communities for over a decade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={handleBuyClick}
              className="border-2 border-red-400 text-red-400 hover:bg-transparent hover:border-white hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Buy
            </button>
            <button 
              onClick={handleSellClick}
              className="border-2 border-red-400 text-red-400 hover:bg-transparent hover:border-white hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Sell
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/10 rounded-lg p-4 hover:shadow-lg">
              <Home className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold">100+</div>
                <div className="text-gray-300">Homes Built</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/10 rounded-lg p-4 hover:shadow-lg">
              <Users className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-gray-300">Happy Families</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 hover:scale-110 transition-all duration-300 cursor-pointer hover:bg-white/10 rounded-lg p-4 hover:shadow-lg">
              <Award className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold">20+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;