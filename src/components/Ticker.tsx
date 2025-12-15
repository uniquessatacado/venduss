
import React from 'react';
import { Truck, CreditCard, RotateCcw } from 'lucide-react';

const Ticker: React.FC = () => {
  return (
    <div className="bg-black text-white text-xs font-medium py-2 overflow-hidden relative z-50">
      <div className="flex whitespace-nowrap animate-ticker w-full">
        <div className="flex items-center mx-8 space-x-2">
          <Truck size={14} />
          <span>FRETE GRÁTIS PARA TODO O BRASIL</span>
        </div>
        <div className="flex items-center mx-8 space-x-2">
          <CreditCard size={14} />
          <span>PARCELE EM ATÉ 10X SEM JUROS</span>
        </div>
        <div className="flex items-center mx-8 space-x-2">
          <RotateCcw size={14} />
          <span>PRIMEIRA TROCA GRÁTIS</span>
        </div>
        <div className="flex items-center mx-8 space-x-2">
          <Truck size={14} />
          <span>FRETE GRÁTIS PARA TODO O BRASIL</span>
        </div>
        <div className="flex items-center mx-8 space-x-2">
          <CreditCard size={14} />
          <span>PARCELE EM ATÉ 10X SEM JUROS</span>
        </div>
        <div className="flex items-center mx-8 space-x-2">
          <RotateCcw size={14} />
          <span>PRIMEIRA TROCA GRÁTIS</span>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
