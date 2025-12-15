
import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import ProductCard from './ProductCard';
import Highlights from './Highlights';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  categoryId: string;
  onCategorySelect: (id: string) => void;
  onBack: () => void;
  onAddToCart: (p: Product) => void;
  onQuickView: (p: Product) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId, onCategorySelect, onBack, onAddToCart, onQuickView }) => {
  const { products, categories } = useStore();

  const currentCategory = categories.find(c => c.id === categoryId);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.categoryId === categoryId);
  }, [products, categoryId]);

  return (
    <div className="min-h-screen bg-black text-white animate-fade-in">
      {/* Navigation (Highlights) - Normal Scroll (Not Sticky) */}
      <div className="bg-black">
         <div className="pt-2">
            <Highlights onCategorySelect={onCategorySelect} selectedCategoryId={categoryId} />
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da Categoria */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 gap-4 border-b border-zinc-900">
            <div>
                <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors text-sm font-bold uppercase tracking-wider">
                    <ArrowLeft size={16} /> Voltar ao Início
                </button>
                <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
                    {currentCategory?.name || 'Categoria'}
                </h1>
                <p className="text-zinc-400 mt-2 text-sm">
                    {filteredProducts.length} produtos encontrados
                </p>
            </div>
            
            {/* Filter Placeholder (Visual only for now) */}
            <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700 transition-colors text-sm font-bold">
                <SlidersHorizontal size={16} /> Filtros
            </button>
        </div>

        {/* Grid de Produtos */}
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onQuickView={onQuickView}
                    />
                ))}
            </div>
        ) : (
            <div className="py-32 text-center">
                <p className="text-zinc-500 text-lg">Nenhum produto encontrado nesta categoria no momento.</p>
                <button onClick={onBack} className="mt-4 text-white underline font-bold">Ver todos os produtos</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
