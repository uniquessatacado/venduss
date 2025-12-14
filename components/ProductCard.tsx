import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Heart, Check, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  const { settings } = useStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const isDark = settings.theme === 'dark';

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col cursor-pointer" onClick={() => onQuickView?.(product)}>
      {/* Image Container */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/5 ${!imageLoaded ? 'animate-pulse' : ''} ${isDark ? 'bg-zinc-900' : 'bg-gray-100'}`}>
        
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-black/90 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm z-10 shadow-sm">
            Novo
          </div>
        )}

        <button 
          onClick={toggleFavorite}
          className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 active:scale-90 ${isDark ? 'bg-black/50 hover:bg-black text-white border border-zinc-700' : 'bg-white/80 hover:bg-white border border-gray-100'}`}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : (isDark ? 'text-zinc-300' : 'text-zinc-600')}`} 
          />
        </button>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="group/eye relative transform translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100 bg-white/90 backdrop-blur-md border border-gray-200 text-black p-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-xl"
          >
            <Eye size={22} />
          </button>
        </div>

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 ${
            imageLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-lg scale-110'
          }`}
        />
        
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20 border 
            ${isAdded 
              ? 'bg-green-500 text-white scale-110 opacity-100 translate-y-0 border-green-500' 
              : (isDark ? 'bg-white text-black border-zinc-700 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0' : 'bg-white text-black border-gray-100 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0')
            }
          `}
        >
          {isAdded ? <Check size={20} /> : <Plus size={20} />}
        </button>
      </div>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className={`text-sm font-medium line-clamp-1 transition-colors ${isDark ? 'text-zinc-200 group-hover:text-white' : 'text-zinc-900 group-hover:text-black'}`}>{product.name}</h3>
          <p className="mt-1 text-xs text-zinc-500">{product.category}</p>
        </div>
        <p className={`text-sm font-bold whitespace-nowrap ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;