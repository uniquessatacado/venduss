import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';

interface HighlightsProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}

// A new, more modern card for categories with text below the image
const CategoryCard: React.FC<{ item: Category; onClick?: () => void; isSelected?: boolean }> = ({ item, onClick, isSelected }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    // Reduced width from w-24/md:w-28 to w-20/md:w-24 for better proportion
    <div className="group cursor-pointer snap-start flex-shrink-0 w-20 md:w-24 flex flex-col items-center" onClick={onClick}>
      {/* Image Container */}
      <div className={`relative aspect-square w-full rounded-full overflow-hidden shadow-lg transition-all duration-300 group-active:scale-95 ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-105' : 'bg-zinc-900'}`}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {/* Skeleton Loader */}
        {!isLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse"></div>}

        {/* Subtle Gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
      
      {/* Text below the image */}
      <div className="mt-2 text-center px-1">
        <h3 className={`font-semibold text-[10px] md:text-xs transition-colors truncate ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>{item.name}</h3>
      </div>
    </div>
  );
};

const Highlights: React.FC<HighlightsProps> = ({ onCategorySelect, selectedCategoryId }) => {
  const { categories } = useStore();

  return (
    <div className="py-2 bg-black border-b border-zinc-900">
       <div className="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 mb-2 pt-4">
         <h2 className="text-lg font-bold text-white">Categorias</h2>
       </div>
      <div 
        className="flex overflow-x-auto gap-4 px-4 sm:px-6 lg:px-8 no-scrollbar py-4 snap-x"
      >
        {categories.map((item) => (
          <CategoryCard 
            key={item.id} 
            item={item} 
            onClick={() => onCategorySelect?.(item.id)}
            isSelected={selectedCategoryId === item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Highlights;