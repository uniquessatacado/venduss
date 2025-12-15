
import React, { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface BundleKitProps {
  mainProduct: Product;
  secondaryProduct: Product;
  onAddToCart: (p: Product) => void;
  overridePrice?: number;
  overrideOriginalPrice?: number;
  kitName?: string;
  kitImage?: string;
}

const BundleKit: React.FC<BundleKitProps> = ({ 
  mainProduct, 
  secondaryProduct, 
  onAddToCart,
  overridePrice,
  overrideOriginalPrice,
  kitName,
  kitImage
}) => {
  // If no override provided, calculate default
  const originalTotal = overrideOriginalPrice || (mainProduct.price + secondaryProduct.price);
  const finalPrice = overridePrice || (originalTotal * 0.85);
  const discountAmount = originalTotal - finalPrice;

  // Image Loading States
  const [img1Loaded, setImg1Loaded] = useState(false);
  const [img2Loaded, setImg2Loaded] = useState(false);
  const [kitImgLoaded, setKitImgLoaded] = useState(false);

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            {/* Header Text */}
            <div className="md:w-1/3 text-center md:text-left">
              <span className="text-xs font-bold text-red-400 tracking-widest uppercase bg-red-900/20 px-3 py-1 rounded-full border border-red-900/30">Oferta Especial</span>
              <h3 className="text-2xl font-bold mt-4 mb-2 text-white">{kitName || "Compre o Look Completo"}</h3>
              <p className="text-zinc-400 text-sm mb-6">Leve o kit exclusivo e economize.</p>
              
              <div className="hidden md:block">
                 <button 
                  onClick={() => onAddToCart(mainProduct)} // Just a trigger, the actual handler in App constructs the Kit product
                  className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all flex items-center space-x-2 group w-full md:w-auto justify-center"
                >
                  <span>Adicionar Kit à Sacola</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Visuals */}
            <div className="flex items-center justify-center md:justify-end flex-1 w-full relative">
              
              {kitImage ? (
                 // Single image representation if provided
                  <div className={`relative group w-full max-w-md aspect-video rounded-lg overflow-hidden bg-zinc-800 shadow-2xl border-2 border-zinc-700 z-10 ${!kitImgLoaded ? 'animate-pulse' : ''}`}>
                     <img 
                       src={kitImage} 
                       alt={kitName} 
                       loading="lazy"
                       decoding="async"
                       onLoad={() => setKitImgLoaded(true)}
                       className={`w-full h-full object-cover transition-all duration-700 ${kitImgLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'}`} 
                     />
                  </div>
              ) : (
                <>
                  {/* Product 1 */}
                  <div className={`relative group w-32 md:w-48 aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800 rotate-[-3deg] shadow-2xl border-2 border-zinc-700 z-10 hover:z-20 hover:rotate-0 transition-all duration-500 ${!img1Loaded ? 'animate-pulse' : ''}`}>
                    <img 
                      src={mainProduct.image} 
                      alt={mainProduct.name} 
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setImg1Loaded(true)}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${img1Loaded ? 'opacity-90 group-hover:opacity-100 blur-0' : 'opacity-0 blur-lg'}`} 
                    />
                  </div>

                  {/* Plus Sign */}
                  <div className="z-30 mx-[-10px] bg-zinc-800 rounded-full p-2 shadow-lg border border-zinc-700">
                    <Plus size={20} className="text-white" />
                  </div>

                  {/* Product 2 */}
                  <div className={`relative group w-32 md:w-48 aspect-[3/4] rounded-lg overflow-hidden bg-zinc-800 rotate-[3deg] shadow-2xl border-2 border-zinc-700 z-10 hover:z-20 hover:rotate-0 transition-all duration-500 ${!img2Loaded ? 'animate-pulse' : ''}`}>
                    <img 
                      src={secondaryProduct.image} 
                      alt={secondaryProduct.name} 
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setImg2Loaded(true)}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${img2Loaded ? 'opacity-90 group-hover:opacity-100 blur-0' : 'opacity-0 blur-lg'}`} 
                    />
                  </div>
                </>
              )}
            </div>

             {/* Pricing & Mobile Button */}
             <div className="flex flex-col items-center justify-center md:items-end w-full md:w-auto border-t md:border-t-0 md:border-l border-zinc-800 pt-6 md:pt-0 md:pl-8 mt-6 md:mt-0">
                <div className="text-center md:text-right mb-4">
                  <span className="block text-zinc-500 line-through text-sm">De R$ {originalTotal.toFixed(2).replace('.', ',')}</span>
                  <span className="block text-2xl font-bold text-green-400">Por R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                  <span className="text-xs text-green-400 font-medium bg-green-900/20 px-2 py-0.5 rounded-full mt-1 inline-block border border-green-900/30">Economize R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <button 
                  onClick={() => onAddToCart(mainProduct)}
                  className="md:hidden bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-zinc-200 transition-all w-full shadow-lg active:scale-95"
                >
                  Comprar Kit
                </button>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleKit;
