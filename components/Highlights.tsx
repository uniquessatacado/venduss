
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
    <div className="group cursor-pointer snap-start flex-shrink-0 w-[72px] md:w-24 flex flex-col items-center gap-2" onClick={onClick}>
      {/* Container do Anel (Gradiente estilo Instagram/App Moderno) */}
      <div className={`relative p-[3px] rounded-full transition-all duration-300 ${isSelected 
          ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500 shadow-lg shadow-purple-500/20 scale-105' 
          : 'bg-gradient-to-tr from-gray-200 to-gray-300 hover:from-purple-400 hover:to-pink-400'
        }`}>
        
        {/* Borda interna branca/preta para separar a foto do anel */}
        <div className={`p-[2px] rounded-full ${isDark ? 'bg-black' : 'bg-white'}`}>
          <div className="relative aspect-square w-14 md:w-20 rounded-full overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
            {!isLoaded && <div className={`absolute inset-0 animate-pulse ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}></div>}
          </div>
        </div>
      </div>
      
      <div className="text-center px-1 max-w-full">
        <h3 className={`font-medium text-[11px] md:text-xs tracking-tight truncate w-full ${isSelected ? (isDark ? 'text-white font-bold' : 'text-black font-bold') : (isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-black')}`}>
          {item.name}
        </h3>
      </div>
    </div>
  );
};

const Highlights: React.FC<HighlightsProps> = ({ onCategorySelect, selectedCategoryId }) => {
  const { categories, settings } = useStore();
  const isDark = settings.theme === 'dark';

  return (
    <div className={`py-4 ${isDark ? 'bg-black' : 'bg-white'}`}>
       <div className="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 mb-3">
         <h2 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Coleções
         </h2>
       </div>
      <div 
        className="flex overflow-x-auto gap-4 px-4 sm:px-6 lg:px-8 no-scrollbar pb-2 snap-x"
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
