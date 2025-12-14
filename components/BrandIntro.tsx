
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';

const BrandIntro: React.FC = () => {
  const { currentTenant, settings } = useStore();
  
  // Animation Phases: 'init' -> 'build' -> 'grifes' -> 'shine'
  const [phase, setPhase] = useState<'init' | 'build' | 'grifes' | 'shine'>('init');

  const brandName = currentTenant?.name || settings.storeName || 'ABN Grifes';
  const logo = currentTenant?.logo;

  // Check if specific ABN styling applies (case insensitive)
  const isABN = brandName.toLowerCase().includes('abn');

  useEffect(() => {
      // Cinematic timing sequence
      const t1 = setTimeout(() => setPhase('build'), 200); 
      const t2 = setTimeout(() => setPhase('grifes'), 1200); 
      const t3 = setTimeout(() => setPhase('shine'), 1800); 

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className="relative w-full h-[55vh] md:h-[70vh] bg-black overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900 select-none group">
       {/* CSS for custom shine animation */}
       <style>{`
         @keyframes shine-loop {
           0% { background-position: 200% center; }
           100% { background-position: -200% center; }
         }
       `}</style>

       {/* Background Effects */}
       <div className="absolute inset-0 bg-black z-0"></div>
       
       {/* Ambient Light - Subtle white glow behind */}
       <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/5 blur-[100px] rounded-full transition-all duration-[2000ms] ${phase === 'init' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}></div>

       <div className="relative z-20 flex flex-col items-center justify-center w-full text-center">
          
          {logo ? (
             <div className={`transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) transform ${phase !== 'init' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-50 blur-lg'}`}>
                 <img 
                   src={logo} 
                   alt={brandName} 
                   className="h-40 md:h-64 w-auto object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                 />
             </div>
          ) : (
             <>
                {/* Intro Text: BEM - VINDO A */}
                <div className={`text-[10px] md:text-sm font-bold tracking-[0.5em] text-zinc-500 uppercase mb-4 md:mb-8 transition-all duration-1000 delay-300 ${phase === 'init' ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                    BEM - VINDO A
                </div>

                {/* Main Word (ABN) - Large Size Restored & White/Silver Color */}
                <div className="relative flex items-center justify-center w-full">
                    <h1 
                        className={`
                            w-fit mx-auto /* Ensures gradient box fits text exactly to avoid stripes */
                            text-8xl md:text-[13rem] leading-none font-black italic tracking-tighter 
                            text-transparent bg-clip-text 
                            transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1)
                            pl-4 pr-8 md:pr-12 /* Padding for italic slant */
                            ${phase === 'init' 
                                ? 'scale-[1.5] opacity-0 tracking-[0.2em] translate-z-10 blur-sm bg-white' // Start white
                                : phase === 'shine'
                                    ? 'scale-100 opacity-100 tracking-tighter translate-z-0 blur-0 bg-[linear-gradient(110deg,#ffffff_45%,#a1a1aa_50%,#ffffff_55%)] bg-[length:250%_100%] animate-[shine-loop_3s_linear_infinite]' // White -> Silver -> White
                                    : 'scale-100 opacity-100 tracking-tighter translate-z-0 blur-0 bg-gradient-to-b from-white via-gray-200 to-gray-500' // Static Silver/White
                            }
                        `}
                        style={{ 
                            fontFamily: 'Inter, sans-serif', 
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            willChange: 'transform, opacity, letter-spacing, background-position' 
                        }}
                    >
                        {isABN ? 'ABN' : brandName.split(' ')[0]}
                    </h1>
                </div>

                {/* Secondary Word (GRIFES) */}
                <div 
                    className={`
                        transition-all duration-1000 delay-100 ease-out transform
                        ${['grifes', 'shine'].includes(phase) 
                            ? 'opacity-100 translate-y-0 tracking-[0.8em] scale-100' 
                            : 'opacity-0 translate-y-12 tracking-widest scale-90'
                        }
                    `}
                >
                    <h2 className="text-xl md:text-4xl font-bold text-zinc-400 uppercase mt-4 md:mt-6 text-center pl-2">
                        {isABN ? 'GRIFES' : brandName.split(' ').slice(1).join(' ')}
                    </h2>
                </div>
             </>
          )}
          
          {/* Flash Effect Overlay */}
          <div className={`absolute inset-0 w-full h-full bg-white pointer-events-none mix-blend-overlay transition-opacity duration-700 ${phase === 'shine' ? 'opacity-5' : 'opacity-0'}`}></div>
       </div>

       {/* Particles */}
       <div className="absolute inset-0 z-30 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
    </div>
  );
};

export default BrandIntro;
