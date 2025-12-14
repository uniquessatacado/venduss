
import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface PhonePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
}

const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').slice(0, 15);
};

const PhonePromptModal: React.FC<PhonePromptModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 animate-scale-in text-center shadow-2xl">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
            <Phone size={32} className="text-green-500" />
        </div>

        <h3 className="text-2xl font-black text-white mb-2">Quase lá!</h3>
        <p className="text-zinc-400 mb-6 text-sm">
            Para garantir seu carrinho e ofertas exclusivas, informe seu WhatsApp.
        </p>

        <div className="relative mb-4">
            <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
                type="tel"
                className="w-full bg-black border border-zinc-700 rounded-xl p-4 pl-12 text-white text-lg font-bold outline-none focus:border-green-500 transition-colors"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                autoFocus
            />
        </div>

        <button 
            onClick={() => phone.length >= 14 && onSubmit(phone)}
            className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors"
        >
            Continuar <ArrowRight size={20} />
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-500">
            <ShieldCheck size={12} className="text-green-500" /> Seus dados estão seguros.
        </div>
      </div>
    </div>
  );
};

export default PhonePromptModal;
