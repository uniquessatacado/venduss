
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, ArrowLeft, Upload, X, Tag, List, Search, Box } from 'lucide-react';
import { UpsellOffer, Product } from '../../types';

const AdminUpsells: React.FC = () => {
  const { upsellOffers, addUpsellOffer, removeUpsellOffer, categories, products } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newOffer, setNewOffer] = useState<Partial<UpsellOffer>>({
      active: true,
      title: '',
      bannerImage: '',
      triggerCategoryIds: [],
      triggerSubcategories: [],
      offerType: 'automatic',
      specificProductIds: [],
      sourceCategoryId: '',
      sourceSubcategory: '',
      productCount: 1,
      promoPrice: 0,
      originalPrice: 0,
      sizeRequired: false
  });

  // Product Selection State
  const [searchTerm, setSearchTerm] = useState('');

  // Derived
  const sourceCategory = categories.find(c => c.id === newOffer.sourceCategoryId);
  const availableSubcats = sourceCategory ? sourceCategory.subcategories : [];

  const filteredProducts = useMemo(() => {
      if (!searchTerm) return [];
      return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  // Auto calculate Original Price in Manual Mode
  useEffect(() => {
      if (newOffer.offerType === 'manual' && newOffer.specificProductIds) {
          const selectedProds = products.filter(p => newOffer.specificProductIds?.includes(p.id));
          const totalOriginal = selectedProds.reduce((acc, p) => acc + p.price, 0);
          setNewOffer(prev => ({ ...prev, originalPrice: totalOriginal }));
      }
  }, [newOffer.specificProductIds, newOffer.offerType, products]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewOffer(prev => ({ ...prev, bannerImage: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const toggleSubcategoryTrigger = (subcat: string, catId: string) => {
      setNewOffer(prev => {
          const currentSubs = prev.triggerSubcategories || [];
          const currentCats = prev.triggerCategoryIds || [];
          
          let newSubs = currentSubs;
          let newCats = currentCats;

          if (currentSubs.includes(subcat)) {
              newSubs = currentSubs.filter(s => s !== subcat);
          } else {
              newSubs = [...currentSubs, subcat];
          }
          
          // Ensure parent category is in triggerCategoryIds if any of its subs are selected
          if (!currentCats.includes(catId)) {
              newCats = [...currentCats, catId];
          }

          return { ...prev, triggerSubcategories: newSubs, triggerCategoryIds: newCats };
      });
  };

  const toggleSpecificProduct = (productId: string) => {
      setNewOffer(prev => {
          const current = prev.specificProductIds || [];
          if (current.includes(productId)) {
              return { ...prev, specificProductIds: current.filter(id => id !== productId) };
          } else {
              return { ...prev, specificProductIds: [...current, productId] };
          }
      });
  };

  const handleSubmit = () => {
      if (!newOffer.title || !newOffer.bannerImage || (newOffer.triggerSubcategories?.length || 0) === 0) {
          alert("Preencha título, imagem e selecione pelo menos uma subcategoria de gatilho.");
          return;
      }

      if (newOffer.offerType === 'manual' && (newOffer.specificProductIds?.length || 0) === 0) {
          alert("Selecione pelo menos um produto para a oferta manual.");
          return;
      }

      if (newOffer.offerType === 'automatic' && (!newOffer.sourceCategoryId || !newOffer.sourceSubcategory)) {
          alert("Selecione a categoria e subcategoria de origem para o modo automático.");
          return;
      }

      addUpsellOffer({
          id: Date.now().toString(),
          active: newOffer.active ?? true,
          title: newOffer.title!,
          bannerImage: newOffer.bannerImage!,
          triggerCategoryIds: newOffer.triggerCategoryIds!,
          triggerSubcategories: newOffer.triggerSubcategories!,
          offerType: newOffer.offerType || 'automatic',
          specificProductIds: newOffer.offerType === 'manual' ? newOffer.specificProductIds : undefined,
          sourceCategoryId: newOffer.offerType === 'automatic' ? newOffer.sourceCategoryId : undefined,
          sourceSubcategory: newOffer.offerType === 'automatic' ? newOffer.sourceSubcategory : undefined,
          productCount: newOffer.productCount || 1,
          promoPrice: Number(newOffer.promoPrice),
          originalPrice: Number(newOffer.originalPrice),
          sizeRequired: false // Managed by profile logic now
      });

      setIsCreating(false);
      setNewOffer({ active: true, title: '', bannerImage: '', triggerCategoryIds: [], triggerSubcategories: [], offerType: 'automatic', specificProductIds: [], sourceCategoryId: '', sourceSubcategory: '', productCount: 1, promoPrice: 0, originalPrice: 0, sizeRequired: false });
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold flex items-center gap-2">
               <ArrowLeft className="text-red-500" /> Ofertas Upsell (Pop-ups)
           </h2>
           <button onClick={() => setIsCreating(true)} className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-zinc-200">
               <Plus size={18} /> Nova Oferta
           </button>
       </div>

       {isCreating ? (
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-4xl mx-auto">
               <h3 className="text-xl font-bold mb-6">Configurar Oferta</h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* LEFT COLUMN */}
                   <div className="space-y-6">
                       <div>
                           <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Título da Oferta</label>
                           <input 
                               className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" 
                               placeholder="Ex: Kit 3 Cuecas Premium"
                               value={newOffer.title}
                               onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                           />
                       </div>

                       <div>
                           <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Banner (Pop-up)</label>
                           <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
                           {!newOffer.bannerImage ? (
                               <button onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-800">
                                   <Upload size={24} /> <span className="text-xs font-bold">Enviar Imagem</span>
                               </button>
                           ) : (
                               <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden border border-zinc-700">
                                   <img src={newOffer.bannerImage} className="w-full h-full object-cover opacity-70" />
                                   <button onClick={() => { setNewOffer({...newOffer, bannerImage: ''}); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white"><X size={14}/></button>
                               </div>
                           )}
                       </div>

                       <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-500 uppercase block">Gatilhos (Subcategorias)</label>
                           <p className="text-[10px] text-zinc-400 mb-2">Selecione as subcategorias que, ao serem exploradas, ativam este upsell.</p>
                           <div className="bg-black p-4 rounded-lg border border-zinc-800 max-h-60 overflow-y-auto">
                               {categories.map(cat => (
                                   <div key={cat.id} className="mb-4">
                                       <p className="text-xs font-bold text-white mb-2">{cat.name}</p>
                                       <div className="flex flex-wrap gap-2">
                                           {cat.subcategories.map(sub => (
                                               <button
                                                   key={sub}
                                                   onClick={() => toggleSubcategoryTrigger(sub, cat.id)}
                                                   className={`px-3 py-1 rounded text-xs border transition-colors ${newOffer.triggerSubcategories?.includes(sub) ? 'bg-red-900/40 border-red-500 text-red-200' : 'bg-zinc-900 border-zinc-700 text-zinc-400'}`}
                                               >
                                                   {sub}
                                               </button>
                                           ))}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>

                   {/* RIGHT COLUMN */}
                   <div className="space-y-6">
                       <div>
                           <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Produtos da Oferta</label>
                           
                           <div className="flex gap-2 mb-4 bg-black p-1 rounded-lg border border-zinc-800 w-fit">
                               <button onClick={() => setNewOffer({...newOffer, offerType: 'automatic'})} className={`px-4 py-2 rounded text-xs font-bold ${newOffer.offerType === 'automatic' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Automático</button>
                               <button onClick={() => setNewOffer({...newOffer, offerType: 'manual'})} className={`px-4 py-2 rounded text-xs font-bold ${newOffer.offerType === 'manual' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Manual</button>
                           </div>

                           {newOffer.offerType === 'automatic' && (
                               <div className="space-y-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                                   <div className="grid grid-cols-2 gap-4">
                                       <div>
                                           <label className="text-xs text-zinc-500 mb-1 block">Origem (Cat)</label>
                                           <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-xs" value={newOffer.sourceCategoryId} onChange={e => setNewOffer({...newOffer, sourceCategoryId: e.target.value, sourceSubcategory: ''})}>
                                               <option value="">Selecione...</option>
                                               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                           </select>
                                       </div>
                                       <div>
                                           <label className="text-xs text-zinc-500 mb-1 block">Origem (Sub)</label>
                                           <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white text-xs" value={newOffer.sourceSubcategory} onChange={e => setNewOffer({...newOffer, sourceSubcategory: e.target.value})} disabled={!newOffer.sourceCategoryId}>
                                               <option value="">Selecione...</option>
                                               {availableSubcats.map(s => <option key={s} value={s}>{s}</option>)}
                                           </select>
                                       </div>
                                   </div>
                                   <div>
                                       <label className="text-xs text-zinc-500 mb-1 block">Quantidade de Produtos</label>
                                       <input type="number" className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white" value={newOffer.productCount} onChange={e => setNewOffer({...newOffer, productCount: parseInt(e.target.value)})} min={1} />
                                   </div>
                               </div>
                           )}

                           {newOffer.offerType === 'manual' && (
                               <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                                   <div className="relative">
                                       <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                       <input className="w-full bg-black border border-zinc-700 rounded-lg p-2 pl-9 text-white text-sm" placeholder="Buscar produtos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                   </div>
                                   
                                   {searchTerm && (
                                       <div className="max-h-60 overflow-y-auto border border-zinc-800 rounded bg-black/50 p-2">
                                           {filteredProducts.map(p => {
                                               const isSelected = newOffer.specificProductIds?.includes(p.id);
                                               return (
                                                   <div key={p.id} onClick={() => toggleSpecificProduct(p.id)} className={`flex items-center gap-3 p-2 cursor-pointer rounded ${isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800'}`}>
                                                       <img src={p.image} className="w-16 h-16 rounded object-cover border border-zinc-600" />
                                                       <div className="flex-1">
                                                           <p className="text-sm text-white font-bold">{p.name}</p>
                                                           <p className="text-xs text-zinc-500">R$ {p.price.toFixed(2)}</p>
                                                       </div>
                                                       {isSelected && <div className="w-4 h-4 bg-green-500 rounded-full" />}
                                                   </div>
                                               );
                                           })}
                                       </div>
                                   )}
                                   <div className="flex flex-wrap gap-2 mt-2">
                                       {newOffer.specificProductIds?.map(pid => {
                                           const p = products.find(prod => prod.id === pid);
                                           if (!p) return null;
                                           return (
                                               <div key={pid} className="flex items-center gap-2 bg-black border border-zinc-700 px-2 py-1 rounded text-xs text-white">
                                                   <img src={p.image} className="w-6 h-6 rounded" />
                                                   <span>{p.name}</span>
                                                   <button onClick={() => toggleSpecificProduct(pid)} className="text-red-500"><X size={12}/></button>
                                               </div>
                                           );
                                       })}
                                   </div>
                               </div>
                           )}
                       </div>

                       <div className="grid grid-cols-2 gap-4 bg-black p-4 rounded-xl border border-zinc-800">
                           <div>
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Preço Por (Final)</label>
                               <input type="number" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white font-bold text-lg text-green-400" value={newOffer.promoPrice} onChange={e => setNewOffer({...newOffer, promoPrice: e.target.value as any})} />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Preço Original</label>
                               <input 
                                   type="number" 
                                   className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-zinc-400" 
                                   value={newOffer.originalPrice} 
                                   onChange={e => setNewOffer({...newOffer, originalPrice: e.target.value as any})} 
                                   disabled={newOffer.offerType === 'manual'} // Auto-sum in manual
                               />
                           </div>
                       </div>
                   </div>
               </div>

               <div className="flex gap-3 pt-6 border-t border-zinc-800 mt-6">
                   <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-lg border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-800">Cancelar</button>
                   <button onClick={handleSubmit} className="flex-1 py-3 rounded-lg bg-white text-black font-bold hover:bg-zinc-200">Salvar Oferta</button>
               </div>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {upsellOffers.map(offer => (
                   <div key={offer.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group relative">
                       <div className="h-32 bg-black relative">
                           <img src={offer.bannerImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                           <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                               {offer.active ? 'Ativa' : 'Inativa'}
                           </div>
                       </div>
                       <div className="p-4">
                           <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                           <div className="flex items-baseline gap-2 mt-1 mb-3">
                               <span className="text-green-400 font-bold text-xl">R$ {offer.promoPrice.toFixed(2)}</span>
                               <span className="text-zinc-500 line-through text-xs">R$ {offer.originalPrice.toFixed(2)}</span>
                           </div>
                           
                           <div className="flex flex-wrap gap-1 mb-3">
                               <span className="text-[10px] text-zinc-500 font-bold uppercase w-full">Gatilhos:</span>
                               {offer.triggerSubcategories.slice(0, 5).map(sub => (
                                   <span key={sub} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">{sub}</span>
                               ))}
                               {offer.triggerSubcategories.length > 5 && <span className="text-[10px] text-zinc-500">+{offer.triggerSubcategories.length - 5}</span>}
                           </div>

                           <button onClick={() => removeUpsellOffer(offer.id)} className="mt-2 w-full py-2 bg-zinc-800 hover:bg-red-900/30 hover:text-red-400 text-zinc-400 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2">
                               <Trash2 size={14} /> Remover
                           </button>
                       </div>
                   </div>
               ))}
               {upsellOffers.length === 0 && <p className="text-zinc-500 col-span-full text-center py-10">Nenhuma oferta cadastrada.</p>}
           </div>
       )}
    </div>
  );
};

export default AdminUpsells;
