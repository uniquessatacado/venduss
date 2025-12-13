import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const FlashSale: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="my-8 relative overflow-hidden bg-black py-10 px-4">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-red-500 mb-2">
            <Timer className="animate-pulse" />
            <span className="font-bold tracking-widest uppercase text-sm">Flash Sale Acaba em:</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">50% OFF</h2>
          <p className="text-gray-400">Em itens selecionados da coleção de inverno.</p>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 w-16 h-16 flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold text-white font-mono">{formatNumber(timeLeft.hours)}</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Horas</span>
          </div>
          <span className="text-2xl font-bold text-white/30 mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 w-16 h-16 flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold text-white font-mono">{formatNumber(timeLeft.minutes)}</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Min</span>
          </div>
          <span className="text-2xl font-bold text-white/30 mt-4">:</span>
          <div className="flex flex-col items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 w-16 h-16 flex items-center justify-center border border-white/20">
              <span className="text-2xl font-bold text-red-500 font-mono animate-pulse">{formatNumber(timeLeft.seconds)}</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Seg</span>
          </div>
        </div>

        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors w-full md:w-auto">
          Ver Ofertas
        </button>
      </div>
    </div>
  );
};

export default FlashSale;