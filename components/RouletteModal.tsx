
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Prize } from '../types';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinEnd: (prize: Prize) => void;
}

const RouletteModal: React.FC<RouletteModalProps> = ({ isOpen, onClose, onSpinEnd }) => {
  const { settings, clientCart } = useStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<Prize | null>(null);
  const [canPlay, setCanPlay] = useState(true);
  
  // Audio Context for synthetic sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Get segments from context or fallback
  const segments = settings.rouletteSegments && settings.rouletteSegments.length > 0 
    ? settings.rouletteSegments 
    : []; // Should fallback to defaults in StoreContext

  // Check Eligibility on Mount
  useEffect(() => {
      const cartTotal = clientCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      if (cartTotal < (settings.rouletteMinTotal || 0)) {
          setCanPlay(false);
      }
  }, [clientCart, settings.rouletteMinTotal]);

  useEffect(() => {
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
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // Softer sound: Sine wave, lower frequency, softer envelope
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.05, ctx.currentTime); // Lower volume
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  };

  const handleSpin = () => {
    if (isSpinning || wonPrize) return;
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();

    setIsSpinning(true);
    
    // --- DECISION LOGIC ---
    let targetId: string;
    const cartTotal = clientCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 1. Check Rigging Rule
    if (settings.rouletteRigging?.active && cartTotal >= settings.rouletteRigging.minOrderValue) {
        targetId = settings.rouletteRigging.forceSegmentId;
    } else {
        // 2. Random Selection (Uniform probability for now)
        const randomIndex = Math.floor(Math.random() * segments.length);
        targetId = segments[randomIndex].id;
    }

    // Find index of target
    const targetIndex = segments.findIndex(s => s.id === targetId);
    if (targetIndex === -1) {
        // Fallback safety
        setIsSpinning(false);
        return;
    }

    // --- ANIMATION CALCULATION ---
    const segmentCount = segments.length;
    const segmentAngle = 360 / segmentCount;
    
    // Target Angle to land at Top (0 deg)
    // Wheel rotates clockwise. To bring index N to top, we need rotation of: 360 - (N * angle).
    const baseTargetAngle = 360 - (targetIndex * segmentAngle);
    
    // Randomize within wedge (center +/- jitter)
    // Add randomness but keep it clearly inside the wedge to avoid "line" disputes visuals
    const randomOffset = (Math.random() * (segmentAngle - 10)) + 5; 
    
    const extraSpins = 5 * 360; // 5 full spins
    const finalRotation = rotation + extraSpins + baseTargetAngle - (segmentAngle / 2) + randomOffset;

    setRotation(finalRotation);

    // Sound Animation Loop
    const duration = 6000; // 6 seconds
    let startTime = Date.now();
    
    const animateSound = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = elapsed / duration;
        if (progress >= 1) return;

        const remaining = 1 - progress;
        const currentSpeed = remaining * remaining * remaining; 
        
        // Tick chance proportional to speed
        if (Math.random() < currentSpeed * 0.6) {
             playClickSound();
        }
        requestAnimationFrame(animateSound);
    };
    requestAnimationFrame(animateSound);

    // End Spin
    setTimeout(() => {
      setIsSpinning(false);
      const wonSegment = segments[targetIndex];
      
      const prizeObj: Prize = {
          label: wonSegment.label,
          emoji: wonSegment.emoji,
          categoryMatch: wonSegment.type === 'win' ? 'General' : null, // Simplification for existing type
          color: wonSegment.color,
          textColor: '#fff'
      };
      
      setWonPrize(prizeObj);
      
      // Delay before closing/action
      setTimeout(() => {
          onSpinEnd(prizeObj);
      }, 3500);
      
    }, duration);
  };

  if (!isOpen) return null;

  if (!canPlay) {
      // Just close immediately or show error if somehow opened (should be prevented by parent logic usually)
      // But let's show a "Not eligible" state just in case
      return null; 
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" />
      
      <div className="relative w-full max-w-md bg-black rounded-[2rem] border border-zinc-800 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-hidden flex flex-col items-center p-8 animate-scale-in">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-600/20 blur-[60px] pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8 z-10 relative">
          <h2 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tighter uppercase mb-2 drop-shadow-sm">
            ROLETA NEON
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
            Sua sorte está lançada
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 mb-10 group">
          {/* External Glow Ring */}
          <div className="absolute inset-[-10px] rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-20 blur-md animate-pulse-slow"></div>

          {/* Pointer */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 filter drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
             <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[24px] border-t-white"></div>
          </div>

          {/* The Wheel */}
          <div 
            className="w-full h-full rounded-full border-[4px] border-zinc-900 shadow-2xl relative overflow-hidden transition-transform cubic-bezier(0.15, 0.9, 0.3, 1)"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transitionDuration: '6000ms',
              background: `conic-gradient(
                ${segments.map((s, i) => `${s.color} ${i * (360/segments.length)}deg ${(i + 1) * (360/segments.length)}deg`).join(', ')}
              )`
            }}
          >
            {/* Segments */}
            {segments.map((seg, i) => {
              const angle = 360 / segments.length;
              const rotate = i * angle;

              return (
                <div key={seg.id} className="absolute w-full h-full top-0 left-0">
                  {/* Content Container - Rotated to center of wedge */}
                  <div 
                    className="absolute w-full h-[50%] top-0 left-0 origin-bottom flex justify-center pt-5"
                    style={{ transform: `rotate(${rotate + angle/2}deg)` }}
                  >
                    <div className="transform rotate-180" style={{ transform: 'rotate(0deg)' }}> {/* Remove text rotation if needed, emoji is fine upright usually but wheel spins. Let's keep it simple */}
                         <span className="text-3xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" style={{ display: 'block', transform: 'rotate(180deg)' }}>
                             {seg.emoji}
                         </span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full border-2 border-zinc-800 shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center z-30">
               <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-black rounded-full shadow-inner flex items-center justify-center">
                   <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!wonPrize ? (
            <button 
            onClick={handleSpin}
            disabled={isSpinning}
            className={`
              w-full py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(168,85,247,0.4)] border border-purple-500/50 transition-all relative overflow-hidden group
              ${isSpinning 
                ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed transform scale-95' 
                : 'bg-black text-white hover:scale-105 active:scale-95'
              }
            `}
          >
            <span className="relative z-10">{isSpinning ? 'GIRANDO...' : 'GIRAR AGORA'}</span>
            {!isSpinning && <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>}
          </button>
        ) : (
          <div className="text-center animate-fade-in-up w-full bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <div className="mb-4">
                <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{wonPrize.emoji}</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase italic leading-none">
              {wonPrize.categoryMatch ? 'PARABÉNS!' : 'NÃO FOI DESSA VEZ'}
            </h3>
            <p className="text-purple-300 font-bold mb-6 text-lg">
              {wonPrize.label}
            </p>
            <div className="flex items-center justify-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest animate-pulse">
                <span>Processando prêmio...</span>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scale-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default RouletteModal;
