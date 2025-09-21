import React from 'react';
import { CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    "Quality construction with premium materials",
    "Transparent pricing and documentation",
    "On-time project delivery",
    "Customer-centric approach",
    "Legal compliance and approvals",
    "Post-sales support and service"
  ];

  return (
    <section id="about" className="py-20 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/Gemini_Generated_Image_y5powpy5powpy5po.png)'
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/60 via-transparent to-red-950/40"></div>
      {/* Smudge effects at top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black via-black/60 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-red-950/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-red-950/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Why Choose Ayyavu Promoters?
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              With over 20+ years of experience in the real estate industry, Ayyavu Promoters has 
              established itself as a trusted name in property development. We are committed to 
              delivering exceptional quality homes and commercial spaces that exceed expectations.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-950/80 to-gray-900/80 p-8 rounded-2xl border border-red-600/30 backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:border-red-400 transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">20+</div>
              <div className="text-yellow-300 mb-6 font-medium">Years of Excellence</div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                  <div className="text-2xl font-bold text-yellow-300">100+</div>
                  <div className="text-sm text-gray-300">Projects Completed</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                  <div className="text-2xl font-bold text-yellow-300">500+</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">500+</div>
                  <div className="text-sm text-gray-300">Happy Customers</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                  <div className="text-2xl font-bold text-yellow-300">50+</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-300">Ongoing Projects</div>
                </div>
                <div className="text-center hover:scale-110 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/10">
                  <div className="text-2xl font-bold text-yellow-300">99%</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent">99%</div>
                  <div className="text-sm text-gray-300">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;