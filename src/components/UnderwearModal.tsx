
import React from 'react';
import { useStore } from '../context/StoreContext';
import { Ruler, Palette } from 'lucide-react';

interface PreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: string[]; // e.g. ['P','M','G'] or ['Preto','Azul']
  type: 'size' | 'color';
  categoryId: string;
  categoryName: string;
  onSave?: (val: string) => void;
}

const PreferenceModal: React.FC<PreferenceModalProps> = ({ isOpen, onClose, options, type, categoryId, categoryName, onSave }) => {
  const { updateCustomerPreference } = useStore();

  const handleSelect = (val: string) => {
    updateCustomerPreference(categoryId, type, val);
    if (onSave) onSave(val);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" />
      
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center animate-slide-up shadow-2xl">
        <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
           {type === 'size' ? <Ruler className="text-white" size={24} /> : <Palette className="text-white" size={24} />}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">
            {type === 'size' ? `Qual seu tamanho de ${categoryName}?` : `Qual sua cor favorita de ${categoryName}?`}
        </h3>
        <p className="text-zinc-400 text-sm mb-6">
          Salve sua preferência para receber ofertas personalizadas desta categoria.
        </p>

        <div className={`grid gap-3 ${options.length > 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="aspect-square rounded-xl bg-zinc-950 border border-zinc-800 hover:border-white hover:bg-zinc-800 transition-all text-white font-bold text-sm flex items-center justify-center"
            >
              {opt}
            </button>
          ))}
        </div>
        
        <button onClick={onClose} className="mt-6 text-zinc-500 text-xs hover:text-white underline">
            Pular por enquanto
        </button>
      </div>
    </div>
  );
};

export default PreferenceModal;
