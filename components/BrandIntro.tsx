
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const BrandIntro: React.FC = () => {
  const { currentTenant, settings } = useStore();
  
  // Animation Phases: 'init' -> 'text' -> 'logo' -> 'shine'
  const [phase, setPhase] = useState<'init' | 'text' | 'logo' | 'shine'>('init');

  const brandName = currentTenant?.name || settings.storeName || 'BEM-VINDO';
  const logo = currentTenant?.logo;

  useEffect(() => {
      // Slower Sequence timing
      const t1 = setTimeout(() => setPhase('text'), 500); // Slower start
      const t2 = setTimeout(() => setPhase('logo'), 1200);
      const t3 = setTimeout(() => setPhase('shine'), 2500);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative w-full h-[35vh] md:h-[50vh] bg-black overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900 select-none group">
       {/* Background Effects */}
       <div className="absolute inset-0 bg-black z-0"></div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-zinc-800/20 blur-[100px] rounded-full animate-pulse-slow"></div>
       
       <div className="absolute inset-0 z-10 pointer-events-none opacity-40">
             <div className="absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-gradient-to-r from-zinc-800/30 to-transparent rounded-full blur-[80px] animate-drift-right"></div>
             <div className="absolute bottom-[20%] -right-[10%] w-[300px] h-[300px] bg-gradient-to-l from-zinc-800/30 to-transparent rounded-full blur-[80px] animate-drift-left"></div>
       </div>

       <div className="relative z-20 flex flex-col items-center justify-center w-full px-4 text-center">
          
          {/* Phase 1: Small Text */}
          <div className={`transition-opacity duration-1000 ${phase !== 'init' ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold tracking-[0.6em] uppercase mb-4 md:mb-6">
                COLEÇÃO EXCLUSIVA
              </p>
          </div>

          <div className="relative flex justify-center items-center">
             {/* Flash Effect */}
             <div className={`absolute inset-0 bg-white/10 blur-3xl scale-150 rounded-full transition-opacity duration-1000 ${phase === 'logo' ? 'opacity-100' : 'opacity-0'}`}></div>
             
             {/* Main Logo/Text Container */}
             <div className={`transition-all duration-1000 transform ${phase === 'logo' || phase === 'shine' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-sm'}`}>
                 {logo ? (
                     <img 
                       src={logo} 
                       alt={brandName} 
                       className="h-28 md:h-48 w-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                       style={{ mixBlendMode: 'screen', filter: 'grayscale(100%) brightness(200%) contrast(120%)' }} 
                     />
                 ) : (
                     <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 uppercase drop-shadow-2xl">
                        {brandName}
                     </h1>
                 )}
             </div>
             
             {/* Shine Effect */}
             {phase === 'shine' && (
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine pointer-events-none z-30"></div>
             )}
          </div>
          
          {/* Phase 3: Bottom Line */}
          <div className={`mt-6 md:mt-8 w-16 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent rounded-full transition-all duration-1000 delay-500 ${phase === 'shine' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}></div>
       </div>

       {/* Dust Particles */}
       <div className="absolute inset-0 z-30 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

       <style>{`
        @keyframes pulse-slow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes shine-pass { 0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateX(200%) skewX(-12deg); opacity: 0; } }

        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-shine { animation: shine-pass 3s ease-in-out infinite; }
       `}</style>
    </div>
  );
};

export default BrandIntro;
