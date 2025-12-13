import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash2, Image as ImageIcon, Video, Clock, Upload, X } from 'lucide-react';

const AdminBanners: React.FC = () => {
  const { banners, addBanner, removeBanner, settings, updateSettings } = useStore();
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // For video, we use object URL for performance (Base64 is too heavy for videos in browser memory)
      const videoUrl = URL.createObjectURL(file);
      setUrl(videoUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    addBanner({
      id: Date.now().toString(),
      type,
      url,
      active: true
    });
    setUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearFile = () => {
    setUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8">
      {/* Settings Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock size={20} /> Configuração de Rotação</h3>
        <div className="flex flex-col md:flex-row gap-6">
           <div className="flex items-center gap-3">
             <label className="text-sm text-zinc-400">Rotação Automática:</label>
             <button 
                onClick={() => updateSettings({ bannerAutoRotate: !settings.bannerAutoRotate })}
                className={`px-3 py-1 rounded text-xs font-bold uppercase ${settings.bannerAutoRotate ? 'bg-green-500/20 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}
             >
               {settings.bannerAutoRotate ? 'LIGADO' : 'DESLIGADO'}
             </button>
           </div>
           <div className="flex items-center gap-3">
             <label className="text-sm text-zinc-400">Tempo (segundos):</label>
             <input 
               type="number" 
               value={settings.bannerInterval}
               onChange={(e) => updateSettings({ bannerInterval: parseInt(e.target.value) || 5 })}
               className="w-20 bg-black border border-zinc-700 rounded px-2 py-1 text-center"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Form */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6">Adicionar Banner</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Tipo de Mídia</label>
                <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                  <button 
                    type="button"
                    onClick={() => { setType('image'); setUrl(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${type === 'image' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  >
                    <ImageIcon size={16} /> Foto
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setType('video'); setUrl(''); }}
                    className={`flex-1 py-2 rounded-md text-sm font-bold flex items-center justify-center gap-2 ${type === 'video' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                  >
                    <Video size={16} /> Vídeo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Upload do Arquivo</label>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept={type === 'image' ? "image/*" : "video/*"}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {!url ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-zinc-500 hover:bg-zinc-800/50 transition-all text-zinc-400"
                  >
                    <Upload size={24} />
                    <span className="text-xs font-bold">Clique para enviar {type === 'image' ? 'Imagem' : 'Vídeo'}</span>
                  </button>
                ) : (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-700 bg-black">
                     {type === 'image' ? (
                        <img src={url} className="w-full h-full object-contain" />
                     ) : (
                        <video src={url} className="w-full h-full object-cover" autoPlay muted loop />
                     )}
                     <button 
                       type="button"
                       onClick={clearFile}
                       className="absolute top-2 right-2 bg-red-600 p-1 rounded-full text-white hover:bg-red-700"
                     >
                       <X size={14} />
                     </button>
                  </div>
                )}
              </div>
              
              <button type="submit" disabled={!url} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus size={18} /> Adicionar Banner
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
           <h3 className="text-xl font-bold mb-6">Banners Ativos</h3>
           <div className="space-y-4">
             {banners.map((banner, index) => (
               <div key={banner.id} className="relative aspect-video bg-zinc-800 rounded-xl overflow-hidden group border border-zinc-800">
                  {banner.type === 'video' ? (
                    <video src={banner.url} className="w-full h-full object-cover opacity-50" muted />
                  ) : (
                    <img src={banner.url} className="w-full h-full object-cover opacity-50" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-black/50 px-3 py-1 rounded text-xs font-mono uppercase border border-white/20">
                      {index + 1} - {banner.type === 'video' ? 'Vídeo' : 'Imagem'}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeBanner(banner.id)}
                    className="absolute top-2 right-2 bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;