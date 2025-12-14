import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Category } from '../types';

interface HighlightsProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string | null;
}

const CategoryCard: React.FC<{ item: Category; onClick?: () => void; isSelected?: boolean; isDark: boolean }> = ({ item, onClick, isSelected, isDark }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group cursor-pointer snap-start flex-shrink-0 w-20 md:w-24 flex flex-col items-center" onClick={onClick}>
      <div className={`relative aspect-square w-full rounded-full overflow-hidden shadow-sm transition-all duration-300 group-active:scale-95 ${isSelected ? 'ring-2 ring-offset-2 scale-105' : ''} ${isDark ? 'bg-zinc-800 ring-white ring-offset-black' : 'bg-gray-100 ring-black ring-offset-white'}`}>
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {!isLoaded && <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="mt-2 text-center px-1">
        <h3 className={`font-semibold text-[10px] md:text-xs transition-colors truncate ${isSelected ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-zinc-400 group-hover:text-white' : 'text-zinc-600 group-hover:text-black')}`}>{item.name}</h3>
      </div>
    </div>
  );
};

const Highlights: React.FC<HighlightsProps> = ({ onCategorySelect, selectedCategoryId }) => {
  const { categories, settings } = useStore();
  const isDark = settings.theme === 'dark';

  return (
    <div className={`py-2 border-b ${isDark ? 'bg-black border-zinc-800' : 'bg-white border-gray-100'}`}>
       <div className="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 mb-2 pt-4">
         <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Categorias</h2>
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
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
};

export default Highlights;