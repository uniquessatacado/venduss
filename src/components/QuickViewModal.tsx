
import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, Ruler, Plus, Minus } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (items: Array<{ size: string, quantity: number }>) => void;
}

const SIZES = ['P', 'M', 'G', 'GG'];

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Body scroll lock & Auto-scroll animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset quantities when a new product is opened
      setQuantities({});

      // Auto-scroll animation to hint at more content
      const animationTimer = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (container && container.scrollHeight > container.clientHeight) {
            // Gentle scroll down and back up
            container.scrollTo({ top: 60, behavior: 'smooth' });
            setTimeout(() => {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }, 800); // Time to scroll back up
        }
      }, 700); // Delay to let the modal animation finish

      return () => clearTimeout(animationTimer);

    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const updateQuantity = (size: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [size]: Math.max(0, (prev[size] || 0) + delta)
    }));
  };

  const handleAddToCartClick = () => {
    const itemsToAdd = Object.entries(quantities)
      .filter(([, qty]: [string, number]) => qty > 0)
      .map(([size, quantity]) => ({ size, quantity }));

    if (itemsToAdd.length > 0) {
      onAddToCart(itemsToAdd);
    } else {
      // Simple feedback if no items are selected
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const totalQuantity = Object.values(quantities).reduce((sum: number, qty: number) => sum + qty, 0);

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full md:max-w-lg bg-zinc-900 md:rounded-2xl rounded-t-2xl border-t md:border border-zinc-800 shadow-2xl flex flex-col animate-slide-up h-[90vh] md:h-auto md:max-h-[90vh]">
        
        {/* Header with Close Button */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-end z-20 md:hidden">
            <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors">
                <X size={20} />
            </button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors hidden md:block">
            <X size={20} />
        </button>

        {/* Image */}
        <div className="w-full h-1/2 md:h-80 flex-shrink-0 bg-black md:rounded-t-2xl overflow-hidden relative">
           <img 
             src={product.image} 
             alt={product.name} 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Details & Actions */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{product.category}</span>
            <h2 className="text-2xl font-black italic tracking-tight text-white">{product.name}</h2>
            <div className="text-2xl font-medium text-white">R$ {product.price.toFixed(2).replace('.', ',')}</div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Peça exclusiva da coleção ABN Grifes. Desenvolvida com materiais premium para quem busca estilo e conforto.
            </p>
            
            <div className="pt-2">
               <div className="flex justify-between items-center mb-3">
                 <span className="text-sm font-bold text-white uppercase">Selecione os Tamanhos</span>
                 <button className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors">
                    <Ruler size={12} /> Guia de Medidas
                 </button>
               </div>
               <div className="space-y-3">
                  {SIZES.map(size => (
                    <div key={size} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-zinc-800">
                      <span className="font-bold text-white">{size}</span>
                      <div className="flex items-center space-x-3 bg-zinc-800 rounded-lg p-1">
                        <button onClick={() => updateQuantity(size, -1)} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Minus size={16}/></button>
                        <span className="text-base font-mono w-6 text-center text-white">{quantities[size] || 0}</span>
                        <button onClick={() => updateQuantity(size, 1)} className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Plus size={16}/></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
          
          {/* Fixed footer area */}
          <div className={`p-4 bg-zinc-950/80 backdrop-blur-sm border-t border-zinc-800 ${isAnimating ? 'animate-shake' : ''}`}>
            <button 
              onClick={handleAddToCartClick}
              disabled={totalQuantity === 0}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ShoppingBag size={18} />
              Adicionar à Sacola ({totalQuantity})
            </button>
          </div>
        </div>
        <style>{`
            @keyframes shake {
                10%, 90% { transform: translate3d(-1px, 0, 0); }
                20%, 80% { transform: translate3d(2px, 0, 0); }
                30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
                40%, 60% { transform: translate3d(4px, 0, 0); }
            }
            .animate-shake {
                animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
        `}</style>
      </div>
    </div>
  );
};

export default QuickViewModal;
