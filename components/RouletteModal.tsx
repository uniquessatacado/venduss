import React, { useState, useEffect, useRef } from 'react';
import { Prize } from '../types';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinEnd: (prize: Prize) => void;
}

// 8 Segments for better alignment (45 degrees each)
const PRIZES: Prize[] = [
  { label: 'Tênis', emoji: '👟', categoryMatch: 'Shoes', color: '#52525b', textColor: '#fff' }, // Zinc 600
  { label: 'Não foi dessa vez', emoji: '❌', categoryMatch: null, color: '#09090b', textColor: '#71717a' }, // Black
  { label: 'Camiseta', emoji: '👕', categoryMatch: 'T-Shirts', color: '#71717a', textColor: '#fff' }, // Zinc 500
  { label: 'Não foi dessa vez', emoji: '❌', categoryMatch: null, color: '#09090b', textColor: '#71717a' }, // Black
  { label: 'Boné', emoji: '🧢', categoryMatch: 'Accessories', color: '#a1a1aa', textColor: '#000' }, // Zinc 400
  { label: 'Não foi dessa vez', emoji: '❌', categoryMatch: null, color: '#09090b', textColor: '#71717a' }, // Black
  { label: 'Bermuda', emoji: '🩳', categoryMatch: 'Shorts', color: '#d4d4d8', textColor: '#000' }, // Zinc 300
  { label: 'Não foi dessa vez', emoji: '❌', categoryMatch: null, color: '#09090b', textColor: '#71717a' }, // Black
];

const RouletteModal: React.FC<RouletteModalProps> = ({ isOpen, onClose, onSpinEnd }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  
  // Audio Context for synthetic sound (no external file needed)
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on mount (must be resumed on user gesture)
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  const playClickSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    // Create oscillator for "tick" sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  const handleSpin = () => {
    if (isSpinning || wonPrize) return;

    // Resume Audio Context (required by browsers)
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    setIsSpinning(true);
    
    // DRAMA LOGIC:
    // We want to land on a prize, but make it look like it barely passed an 'X'.
    // 8 segments = 45 degrees each.
    // X are at indices 1, 3, 5, 7. Prizes at 0, 2, 4, 6.
    // Let's target index 4 (Boné - Zinc 400).
    // Target index 4 is at angle: 4 * 45 + 22.5 (center) = 202.5 deg.
    // Wheel rotates clockwise, so we need to subtract this angle from 360 multiple.
    // To add drama, we land just at the start of the wedge (near the previous X).
    
    // Pick a random prize index (0, 2, 4, 6)
    const prizeIndices = [0, 2, 4, 6];
    const targetIndex = prizeIndices[Math.floor(Math.random() * prizeIndices.length)];
    const segmentSize = 360 / PRIZES.length; // 45
    
    // Calculate angle to center of that prize
    // The "pointer" is at 0 degrees (top).
    // To bring targetIndex to top, we rotate: 360 - (targetIndex * segmentSize)
    // Add some randomness within the segment, but bias towards the "start" of the segment (previous X) for drama.
    const baseTargetAngle = 360 - (targetIndex * segmentSize); 
    
    // Drama offset: land in the first 10 degrees of the 45 degree segment
    // This makes it look like it just barely escaped the X
    const dramaOffset = (Math.random() * 10) + 5; 
    
    const extraSpins = 10 * 360; // 10 full spins (drama duration)
    const finalRotation = rotation + extraSpins + baseTargetAngle - (segmentSize/2) + dramaOffset;

    setRotation(finalRotation);

    // Audio Ticks simulation
    const duration = 8000; // 8 seconds
    let startTime = Date.now();
    
    const animateSound = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) return;

        // Calculate current speed (approximate derivative of ease-out)
        // Physics: starts fast, slows down.
        // Ticks should be frequent at start, sparse at end.
        
        // Simple heuristic: play tick based on estimated rotation speed
        // This is a fake simulation of mechanical ticks
        const remaining = 1 - progress;
        const currentSpeed = remaining * remaining * remaining; // cubic ease out feel
        
        // Random chance to tick based on speed
        if (Math.random() < currentSpeed * 0.8) {
             playClickSound();
        }

        requestAnimationFrame(animateSound);
    };
    
    requestAnimationFrame(animateSound);

    setTimeout(() => {
      setIsSpinning(false);
      const won = PRIZES[targetIndex];
      setWonPrize(won);
      
      // Auto redirect logic
      setTimeout(() => {
          onSpinEnd(won);
      }, 3000); // 3 seconds to see the prize before redirect
      
    }, duration);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" />
      
      <div className="relative w-full max-w-md bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col items-center p-8 animate-scale-in">
        
        {/* Header */}
        <div className="text-center mb-8 z-10">
          <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase mb-2">
            ROLETA PREMIADA
          </h2>
          <p className="text-sm text-zinc-400 max-w-[260px] mx-auto leading-relaxed">
            Gire para garantir um brinde exclusivo na sua <span className="text-white font-bold border-b border-white/20">próxima compra</span>!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 mb-10">
          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 w-10 h-12 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
             <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[28px] border-t-white"></div>
          </div>

          {/* The Wheel */}
          <div 
            className="w-full h-full rounded-full border-[6px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-transform cubic-bezier(0.15, 0.9, 0.3, 1)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transitionDuration: '8000ms', // 8 seconds for drama
              background: `conic-gradient(
                ${PRIZES.map((p, i) => `${p.color} ${i * (360/PRIZES.length)}deg ${(i + 1) * (360/PRIZES.length)}deg`).join(', ')}
              )`
            }}
          >
            {/* Segments */}
            {PRIZES.map((p, i) => {
              const angle = 360 / PRIZES.length;
              const rotate = i * angle;
              const skew = 90 - angle; // 90 - 45 = 45

              return (
                <div key={i} className="absolute w-full h-full top-0 left-0">
                  {/* Content Container - Needs to be rotated to center of wedge */}
                  <div 
                    className="absolute w-full h-[50%] top-0 left-0 origin-bottom flex justify-center pt-4"
                    style={{ transform: `rotate(${rotate + angle/2}deg)` }}
                  >
                    <div className="flex flex-col items-center gap-1 transform">
                         <span className="text-3xl filter drop-shadow-md">{p.emoji}</span>
                         <span 
                           className="text-[9px] font-bold uppercase tracking-wider max-w-[60px] text-center leading-tight"
                           style={{ color: p.textColor }}
                         >
                             {p.label}
                         </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-zinc-900 rounded-full border-4 border-zinc-700 shadow-xl flex items-center justify-center z-30">
               <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!wonPrize ? (
            <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className={`
              w-full py-5 rounded-xl font-black text-xl uppercase tracking-widest shadow-lg transition-all
              ${isSpinning 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed transform scale-95 opacity-50' 
                : 'bg-white text-black hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }
            `}
          >
            {isSpinning ? 'Torcendo...' : 'GIRAR AGORA'}
          </button>
        ) : (
          <div className="text-center animate-fade-in-up w-full">
            <div className="mb-4">
                <span className="text-5xl">{wonPrize.emoji}</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic">
              {wonPrize.categoryMatch ? 'Parabéns!' : 'Quase!'}
            </h3>
            <p className="text-zinc-400 mb-6 text-sm">
              {wonPrize.categoryMatch 
                ? `Prêmio garantido: ${wonPrize.label} na próxima compra.` 
                : 'Não foi dessa vez. Tente na próxima!'}
            </p>
            <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-xs uppercase tracking-widest animate-pulse">
                <span>Enviando pedido...</span>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default RouletteModal;