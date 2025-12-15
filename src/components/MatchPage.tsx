
import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, ArrowLeft, Heart, Check, ShoppingBag } from 'lucide-react';
import ProductCard from './ProductCard';

interface MatchPageProps {
  onBack: () => void;
  onAddToCart: (p: any) => void;
  onQuickView: (p: any) => void;
}

const MatchPage: React.FC<MatchPageProps> = ({ onBack, onAddToCart, onQuickView }) => {
  const { currentUser, getMatchingProducts } = useStore();

  const matchData = useMemo(() => {
      if (!currentUser) return null;
      return getMatchingProducts(currentUser.id);
  }, [currentUser, getMatchingProducts]);

  if (!currentUser) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
              <Sparkles size={48} className="text-zinc-700 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Faça Login</h2>
              <p className="text-zinc-400 mb-6">Para ver seus produtos "Match", você precisa entrar na sua conta.</p>
              <button onClick={onBack} className="text-white underline">Voltar</button>
          </div>
      );
  }

  if (!matchData || matchData.products.length === 0) {
      return (
          <div className="min-h-screen bg-black text-white pb-20">
             <div className="p-4">
                <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white"><ArrowLeft size={20}/> Voltar</button>
             </div>
             <div className="flex flex-col items-center justify-center mt-20 px-4 text-center">
                 <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
                    <Heart size={32} className="text-zinc-600" />
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Ainda estamos te conhecendo!</h2>
                 <p className="text-zinc-400 max-w-md">Faça mais algumas compras para que nossa inteligência artificial encontre o "Match" perfeito para o seu estilo.</p>
             </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
       {/* Hero Match */}
       <div className="relative bg-gradient-to-b from-purple-900/40 via-black to-black border-b border-purple-900/20 pt-12 pb-10 px-4 text-center">
          <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
             <ArrowLeft size={20} /> Voltar
          </button>
          
          <div className="flex justify-center mb-4">
             <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full shadow-2xl relative z-10">
                    <Sparkles size={40} className="text-white" />
                </div>
             </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-2">
             IT'S A MATCH!
          </h1>
          <p className="text-purple-200/80 max-w-lg mx-auto text-sm md:text-base mb-6">
             Uma seleção curada por I.A. baseada unicamente no seu estilo e histórico de compras.
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
             {matchData.reasons.map((reason, idx) => (
                 <span key={idx} className="bg-purple-900/30 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check size={12} /> {reason}
                 </span>
             ))}
          </div>
       </div>

       {/* Grid */}
       <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 mb-8">
             <ShoppingBag size={20} className="text-purple-500" />
             <h2 className="text-xl font-bold">Escolhidos para você</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
             {matchData.products.map(product => (
                <div key={product.id} className="relative group">
                   <div className="absolute -top-3 right-2 z-20">
                      <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg flex items-center gap-1">
                         <Heart size={10} className="fill-white" /> Match 99%
                      </span>
                   </div>
                   <ProductCard 
                      product={product}
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                   />
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default MatchPage;
