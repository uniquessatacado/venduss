import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Gift, Upload, X, Search, DollarSign, Percent, Package } from 'lucide-react';
import { Product } from '../../types';

const AdminKits: React.FC = () => {
  const { products, kits, addKit, removeKit } = useStore();
  
  // Kit Info
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  
  // Product Selection Logic
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Product[]>([]); // Products added to kit
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  // Pricing Logic
  const [pricingMode, setPricingMode] = useState<'total' | 'percent' | 'fixed_discount'>('total');
  const [pricingValue, setPricingValue] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Calculations
  const originalTotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  
  const finalPrice = useMemo(() => {
    const val = parseFloat(pricingValue);
    if (isNaN(val) || val < 0) return 0;

    if (pricingMode === 'total') return val;
    if (pricingMode === 'percent') return Math.max(0, originalTotal * (1 - val / 100));
    if (pricingMode === 'fixed_discount') return Math.max(0, originalTotal - val);
    return 0;
  }, [pricingMode, pricingValue, originalTotal]);

  // -- Handlers --

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const initiateAddProduct = (product: Product) => {
    // Check total stock
    const totalStock = product.variants && product.variants.length > 0 
        ? product.variants.reduce((a, b) => a + b.quantity, 0)
        : 1; // Assume 1 if no variants configured but product exists

    if (totalStock <= 0) {
        alert("Produto sem estoque disponível.");
        return;
    }

    // If product has variants, open modal to choose which variant goes into kit
    if (product.variants && product.variants.length > 0) {
        setVariantModalProduct(product);
    } else {
        // Direct add
        addProductToKit(product);
    }
  };

  const addProductToKit = (product: Product, variant?: string) => {
      const item: Product = { ...product, kitVariant: variant };
      setSelectedItems(prev => [...prev, item]);
      setVariantModalProduct(null);
      setSearchTerm(''); // Clear search to continue browsing or searching
  };

  const removeItem = (index: number) => {
      setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedItems.length < 1 || !image) {
        alert("Preencha o nome, imagem e adicione pelo menos um produto.");
        return;
    }

    addKit({
      id: Date.now().toString(),
      name,
      price: parseFloat(finalPrice.toFixed(2)),
      originalPrice: originalTotal,
      products: selectedItems,
      image
    });

    // Reset
    setName('');
    setImage('');
    setSelectedItems([]);
    setPricingValue('');
    setPricingMode('total');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
      
      {/* LEFT COL: Product Search & Selection (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-[calc(100vh-100px)] sticky top-8">
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Search size={20}/> Buscar Produtos</h3>
            
            <input 
                className="w-full bg-black border border-zinc-700 rounded-xl p-3 mb-4 text-white focus:border-white outline-none"
                placeholder="Nome, categoria..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {filteredProducts.map(p => {
                    const totalStock = p.variants?.reduce((a,b) => a + b.quantity, 0) || 0;
                    const hasStock = totalStock > 0;

                    return (
                        <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${hasStock ? 'bg-black border-zinc-800 hover:border-zinc-600' : 'bg-zinc-950/50 border-zinc-900 opacity-60'}`}>
                            <img src={p.image} className="w-12 h-12 object-cover rounded-lg bg-zinc-800" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm text-white truncate">{p.name}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-zinc-500">{p.category}</span>
                                    {hasStock ? (
                                        <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">Estoque: {totalStock}</span>
                                    ) : (
                                        <span className="text-[10px] text-red-500 font-bold">Sem Estoque</span>
                                    )}
                                </div>
                            </div>
                            <button 
                                onClick={() => initiateAddProduct(p)}
                                disabled={!hasStock}
                                className="bg-white text-black p-2 rounded-lg hover:bg-zinc-200 disabled:opacity-50"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    );
                })}
                {filteredProducts.length === 0 && <p className="text-center text-zinc-500 mt-10">Nenhum produto encontrado.</p>}
            </div>
         </div>
      </div>

      {/* RIGHT COL: Kit Configuration (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* 1. Kit Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Gift size={20} /> Configurar Oferta</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Nome do Kit</label>
                    <input 
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-white outline-none"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ex: Kit Verão 2 Peças"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Capa do Kit</label>
                    <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
                    {!image ? (
                        <button onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-zinc-800/50 text-zinc-400 transition-colors">
                            <Upload size={24} /> <span className="text-xs font-bold">Enviar Imagem</span>
                        </button>
                    ) : (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-700">
                            <img src={image} className="w-full h-full object-cover" />
                            <button onClick={() => { setImage(''); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full text-white hover:bg-red-700"><X size={16}/></button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 2. Selected Items */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2"><Package size={20} /> Itens do Kit ({selectedItems.length})</h3>
                <span className="text-sm text-zinc-400">Total Original: <span className="text-white font-bold">R$ {originalTotal.toFixed(2)}</span></span>
            </div>

            {selectedItems.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 text-sm">
                    Selecione produtos na lista ao lado para adicionar.
                </div>
            ) : (
                <div className="space-y-3">
                    {selectedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-black p-3 rounded-xl border border-zinc-800 animate-fade-in">
                            <img src={item.image} className="w-12 h-12 rounded-lg object-cover border border-zinc-700" />
                            <div className="flex-1">
                                <p className="font-bold text-sm text-white">{item.name}</p>
                                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                                    {item.kitVariant && <span className="bg-zinc-800 px-2 py-0.5 rounded text-white">{item.kitVariant}</span>}
                                    <span>R$ {item.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <button onClick={() => removeItem(idx)} className="text-zinc-500 hover:text-red-500 p-2"><Trash2 size={18}/></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* 3. Pricing Strategy */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign size={20} /> Precificação do Kit</h3>
            
            <div className="flex gap-2 mb-4">
                <button onClick={() => setPricingMode('total')} className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase transition-all ${pricingMode === 'total' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}>Valor Final Fixo</button>
                <button onClick={() => setPricingMode('percent')} className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase transition-all ${pricingMode === 'percent' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}>% Desconto</button>
                <button onClick={() => setPricingMode('fixed_discount')} className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase transition-all ${pricingMode === 'fixed_discount' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}>R$ Desconto</button>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">
                        {pricingMode === 'total' ? 'Preço Final do Kit (R$)' : pricingMode === 'percent' ? 'Porcentagem de Desconto (%)' : 'Valor do Desconto (R$)'}
                    </label>
                    <input 
                        type="number"
                        className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-lg font-bold focus:border-green-500 outline-none"
                        value={pricingValue}
                        onChange={e => setPricingValue(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
                <div className="text-right">
                    <p className="text-xs text-zinc-500 uppercase mb-1">Preço Final Calculado</p>
                    <p className="text-3xl font-black text-green-400">R$ {finalPrice.toFixed(2)}</p>
                    {originalTotal > 0 && <p className="text-xs text-red-400 line-through">De: R$ {originalTotal.toFixed(2)}</p>}
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
                <Gift size={22} /> Criar Oferta Agora
            </button>
        </div>

        {/* Existing Kits (Compact View) */}
        <div className="pt-4 border-t border-zinc-800">
            <h4 className="text-sm font-bold text-zinc-500 uppercase mb-4">Ofertas Ativas</h4>
            <div className="grid grid-cols-2 gap-4">
                {kits.map(kit => (
                    <div key={kit.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex gap-3 p-2 group relative">
                        <img src={kit.image} className="w-16 h-16 object-cover rounded bg-black" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{kit.name}</p>
                            <p className="text-xs text-green-400 font-bold">R$ {kit.price.toFixed(2)}</p>
                            <p className="text-[10px] text-zinc-500">{kit.products.length} itens</p>
                        </div>
                        <button onClick={() => removeKit(kit.id)} className="absolute top-2 right-2 text-zinc-600 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                ))}
            </div>
        </div>

      </div>

      {/* Modal for Variant Selection */}
      {variantModalProduct && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 rounded-2xl">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
                  <h3 className="text-lg font-bold text-white mb-2">Selecione a Variação</h3>
                  <p className="text-sm text-zinc-400 mb-4">Qual tamanho do produto <strong>{variantModalProduct.name}</strong> fará parte deste kit?</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                      {variantModalProduct.variants.map((v, idx) => (
                          <button 
                            key={idx}
                            disabled={v.quantity <= 0}
                            onClick={() => addProductToKit(variantModalProduct, v.size)}
                            className="p-3 rounded-xl border border-zinc-700 bg-black hover:border-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                              <span className="block text-lg font-bold text-white">{v.size}</span>
                              <span className="block text-[10px] text-zinc-500">{v.quantity} un</span>
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setVariantModalProduct(null)} className="w-full py-3 bg-zinc-800 rounded-xl font-bold text-zinc-300 hover:text-white">Cancelar</button>
              </div>
          </div>
      )}

      <style>{`
        @keyframes scale-in {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminKits;