import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import api from '../services/api';

const AdvertisementSection = () => {
  const [adData, setAdData] = useState(null);

  const loadAdData = async () => {
    try {
      const { data } = await api.get('/advertisement');
      setAdData(data);
    } catch (e) {
      console.log("No advertisement found");
    }
  };

  useEffect(() => {
    loadAdData();
    // Listen for custom event if admin updates it in another tab/window
    window.addEventListener('advertisementUpdated', loadAdData);
    return () => window.removeEventListener('advertisementUpdated', loadAdData);
  }, []);

  if (!adData || !adData.isActive || !adData.text || !adData.mediaUrl) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-16">
      <div className="relative rounded-3xl overflow-hidden border border-[#0F6B4F]/30 bg-gradient-to-br from-[#0B1120] to-[#111827] shadow-2xl shadow-[#0F6B4F]/10 flex flex-col md:flex-row group">
        
        {/* Subtle glow background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0F6B4F]/5 to-transparent pointer-events-none" />

        {/* Text Section (Left) */}
        <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#06B6D4] font-bold bg-[#06B6D4]/10 px-2.5 py-1 rounded-full border border-[#06B6D4]/20">
              Sponsored
            </span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-6 whitespace-pre-wrap">
            {adData.text}
          </h3>

          <div className="mt-4 sm:mt-8">
            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl group/btn">
              <span>Learn More</span>
              <ExternalLink size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Media Section (Right) */}
        <div className="w-full md:w-1/2 lg:w-5/12 bg-black relative min-h-[300px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-40 pointer-events-none"></div>
          {adData.mediaType === 'video' ? (
            <video 
              src={adData.mediaUrl} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-contain absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <img 
              src={adData.mediaUrl} 
              alt="Advertisement" 
              className="w-full h-full object-contain absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default AdvertisementSection;
