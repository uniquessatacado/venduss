
import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Trophy, Star, TrendingUp, ArrowLeft } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface TopTrendsProps {
  onBack: () => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

const TopTrends: React.FC<TopTrendsProps> = ({ onBack, onAddToCart, onQuickView }) => {
  const { getTopTrends, products, settings } = useStore();
  const trends = getTopTrends();

  // Filter products based on trends
  const trendProducts = useMemo(() => {
    return products.map(product => {
        let score = 0;
        let matches = [];

        // Calculate "Trend Score" - how many top criteria does this product hit?
        if (trends.topCategory && product.categoryId === trends.topCategory.id) {
            score += 3; // Category is strong
            matches.push(`Categoria Top 1: ${trends.topCategory.name}`);
        }
        if (trends.topBrand && product.brandId === trends.topBrand.id) {
            score += 2;
            matches.push(`Marca Top 1: ${trends.topBrand.name}`);
        }
        if (trends.topColor && product.colorId === trends.topColor.id) {
            score += 2;
            matches.push(`Cor Top 1: ${trends.topColor.name}`);
        }
        // Check if product has variants with the top size
        if (trends.topSize && product.variants?.some(v => v.size === trends.topSize?.name && v.quantity > 0)) {
            score += 1;
            matches.push(`Tamanho Top 1: ${trends.topSize.name}`);
        }

        return { ...product, trendScore: score, trendMatches: matches };
    })
    .filter(p => p.trendScore > 0) // Must match at least one trend
    .sort((a, b) => b.trendScore - a.trendScore); // Sort by most trendy
  }, [products, trends]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
       {/* Hero Header */}
       <div className="relative overflow-hidden bg-gradient-to-b from-yellow-900/20 to-black pt-12 pb-8 px-4 text-center border-b border-yellow-900/30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
          
          <button onClick={onBack} className="absolute top-4 left-4 flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
             <ArrowLeft size={20} /> Voltar
          </button>

          <div className="flex justify-center mb-4">
             <div className="bg-yellow-500/20 p-4 rounded-full border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <Trophy size={48} className="text-yellow-400" />
             </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-2">
             TOP 1 {settings.storeName.toUpperCase()}
          </h1>
          <p className="text-zinc-300 max-w-lg mx-auto text-sm md:text-base">
             Nossa seleção exclusiva dos campeões de venda. Os produtos mais desejados, as marcas mais quentes e as cores do momento.
          </p>
       </div>

       {/* Stats Bar */}
       <div className="bg-black border-b border-zinc-900 overflow-x-auto">
          <div className="flex gap-6 px-4 py-4 min-w-max mx-auto max-w-7xl justify-center">
             {trends.topCategory && (
                <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                   <div className="p-2 bg-black rounded-full"><Star size={16} className="text-yellow-500" /></div>
                   <div className="text-left">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Categoria #1</p>
                      <p className="font-bold text-white leading-none">{trends.topCategory.name}</p>
                   </div>
                </div>
             )}
             {trends.topBrand && (
                <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                   <div className="p-2 bg-black rounded-full"><Star size={16} className="text-yellow-500" /></div>
                   <div className="text-left">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Marca #1</p>
                      <p className="font-bold text-white leading-none">{trends.topBrand.name}</p>
                   </div>
                </div>
             )}
             {trends.topColor && (
                <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                   <div className="p-2 bg-black rounded-full" style={{ border: `1px solid ${trends.topColor.hex}` }}>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: trends.topColor.hex }}></div>
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold">Cor #1</p>
                      <p className="font-bold text-white leading-none">{trends.topColor.name}</p>
                   </div>
                </div>
             )}
          </div>
       </div>

       {/* Grid */}
       <div className="max-w-7xl mx-auto px-4 py-12">
          {trendProducts.length === 0 ? (
             <div className="text-center py-20">
                <p className="text-zinc-500">Nenhum produto em estoque corresponde aos Top 1 atuais.</p>
             </div>
          ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {trendProducts.map(product => (
                   <div key={product.id} className="relative group">
                      {/* Trend Badges */}
                      <div className="absolute -top-3 left-0 right-0 flex justify-center z-20 pointer-events-none">
                         <span className="bg-yellow-500 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <TrendingUp size={10} /> Top 1 Choice
                         </span>
                      </div>
                      
                      {/* Why this product? Tooltip on hover */}
                      <div className="absolute inset-0 bg-black/80 z-30 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl">
                         <p className="text-yellow-400 font-bold mb-2 uppercase text-xs">Por que este produto?</p>
                         <ul className="text-white text-xs space-y-1">
                            {product.trendMatches.map((m: string, i: number) => (
                               <li key={i} className="flex items-center justify-center gap-1">
                                  <Star size={8} className="fill-yellow-500 text-yellow-500" /> {m}
                               </li>
                            ))}
                         </ul>
                      </div>

                      <ProductCard 
                         product={product}
                         onAddToCart={onAddToCart}
                         onQuickView={onQuickView}
                      />
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

export default TopTrends;
