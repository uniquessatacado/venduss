import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, AlertTriangle, CheckCircle, Percent, DollarSign, Filter, Search } from 'lucide-react';

const AdminPromotions: React.FC = () => {
  const { products, categories, brands, colors, sizeGrids, applyBulkPromotion } = useStore();
  
  // Filters
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  
  // Promo Config
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableSubcats = categories.find(c => c.id === selectedCat)?.subcategories || [];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        if (selectedCat && p.categoryId !== selectedCat) return false;
        if (selectedSub && p.subcategoryId !== selectedSub) return false;
        if (selectedBrand && p.brandId !== selectedBrand) return false;
        if (selectedColor && p.colorId !== selectedColor) return false;
        return true;
    });
  }, [products, selectedCat, selectedSub, selectedBrand, selectedColor]);

  // Determine if costs are uniform
  const uniqueCosts = new Set(filteredProducts.map(p => p.costPrice));
  const hasUniformCost = uniqueCosts.size === 1;
  const canUseFixedDiscount = hasUniformCost;

  const handleApply = () => {
      if (!discountValue || !endDate) {
          alert("Preencha o valor e a data de término.");
          return;
      }
      if (filteredProducts.length === 0) {
          alert("Nenhum produto selecionado.");
          return;
      }

      applyBulkPromotion(
          { categoryId: selectedCat, subcategoryId: selectedSub, brandId: selectedBrand, colorId: selectedColor },
          discountType,
          parseFloat(discountValue),
          endDate
      );

      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      
      // Reset
      setDiscountValue('');
      setEndDate('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {/* Configuration Panel */}
       <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Tag className="text-red-500"/> Criar Promoção em Lote</h2>
          
          {/* Filters */}
          <div className="space-y-4 mb-8">
             <h4 className="text-sm font-bold text-zinc-500 uppercase flex items-center gap-2"><Filter size={14}/> Filtros de Seleção</h4>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-zinc-400 block mb-1">Categoria</label>
                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white" value={selectedCat} onChange={e => {setSelectedCat(e.target.value); setSelectedSub('');}}>
                        <option value="">Todas</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-400 block mb-1">Subcategoria</label>
                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white" value={selectedSub} onChange={e => setSelectedSub(e.target.value)} disabled={!selectedCat}>
                        <option value="">Todas</option>
                        {availableSubcats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-400 block mb-1">Marca</label>
                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white" value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                        <option value="">Todas</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-400 block mb-1">Cor</label>
                    <select className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white" value={selectedColor} onChange={e => setSelectedColor(e.target.value)}>
                        <option value="">Todas</option>
                        {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
             </div>
             <div className="bg-black p-3 rounded-lg border border-zinc-800 text-sm text-zinc-400 flex justify-between">
                <span>Produtos Encontrados:</span>
                <span className="font-bold text-white">{filteredProducts.length}</span>
             </div>
          </div>

          {/* Rules */}
          <div className="space-y-4 border-t border-zinc-800 pt-6">
             <h4 className="text-sm font-bold text-zinc-500 uppercase">Regras de Desconto</h4>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => setDiscountType('percent')}
                  className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-1 ${discountType === 'percent' ? 'bg-red-900/20 border-red-500 text-red-400' : 'bg-black border-zinc-700 text-zinc-500'}`}
                >
                   <Percent size={20} />
                   <span className="text-xs font-bold">Porcentagem</span>
                </button>
                <button 
                  onClick={() => canUseFixedDiscount && setDiscountType('fixed')}
                  disabled={!canUseFixedDiscount}
                  className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-1 ${discountType === 'fixed' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-black border-zinc-700 text-zinc-500'} ${!canUseFixedDiscount && 'opacity-50 cursor-not-allowed'}`}
                >
                   <DollarSign size={20} />
                   <span className="text-xs font-bold">Valor Fixo (R$)</span>
                </button>
             </div>

             {!canUseFixedDiscount && (
                 <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-yellow-500 text-xs flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>Desconto em valor fixo bloqueado pois os produtos selecionados possuem <strong>custos diferentes</strong>. Use porcentagem para garantir margem de lucro.</p>
                 </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase mb-1">
                      {discountType === 'percent' ? 'Porcentagem de Desconto (%)' : 'Valor de Desconto (R$)'}
                   </label>
                   <input 
                     type="number" 
                     className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-white outline-none"
                     value={discountValue}
                     onChange={e => setDiscountValue(e.target.value)}
                     placeholder="0"
                   />
                </div>
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase mb-1">Válido Até</label>
                   <input 
                     type="date" 
                     className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-white outline-none"
                     value={endDate}
                     onChange={e => setEndDate(e.target.value)}
                   />
                </div>
             </div>

             <button 
               onClick={handleApply}
               disabled={filteredProducts.length === 0}
               className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-colors mt-4 disabled:opacity-50"
             >
               Aplicar Promoção em {filteredProducts.length} Produtos
             </button>

             {isSuccess && (
               <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-center font-bold animate-fade-in flex items-center justify-center gap-2">
                  <CheckCircle size={18} /> Promoção Aplicada com Sucesso!
               </div>
             )}
          </div>
       </div>

       {/* Preview List */}
       <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col h-[600px]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Search size={20}/> Pré-visualização</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
             {filteredProducts.length === 0 ? (
               <p className="text-zinc-500 text-center mt-20">Selecione filtros para ver os produtos afetados.</p>
             ) : (
               filteredProducts.map(p => {
                 let newPrice = p.price;
                 if (discountValue) {
                    if (discountType === 'percent') {
                        newPrice = p.price * (1 - (parseFloat(discountValue) / 100));
                    } else {
                        newPrice = Math.max(0, p.price - parseFloat(discountValue));
                    }
                 }
                 
                 return (
                   <div key={p.id} className="bg-black p-3 rounded-lg border border-zinc-800 flex gap-3">
                      <img src={p.image} className="w-12 h-16 object-cover rounded bg-zinc-800" />
                      <div className="flex-1">
                         <p className="font-bold text-sm text-white line-clamp-1">{p.name}</p>
                         <p className="text-xs text-zinc-500">{p.category} | Cost: R$ {p.costPrice}</p>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs line-through text-zinc-500">R$ {p.price.toFixed(2)}</span>
                            <span className="text-sm font-bold text-red-400">R$ {newPrice.toFixed(2)}</span>
                         </div>
                      </div>
                   </div>
                 );
               })
             )}
          </div>
       </div>
    </div>
  );
};

export default AdminPromotions;