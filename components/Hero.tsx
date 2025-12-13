import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const { banners, settings } = useStore();
  const activeBanners = banners.filter(b => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!settings.bannerAutoRotate || activeBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, settings.bannerInterval * 1000);

    return () => clearInterval(interval);
  }, [activeBanners.length, settings.bannerAutoRotate, settings.bannerInterval]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  if (activeBanners.length === 0) return null;

  return (
    <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden bg-zinc-900 group">
      {activeBanners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {banner.type === 'video' ? (
             <video 
               src={banner.url} 
               autoPlay 
               muted 
               loop 
               playsInline 
               className="w-full h-full object-cover brightness-75"
             />
          ) : (
            <img 
              src={banner.url} 
              alt="Banner" 
              className="w-full h-full object-cover brightness-90"
            />
          )}
          
          {/* Overlay Content - Optional Generic Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-12 pb-16">
             <div className="transform translate-y-0 transition-transform duration-700">
                <span className="text-white/80 text-sm font-medium tracking-widest uppercase mb-2 block animate-fade-in-up">Coleção 2024</span>
                <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-lg">ABN Lifestyle</h1>
                <button className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm w-fit hover:bg-zinc-200 transition-colors">
                  Ver Ofertas
                </button>
             </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      {activeBanners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/50 transition-colors md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/50 transition-colors md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-6' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;