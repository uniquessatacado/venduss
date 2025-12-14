
import React, { useMemo } from 'react';
import { Timer, X, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UpsellOffer, Product } from '../types';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  offer: UpsellOffer | null;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, onAccept, offer }) => {
  const { underwearSize, products } = useStore();

  const suggestedProducts = useMemo(() => {
      if (!offer) return [];
      
      let candidates: Product[] = [];

      // 1. SELECT CANDIDATES
      if (offer.offerType === 'manual' && offer.specificProductIds) {
          // Manual: Pick specifically selected IDs
          candidates = products.filter(p => offer.specificProductIds?.includes(p.id));
      } else if (offer.offerType === 'automatic') {
          // Automatic: Filter by Source Category AND Subcategory
          candidates = products.filter(p => 
              p.categoryId === offer.sourceCategoryId && 
              p.subcategoryId === offer.sourceSubcategory
          );
      }

      // 2. FILTER BY STOCK AVAILABILITY (Based on size if required)
      const availableCandidates = candidates.filter(p => {
          if (offer.sizeRequired && underwearSize) {
              const variant = p.variants?.find(v => v.size === underwearSize);
              return variant && variant.quantity > 0;
          }
          // If size not required, ensure it has some stock or general availability
          const totalStock = p.variants?.reduce((a,b) => a+b.quantity, 0) || 0;
          return totalStock > 0;
      });

      // 3. SHUFFLE AND SLICE
      return availableCandidates
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
        
  }, [offer, products, underwearSize]);

  if (!isOpen || !offer) return null;

  // Auto close if no valid products found
  if (suggestedProducts.length === 0) {
      setTimeout(onClose, 0);
      return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" />
      
      <div className="relative w-full max-w-sm bg-zinc-900 border border-red-900/50 rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Banner */}
        <div className="bg-red-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
          <Timer size={14} /> Oportunidade Única
        </div>

        <div className="relative h-32 bg-black">
            <img 
                src={offer.bannerImage} 
                alt="Oferta" 
                className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
        </div>

        <div className="p-6 text-center -mt-10 relative z-10">
          <h3 className="text-2xl font-black text-white italic tracking-tighter mb-2 uppercase leading-none">
            {offer.title} {offer.sizeRequired && underwearSize ? `(${underwearSize})` : ''}
          </h3>
          
          {/* Thumbnails of suggested items (Available in Stock) */}
          <div className="flex justify-center gap-2 my-4 h-16">
              {suggestedProducts.map((p, i) => (
                  <div key={i} className="w-16 h-16 rounded-lg border-2 border-zinc-700 overflow-hidden bg-black relative transform rotate-[-3deg] first:rotate-[-6deg] last:rotate-[3deg]">
                      <img src={p.image} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 right-0 bg-green-500 p-0.5 rounded-tl"><Check size={8} className="text-black"/></div>
                  </div>
              ))}
          </div>

          <div className="bg-zinc-950 rounded-lg p-3 mb-6 border border-zinc-800">
             <div className="flex justify-center items-baseline gap-2">
                <span className="text-zinc-500 line-through text-sm">R$ {offer.originalPrice.toFixed(2)}</span>
                <span className="text-3xl font-bold text-green-400">R$ {offer.promoPrice.toFixed(2)}</span>
             </div>
             <p className="text-[10px] text-green-500 mt-1 uppercase font-bold">Leve {offer.productCount} por este preço!</p>
          </div>

          <button 
            onClick={onAccept}
            className="w-full bg-white text-black py-3 rounded-lg font-bold text-sm mb-3 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            ADICIONAR E ECONOMIZAR
          </button>
          
          <button 
            onClick={onClose}
            className="text-zinc-500 text-xs hover:text-white underline"
          >
            Não obrigado, vou perder essa oferta
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsellModal;
