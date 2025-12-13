import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Tag, Palette, Grid, Layers, Upload, X } from 'lucide-react';

const AdminVariables: React.FC = () => {
  const { 
    categories, addCategory, removeCategory,
    brands, addBrand, removeBrand,
    colors, addColor, removeColor,
    sizeGrids, addSizeGrid, removeSizeGrid
  } = useStore();

  const [activeTab, setActiveTab] = useState<'categories' | 'brands' | 'colors' | 'sizes'>('categories');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for forms
  const [newCat, setNewCat] = useState({ name: '', image: '', subcats: [] as string[] });
  const [tempSubcat, setTempSubcat] = useState('');
  
  const [newBrand, setNewBrand] = useState('');
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [newGrid, setNewGrid] = useState({ name: '', sizes: '' });

  // Handlers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewCat({ ...newCat, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const addSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempSubcat.trim()) return;
    setNewCat(prev => ({ ...prev, subcats: [...prev.subcats, tempSubcat.trim()] }));
    setTempSubcat('');
  };

  const removeSubcategory = (index: number) => {
    setNewCat(prev => ({ ...prev, subcats: prev.subcats.filter((_, i) => i !== index) }));
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name || !newCat.image) return;
    addCategory({
      id: Date.now().toString(),
      name: newCat.name,
      image: newCat.image,
      subcategories: newCat.subcats
    });
    setNewCat({ name: '', image: '', subcats: [] });
  };

  const saveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand) return;
    addBrand({ id: Date.now().toString(), name: newBrand });
    setNewBrand('');
  };

  const saveColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColor.name) return;
    addColor({ id: Date.now().toString(), ...newColor });
    setNewColor({ name: '', hex: '#000000' });
  };

  const saveGrid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrid.name || !newGrid.sizes) return;
    addSizeGrid({
      id: Date.now().toString(),
      name: newGrid.name,
      sizes: newGrid.sizes.split(',').map(s => s.trim().toUpperCase()).filter(s => s)
    });
    setNewGrid({ name: '', sizes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex overflow-x-auto gap-2 border-b border-zinc-800 pb-2">
        <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'categories' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
          <Layers size={18} /> Categorias & Subs
        </button>
        <button onClick={() => setActiveTab('brands')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'brands' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
          <Tag size={18} /> Marcas
        </button>
        <button onClick={() => setActiveTab('colors')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'colors' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
          <Palette size={18} /> Cores
        </button>
        <button onClick={() => setActiveTab('sizes')} className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 whitespace-nowrap ${activeTab === 'sizes' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
          <Grid size={18} /> Grades de Tamanho
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Nova Categoria</h3>
                <input required placeholder="Nome da Categoria" className="w-full bg-black border border-zinc-700 rounded-lg p-3" value={newCat.name} onChange={e => setNewCat({...newCat, name: e.target.value})} />
                
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Foto (Bolinha)</label>
                   <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileSelect} className="hidden" />
                   {!newCat.image ? (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-20 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-800 mt-1">
                        <Upload size={16} /> Enviar Foto
                      </button>
                   ) : (
                      <div className="relative mt-1 w-20 h-20">
                         <img src={newCat.image} className="w-full h-full object-cover rounded-full" />
                         <button type="button" onClick={() => setNewCat({...newCat, image: ''})} className="absolute top-0 right-0 bg-red-500 p-1 rounded-full"><X size={12}/></button>
                      </div>
                   )}
                </div>

                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase">Subcategorias</label>
                   <div className="flex gap-2 mt-1">
                      <input 
                        placeholder="Nome da Subcategoria..." 
                        className="flex-1 bg-black border border-zinc-700 rounded-lg p-3 text-sm"
                        value={tempSubcat}
                        onChange={e => setTempSubcat(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSubcategory(e)}
                      />
                      <button onClick={addSubcategory} className="bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700"><Plus size={20} /></button>
                   </div>
                   
                   {newCat.subcats.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 p-2 bg-black rounded-lg border border-zinc-800">
                         {newCat.subcats.map((sub, idx) => (
                            <span key={idx} className="text-xs bg-zinc-800 text-zinc-200 px-2 py-1 rounded flex items-center gap-2">
                               {sub}
                               <button onClick={() => removeSubcategory(idx)} className="hover:text-red-400"><X size={12}/></button>
                            </span>
                         ))}
                      </div>
                   )}
                </div>
                <button onClick={saveCategory} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 mt-2">Salvar Categoria</button>
              </div>
            )}

            {activeTab === 'brands' && (
              <form onSubmit={saveBrand} className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Nova Marca</h3>
                <input required placeholder="Nome da Marca" className="w-full bg-black border border-zinc-700 rounded-lg p-3" value={newBrand} onChange={e => setNewBrand(e.target.value)} />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200">Salvar Marca</button>
              </form>
            )}

            {activeTab === 'colors' && (
              <form onSubmit={saveColor} className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Nova Cor</h3>
                <input required placeholder="Nome (Ex: Azul Marinho)" className="w-full bg-black border border-zinc-700 rounded-lg p-3" value={newColor.name} onChange={e => setNewColor({...newColor, name: e.target.value})} />
                <div className="flex items-center gap-3">
                   <input type="color" className="h-10 w-10 bg-transparent border-none" value={newColor.hex} onChange={e => setNewColor({...newColor, hex: e.target.value})} />
                   <span className="text-zinc-500 text-sm">{newColor.hex}</span>
                </div>
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200">Salvar Cor</button>
              </form>
            )}

            {activeTab === 'sizes' && (
               <form onSubmit={saveGrid} className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Nova Grade de Tamanho</h3>
                <input required placeholder="Nome da Grade (Ex: Adulto Padrão)" className="w-full bg-black border border-zinc-700 rounded-lg p-3" value={newGrid.name} onChange={e => setNewGrid({...newGrid, name: e.target.value})} />
                <input required placeholder="Tamanhos (Ex: P, M, G, GG)" className="w-full bg-black border border-zinc-700 rounded-lg p-3" value={newGrid.sizes} onChange={e => setNewGrid({...newGrid, sizes: e.target.value})} />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200">Salvar Grade</button>
              </form>
            )}
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-2 space-y-4">
           {activeTab === 'categories' && categories.map(cat => (
             <div key={cat.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-4 group">
                <img src={cat.image} className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
                <div className="flex-1">
                   <h4 className="font-bold text-white">{cat.name}</h4>
                   <div className="flex flex-wrap gap-1 mt-2">
                      {cat.subcategories.length > 0 ? (
                        cat.subcategories.map(sub => <span key={sub} className="text-[10px] bg-black border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">{sub}</span>)
                      ) : <span className="text-xs text-zinc-600">Sem subcategorias</span>}
                   </div>
                </div>
                <button onClick={() => removeCategory(cat.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
             </div>
           ))}

           {activeTab === 'brands' && brands.map(b => (
             <div key={b.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <span className="font-bold text-white">{b.name}</span>
                <button onClick={() => removeBrand(b.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
             </div>
           ))}

           {activeTab === 'colors' && colors.map(c => (
             <div key={c.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full border border-zinc-700" style={{ backgroundColor: c.hex }}></div>
                   <span className="font-bold text-white">{c.name}</span>
                </div>
                <button onClick={() => removeColor(c.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
             </div>
           ))}

           {activeTab === 'sizes' && sizeGrids.map(g => (
             <div key={g.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                <div>
                   <h4 className="font-bold text-white">{g.name}</h4>
                   <div className="flex gap-2 mt-2">
                      {g.sizes.map(s => <span key={s} className="bg-black px-2 py-1 rounded text-xs border border-zinc-700">{s}</span>)}
                   </div>
                </div>
                <button onClick={() => removeSizeGrid(g.id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={18} /></button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default AdminVariables;