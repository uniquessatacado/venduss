import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Layers, Upload, X } from 'lucide-react';

const AdminCategories: React.FC = () => {
  const { categories, addCategory, removeCategory } = useStore();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [subcats, setSubcats] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return;

    addCategory({
      id: Date.now().toString(),
      name,
      image,
      subcategories: subcats.split(',').map(s => s.trim()).filter(s => s !== '')
    });

    setName('');
    setSubcats('');
    setImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Layers size={20} /> Nova Categoria</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Nome</label>
              <input 
                required
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-white outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Verão, Calçados..."
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Imagem da Bolinha</label>
              <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!image ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-500 hover:bg-zinc-800/50 transition-all text-zinc-400"
                  >
                    <Upload size={20} />
                    <span className="text-xs font-bold">Enviar Foto</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-4 bg-black p-3 rounded-xl border border-zinc-800">
                     <img src={image} className="w-16 h-16 rounded-full object-cover border border-zinc-700" />
                     <button 
                       type="button"
                       onClick={() => { setImage(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                       className="text-red-500 text-xs font-bold hover:underline"
                     >
                       Remover
                     </button>
                  </div>
                )}
            </div>

             <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Subcategorias (Separe por vírgula)</label>
              <textarea
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 focus:border-white outline-none h-24"
                value={subcats}
                onChange={e => setSubcats(e.target.value)}
                placeholder="Ex: Shorts, Regatas, Bonés (Não aparece nas bolinhas)"
              />
            </div>
            <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> Criar Categoria
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-xl font-bold mb-6">Categorias Ativas (Bolinhas)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-4 relative group">
              <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700" />
              <div>
                <h4 className="font-bold">{cat.name}</h4>
                <p className="text-xs text-zinc-500">{cat.subcategories.length} subcategorias</p>
              </div>
              <button 
                onClick={() => removeCategory(cat.id)}
                className="absolute top-2 right-2 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;