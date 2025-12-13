import React from 'react';
import { Timer, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const UpsellModal: React.FC<UpsellModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { underwearSize } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" />
      
      <div className="relative w-full max-w-sm bg-zinc-900 border border-red-900/50 rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Banner */}
        <div className="bg-red-600 text-white text-center py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 animate-pulse">
          <Timer size={14} /> Oportunidade Única
        </div>

        <div className="p-6 text-center">
          <img 
            src="https://picsum.photos/300/200?random=underwear" 
            alt="Kit Cuecas" 
            className="w-full h-32 object-cover rounded-lg mb-4 opacity-80"
          />
          
          <h3 className="text-2xl font-black text-white italic tracking-tighter mb-1">
            KIT 3 CUECAS {underwearSize || ''}
          </h3>
          <p className="text-zinc-400 text-sm mb-4">Complete seu pedido com conforto premium.</p>

          <div className="bg-zinc-950 rounded-lg p-3 mb-6 border border-zinc-800">
             <div className="flex justify-center items-baseline gap-2">
                <span className="text-zinc-500 line-through text-sm">R$ 80,00</span>
                <span className="text-3xl font-bold text-green-400">R$ 49,90</span>
             </div>
             <p className="text-[10px] text-green-500 mt-1 uppercase font-bold">Só agora no checkout</p>
          </div>

          <button 
            onClick={onAccept}
            className="w-full bg-white text-black py-3 rounded-lg font-bold text-sm mb-3 hover:bg-zinc-200 transition-colors"
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