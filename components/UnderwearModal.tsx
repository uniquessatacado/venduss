import React from 'react';
import { useStore } from '../context/StoreContext';
import { Ruler } from 'lucide-react';

interface UnderwearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnderwearModal: React.FC<UnderwearModalProps> = ({ isOpen, onClose }) => {
  const { setUnderwearSize } = useStore();

  const handleSelect = (size: string) => {
    setUnderwearSize(size);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
      
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center animate-slide-up shadow-2xl">
        <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
           <Ruler className="text-white" size={24} />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Qual seu tamanho?</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Selecione seu tamanho de cueca para receber ofertas personalizadas e brindes que servem em você.
        </p>

        <div className="grid grid-cols-4 gap-3">
          {['P', 'M', 'G', 'GG'].map((size) => (
            <button
              key={size}
              onClick={() => handleSelect(size)}
              className="aspect-square rounded-xl bg-zinc-950 border border-zinc-800 hover:border-white hover:bg-zinc-800 transition-all text-white font-bold text-lg flex items-center justify-center"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnderwearModal;