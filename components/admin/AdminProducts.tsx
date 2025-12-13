
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Upload, Copy, Tag, Check, X, Image as ImageIcon, Video, Box, DollarSign } from 'lucide-react';
import { Product, ProductVariant, Category } from '../../types';

const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, removeProduct, duplicateProduct, categories, addCategory, updateCategory, brands, addBrand, colors, addColor, sizeGrids, addSizeGrid, currentTenant } = useStore();
  
  // State for Form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', internalCode: '', price: 0, costPrice: 0,
    categoryId: '', subcategoryId: '', brandId: '', colorId: '',
    image: '', galleryImages: [], video: '',
    sizeGridId: '', variants: [],
    dimensions: { weight: 0, length: 0, height: 0, width: 0 }
  });

  // Promo Modal
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [selectedProductForPromo, setSelectedProductForPromo] = useState<Product | null>(null);
  const [promoPrice, setPromoPrice] = useState('');
  const [promoDate, setPromoDate] = useState('');

  // Quick Create Modal States
  const [activeModal, setActiveModal] = useState<'category' | 'subcategory' | 'brand' | 'color' | 'grid' | null>(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newGridName, setNewGridName] = useState('');
  const [newGridSizes, setNewGridSizes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when a size grid is selected
  useEffect(() => {
    if (formData.sizeGridId) {
      const grid = sizeGrids.find(g => g.id === formData.sizeGridId);
      if (grid) {
        // Keep existing quantities if possible, else init to 0
        const newVariants = grid.sizes.map(size => {
          const existing = formData.variants?.find(v => v.size === size);
          return existing || { size, quantity: 0 };
        });
        setFormData(prev => ({ ...prev, variants: newVariants }));
      }
    }
  }, [formData.sizeGridId, sizeGrids]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions!, [field]: parseFloat(value) || 0 } }));
  };

  const handleVariantChange = (index: number, qty: string) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index].quantity = parseInt(qty) || 0;
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (isMain) {
      const reader = new FileReader();
      reader.onloadend = () => handleInputChange('image', reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      // Gallery (limit to 3)
      Array.from(files).slice(0, 3).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
             setFormData(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), reader.result as string].slice(0,3) }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      handleInputChange('video', videoUrl);
    }
  };

  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setNewCatImage(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  // --- QUICK CREATE HANDLERS ---

  const saveQuickCategory = () => {
      if(!newCatName || !newCatImage) return alert("Preencha nome e foto.");
      const newCat = addCategory({
          id: Date.now().toString(),
          name: newCatName,
          image: newCatImage,
          subcategories: []
      });
      handleInputChange('categoryId', newCat.id);
      setActiveModal(null);
      setNewCatName('');
      setNewCatImage('');
  };

  const saveQuickSubcategory = () => {
      if(!newSubName) return alert("Preencha o nome da subcategoria.");
      const catId = formData.categoryId;
      if(!catId) return alert("Selecione uma categoria primeiro.");
      
      const category = categories.find(c => c.id === catId);
      if(category) {
          const updatedCat = { ...category, subcategories: [...category.subcategories, newSubName] };
          updateCategory(updatedCat);
          handleInputChange('subcategoryId', newSubName);
      }
      setActiveModal(null);
      setNewSubName('');
  };

  const saveQuickBrand = () => {
      if(!newBrandName) return alert("Preencha o nome da marca.");
      const newBrand = addBrand({ id: Date.now().toString(), name: newBrandName });
      handleInputChange('brandId', newBrand.id);
      setActiveModal(null);
      setNewBrandName('');
  };

  const saveQuickColor = () => {
      if(!newColorName) return alert("Preencha o nome da cor.");
      const newColor = addColor({ id: Date.now().toString(), name: newColorName, hex: newColorHex });
      handleInputChange('colorId', newColor.id);
      setActiveModal(null);
      setNewColorName('');
      setNewColorHex('#000000');
  };

  const saveQuickGrid = () => {
      if(!newGridName || !newGridSizes) return alert("Preencha nome e tamanhos.");
      const newGrid = addSizeGrid({
          id: Date.now().toString(),
          name: newGridName,
          sizes: newGridSizes.split(',').map(s => s.trim().toUpperCase()).filter(s => s)
      });
      handleInputChange('sizeGridId', newGrid.id);
      setActiveModal(null);
      setNewGridName('');
      setNewGridSizes('');
  };

  // -----------------------------

  const handleDuplicate = (product: Product) => {
      const newProduct = duplicateProduct(product);
      setFormData(newProduct);
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.image) {
        alert("Preencha os campos obrigatórios (Nome, Preço, Imagem Principal)");
        return;
    }

    const category = categories.find(c => c.id === formData.categoryId);
    const finalProduct: Product = {
        id: isEditing && formData.id ? formData.id : Date.now().toString(),
        tenantId: formData.tenantId || currentTenant?.id || 'unknown',
        name: formData.name,
        internalCode: formData.internalCode,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || 0),
        costPrice: Number(formData.costPrice || 0),
        categoryId: formData.categoryId!,
        category: category?.name || 'Geral',
        subcategoryId: formData.subcategoryId,
        brandId: formData.brandId,
        colorId: formData.colorId,
        image: formData.image,
        galleryImages: formData.galleryImages || [],
        video: formData.video,
        variants: formData.variants || [],
        dimensions: formData.dimensions || { weight: 0, length: 0, width: 0, height: 0 },
        isNew: true
    };

    if (isEditing) {
        updateProduct(finalProduct);
        setIsEditing(false);
    } else {
        addProduct(finalProduct);
    }
    
    // Reset Form
    setFormData({
        name: '', internalCode: '', price: 0, costPrice: 0, categoryId: '', subcategoryId: '', brandId: '', colorId: '',
        image: '', galleryImages: [], video: '', sizeGridId: '', variants: [], dimensions: { weight: 0, length: 0, height: 0, width: 0 }
    });
  };

  const openPromoModal = (product: Product) => {
    setSelectedProductForPromo(product);
    setPromoPrice(product.promoPrice ? String(product.promoPrice) : '');
    setPromoDate(product.promoEndsAt ? product.promoEndsAt.split('T')[0] : '');
    setPromoModalOpen(true);
  };

  const savePromotion = () => {
    if (selectedProductForPromo) {
        updateProduct({
            ...selectedProductForPromo,
            promoPrice: promoPrice ? parseFloat(promoPrice) : undefined,
            promoEndsAt: promoDate ? new Date(promoDate).toISOString() : undefined
        });
    }
    setPromoModalOpen(false);
  };

  const availableSubcats = categories.find(c => c.id === formData.categoryId)?.subcategories || [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* --- PRODUCT FORM --- */}
      <div className="xl:col-span-2">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Basic Info */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Informações Básicas</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Nome do Produto *</label>
                    <input className="input" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">Código Interno</label>
                    <input className="input" value={formData.internalCode} onChange={e => handleInputChange('internalCode', e.target.value)} />
                  </div>
               </div>
            </div>

            {/* 2. Classification */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Classificação</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {/* CATEGORY INPUT WITH ADD BUTTON */}
                   <div>
                       <label className="label">Categoria</label>
                       <div className="flex gap-2">
                           <select className="input" value={formData.categoryId} onChange={e => handleInputChange('categoryId', e.target.value)}>
                               <option value="">Selecione...</option>
                               {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                           <button type="button" onClick={() => setActiveModal('category')} className="bg-zinc-800 p-2 rounded border border-zinc-700 hover:bg-zinc-700"><Plus size={16}/></button>
                       </div>
                   </div>
                   
                   {/* SUBCATEGORY INPUT WITH ADD BUTTON */}
                   <div>
                       <label className="label">Subcategoria</label>
                       <div className="flex gap-2">
                           <select className="input" value={formData.subcategoryId} onChange={e => handleInputChange('subcategoryId', e.target.value)} disabled={!formData.categoryId}>
                               <option value="">Selecione...</option>
                               {availableSubcats.map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                           <button type="button" onClick={() => setActiveModal('subcategory')} disabled={!formData.categoryId} className="bg-zinc-800 p-2 rounded border border-zinc-700 hover:bg-zinc-700 disabled:opacity-50"><Plus size={16}/></button>
                       </div>
                   </div>

                   {/* BRAND INPUT WITH ADD BUTTON */}
                   <div>
                       <label className="label">Marca</label>
                       <div className="flex gap-2">
                           <select className="input" value={formData.brandId} onChange={e => handleInputChange('brandId', e.target.value)}>
                               <option value="">Selecione...</option>
                               {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                           </select>
                           <button type="button" onClick={() => setActiveModal('brand')} className="bg-zinc-800 p-2 rounded border border-zinc-700 hover:bg-zinc-700"><Plus size={16}/></button>
                       </div>
                   </div>

                   {/* COLOR INPUT WITH ADD BUTTON */}
                   <div>
                       <label className="label">Cor</label>
                       <div className="flex gap-2">
                           <select className="input" value={formData.colorId} onChange={e => handleInputChange('colorId', e.target.value)}>
                               <option value="">Selecione...</option>
                               {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                           <button type="button" onClick={() => setActiveModal('color')} className="bg-zinc-800 p-2 rounded border border-zinc-700 hover:bg-zinc-700"><Plus size={16}/></button>
                       </div>
                   </div>
               </div>
            </div>

            {/* 3. Pricing & Logistics */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Preços e Logística</h4>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                     <label className="label text-green-400">Preço de Venda (Atual) R$</label>
                     <input type="number" step="0.01" className="input border-green-900/50 focus:border-green-500" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} required />
                  </div>
                  <div>
                     <label className="label text-zinc-400">Preço Original (Riscar) R$</label>
                     <input type="number" step="0.01" className="input" value={formData.originalPrice || ''} onChange={e => handleInputChange('originalPrice', e.target.value)} />
                  </div>
                  <div>
                     <label className="label text-yellow-500">Preço de Custo (R$)</label>
                     <input type="number" step="0.01" className="input border-yellow-900/50 focus:border-yellow-500" value={formData.costPrice} onChange={e => handleInputChange('costPrice', e.target.value)} />
                  </div>
                  <div>
                     <label className="label">Peso (g)</label>
                     <input type="number" className="input" value={formData.dimensions?.weight} onChange={e => handleDimensionChange('weight', e.target.value)} />
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                   <div>
                     <label className="label">Comp. (cm)</label>
                     <input type="number" className="input" value={formData.dimensions?.length} onChange={e => handleDimensionChange('length', e.target.value)} />
                   </div>
                   <div>
                     <label className="label">Alt. (cm)</label>
                     <input type="number" className="input" value={formData.dimensions?.height} onChange={e => handleDimensionChange('height', e.target.value)} />
                   </div>
                   <div>
                     <label className="label">Larg. (cm)</label>
                     <input type="number" className="input" value={formData.dimensions?.width} onChange={e => handleDimensionChange('width', e.target.value)} />
                   </div>
               </div>
            </div>

            {/* 4. Stock (Size Grid) */}
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Estoque</h4>
                <div>
                   <label className="label">Grade de Tamanho</label>
                   <div className="flex gap-2 mb-4">
                       <select className="input" value={formData.sizeGridId} onChange={e => handleInputChange('sizeGridId', e.target.value)}>
                           <option value="">Sem Grade (Único)</option>
                           {sizeGrids.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                       </select>
                       <button type="button" onClick={() => setActiveModal('grid')} className="bg-zinc-800 p-2 rounded border border-zinc-700 hover:bg-zinc-700"><Plus size={16}/></button>
                   </div>
                   
                   {formData.variants && formData.variants.length > 0 && (
                       <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 bg-black p-4 rounded-lg border border-zinc-800">
                           {formData.variants.map((v, idx) => (
                               <div key={v.size} className="flex flex-col items-center">
                                   <span className="font-bold text-white mb-1">{v.size}</span>
                                   <input 
                                     type="text" 
                                     inputMode="numeric"
                                     pattern="[0-9]*"
                                     className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-center text-sm focus:border-white focus:outline-none"
                                     value={v.quantity}
                                     onChange={e => handleVariantChange(idx, e.target.value)}
                                   />
                               </div>
                           ))}
                       </div>
                   )}
                </div>
            </div>

            {/* 5. Media */}
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">Mídia</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                       <label className="label">Foto Principal</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full aspect-[3/4] bg-black border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800 hover:border-zinc-500 transition-all overflow-hidden relative"
                       >
                           {formData.image ? (
                               <img src={formData.image} className="w-full h-full object-cover" />
                           ) : (
                               <div className="text-center text-zinc-500"><ImageIcon size={32} className="mx-auto mb-2"/>Clique para enviar</div>
                           )}
                           <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => handleImageUpload(e, true)} />
                       </div>
                   </div>
                   
                   <div className="space-y-4">
                       <div>
                           <label className="label">Fotos de Detalhes (Até 3)</label>
                           <div className="flex gap-2">
                               {formData.galleryImages?.map((img, i) => (
                                   <img key={i} src={img} className="w-16 h-20 object-cover rounded border border-zinc-700" />
                               ))}
                               {(!formData.galleryImages || formData.galleryImages.length < 3) && (
                                   <button type="button" onClick={() => galleryInputRef.current?.click()} className="w-16 h-20 bg-black border border-dashed border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800">
                                       <Plus size={20} className="text-zinc-500"/>
                                   </button>
                               )}
                               <input type="file" ref={galleryInputRef} hidden accept="image/*" multiple onChange={e => handleImageUpload(e, false)} />
                           </div>
                       </div>
                       
                       <div>
                           <label className="label">Vídeo do Produto</label>
                           {!formData.video ? (
                               <div 
                                 onClick={() => videoInputRef.current?.click()}
                                 className="w-full h-32 bg-black border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800"
                               >
                                   <Video size={24} className="text-zinc-500 mb-2"/>
                                   <span className="text-xs text-zinc-500">Enviar do Dispositivo</span>
                               </div>
                           ) : (
                               <div className="relative w-full h-32 bg-black rounded-lg overflow-hidden border border-zinc-700">
                                   <video src={formData.video} className="w-full h-full object-cover" controls />
                                   <button 
                                     type="button" 
                                     onClick={() => handleInputChange('video', '')}
                                     className="absolute top-2 right-2 bg-red-600 p-1 rounded-full"
                                   >
                                       <X size={12} className="text-white"/>
                                   </button>
                               </div>
                           )}
                           <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={handleVideoUpload} />
                       </div>
                   </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({name: '', price: 0} as any); }} className="px-6 py-3 rounded-lg font-bold border border-zinc-700 text-white">Cancelar</button>}
                <button type="submit" className="flex-1 bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200">{isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}</button>
            </div>
          </form>
        </div>
      </div>

      {/* --- PRODUCT LIST --- */}
      <div className="xl:col-span-1">
        <h3 className="text-xl font-bold mb-6">Lista de Produtos</h3>
        <div className="space-y-4 h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {products.map(p => (
                <div key={p.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3 group relative">
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        {p.promoPrice && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PROMO</span>}
                    </div>

                    <div className="flex gap-3">
                        <img src={p.image} className="w-16 h-20 object-cover rounded bg-zinc-800" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm truncate">{p.name}</h4>
                            <p className="text-xs text-zinc-500">{p.category}</p>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="font-bold text-white">R$ {p.price.toFixed(2)}</span>
                                {p.costPrice > 0 && <span className="text-[10px] text-zinc-500">Lucro: R$ {(p.price - p.costPrice).toFixed(2)}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2 mt-2">
                        <button onClick={() => { setFormData(p); setIsEditing(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded text-zinc-300 flex justify-center" title="Editar">
                            <Box size={16} />
                        </button>
                        <button onClick={() => handleDuplicate(p)} className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded text-zinc-300 flex justify-center" title="Duplicar">
                            <Copy size={16} />
                        </button>
                        <button onClick={() => openPromoModal(p)} className="bg-zinc-800 hover:bg-red-900/30 p-2 rounded text-red-400 flex justify-center" title="Promoção">
                            <Tag size={16} />
                        </button>
                        <button onClick={() => removeProduct(p.id)} className="bg-zinc-800 hover:bg-red-600 p-2 rounded text-zinc-300 hover:text-white flex justify-center" title="Excluir">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Promo Modal */}
      {promoModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-4">Lançar Promoção</h3>
                  <p className="text-sm text-zinc-400 mb-4">{selectedProductForPromo?.name}</p>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="label">Preço Promocional (R$)</label>
                          <input type="number" className="input" value={promoPrice} onChange={e => setPromoPrice(e.target.value)} />
                      </div>
                      <div>
                          <label className="label">Válido Até</label>
                          <input type="date" className="input" value={promoDate} onChange={e => setPromoDate(e.target.value)} />
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => setPromoModalOpen(false)} className="flex-1 bg-zinc-800 py-2 rounded font-bold">Cancelar</button>
                          <button onClick={savePromotion} className="flex-1 bg-red-600 text-white py-2 rounded font-bold">Ativar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- QUICK CREATE MODALS --- */}
      {activeModal === 'category' && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm animate-scale-in">
                  <h3 className="text-lg font-bold mb-4">Nova Categoria</h3>
                  <div className="space-y-4">
                      <input className="input" placeholder="Nome (Ex: Camisetas)" value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus />
                      
                      <div 
                        onClick={() => modalFileInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-800"
                      >
                          {newCatImage ? <img src={newCatImage} className="h-full w-full object-cover rounded-lg" /> : <span className="text-xs text-zinc-500">Enviar Foto (Bolinha)</span>}
                          <input type="file" ref={modalFileInputRef} hidden onChange={handleModalImageUpload} />
                      </div>

                      <div className="flex gap-2">
                          <button onClick={() => setActiveModal(null)} className="flex-1 bg-zinc-800 py-2 rounded">Cancelar</button>
                          <button onClick={saveQuickCategory} className="flex-1 bg-white text-black py-2 rounded font-bold">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeModal === 'subcategory' && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm animate-scale-in">
                  <h3 className="text-lg font-bold mb-4">Nova Subcategoria</h3>
                  <p className="text-xs text-zinc-400 mb-2">Para a categoria: <strong>{categories.find(c => c.id === formData.categoryId)?.name}</strong></p>
                  <div className="space-y-4">
                      <input className="input" placeholder="Nome (Ex: Regatas)" value={newSubName} onChange={e => setNewSubName(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                          <button onClick={() => setActiveModal(null)} className="flex-1 bg-zinc-800 py-2 rounded">Cancelar</button>
                          <button onClick={saveQuickSubcategory} className="flex-1 bg-white text-black py-2 rounded font-bold">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeModal === 'brand' && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm animate-scale-in">
                  <h3 className="text-lg font-bold mb-4">Nova Marca</h3>
                  <div className="space-y-4">
                      <input className="input" placeholder="Nome da Marca" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} autoFocus />
                      <div className="flex gap-2">
                          <button onClick={() => setActiveModal(null)} className="flex-1 bg-zinc-800 py-2 rounded">Cancelar</button>
                          <button onClick={saveQuickBrand} className="flex-1 bg-white text-black py-2 rounded font-bold">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeModal === 'color' && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm animate-scale-in">
                  <h3 className="text-lg font-bold mb-4">Nova Cor</h3>
                  <div className="space-y-4">
                      <input className="input" placeholder="Nome (Ex: Vermelho)" value={newColorName} onChange={e => setNewColorName(e.target.value)} autoFocus />
                      <div className="flex items-center gap-2">
                          <input type="color" className="h-10 w-10 border-none bg-transparent" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} />
                          <span className="text-zinc-500 text-sm">{newColorHex}</span>
                      </div>
                      <div className="flex gap-2">
                          <button onClick={() => setActiveModal(null)} className="flex-1 bg-zinc-800 py-2 rounded">Cancelar</button>
                          <button onClick={saveQuickColor} className="flex-1 bg-white text-black py-2 rounded font-bold">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeModal === 'grid' && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm animate-scale-in">
                  <h3 className="text-lg font-bold mb-4">Nova Grade</h3>
                  <div className="space-y-4">
                      <input className="input" placeholder="Nome da Grade (Ex: Infantil)" value={newGridName} onChange={e => setNewGridName(e.target.value)} autoFocus />
                      <input className="input" placeholder="Tamanhos (Ex: 4, 6, 8, 10)" value={newGridSizes} onChange={e => setNewGridSizes(e.target.value)} />
                      <p className="text-[10px] text-zinc-500">Separe os tamanhos por vírgula.</p>
                      <div className="flex gap-2">
                          <button onClick={() => setActiveModal(null)} className="flex-1 bg-zinc-800 py-2 rounded">Cancelar</button>
                          <button onClick={saveQuickGrid} className="flex-1 bg-white text-black py-2 rounded font-bold">Salvar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; color: #71717a; text-transform: uppercase; margin-bottom: 0.25rem; }
        .input { width: 100%; background-color: #000; border: 1px solid #3f3f46; border-radius: 0.5rem; padding: 0.75rem; color: #fff; outline: none; }
        .input:focus { border-color: #fff; }
        @keyframes scale-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminProducts;
