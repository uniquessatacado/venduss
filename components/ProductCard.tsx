import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Heart, Check, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onQuickView }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating if card has a link
    onAddToCart(product);
    
    // Trigger visual feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group relative flex flex-col cursor-pointer" onClick={() => onQuickView?.(product)}>
      {/* Image Container with Skeleton/Pulse effect while loading */}
      <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-zinc-800 shadow-sm transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-white/5 ${!imageLoaded ? 'animate-pulse' : ''}`}>
        
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm z-10 text-black shadow-sm">
            Novo
          </div>
        )}

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/50 shadow-sm transition-all duration-200 border border-white/10 active:scale-90"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart 
            size={18} 
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-white hover:scale-110'}`} 
          />
        </button>

        {/* Quick View / Zoom Icon (Centralized) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
            className="group/eye relative transform translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100 bg-black/30 backdrop-blur-md border border-white/20 text-white p-3.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 pointer-events-auto shadow-xl"
            aria-label="Visualizar Detalhes"
          >
            <Eye size={22} className="group-hover/eye:animate-pulse" />
            
            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover/eye:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg border border-white/10">
              Visualizar detalhes
              {/* Little triangle arrow */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-b border-r border-white/10"></span>
            </span>
          </button>
        </div>

        {/* Image with progressive loading effect */}
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
        
        {/* Add Button with Feedback State */}
        <button 
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`absolute bottom-3 right-3 h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-20
            ${isAdded 
              ? 'bg-green-500 text-white scale-110 opacity-100 translate-y-0' 
              : 'bg-white text-black opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-zinc-200 active:scale-90'
            }
          `}
        >
          {isAdded ? (
            <Check size={20} className="animate-in fade-in zoom-in duration-300" />
          ) : (
            <Plus size={20} />
          )}
        </button>
      </div>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-zinc-100 line-clamp-1 group-hover:text-white transition-colors">{product.name}</h3>
          <p className="mt-1 text-xs text-zinc-500">{product.category}</p>
        </div>
        <p className="text-sm font-semibold text-zinc-100 whitespace-nowrap">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;