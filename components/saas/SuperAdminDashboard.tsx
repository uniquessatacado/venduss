
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, ShoppingBag, Shield, LogOut, ExternalLink, ToggleLeft, ToggleRight, Search, Store, ArrowRight } from 'lucide-react';

interface SuperAdminDashboardProps {
  onEnterMyStore: () => void;
  onSelectTenant: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onEnterMyStore, onSelectTenant }) => {
  const { tenants, impersonateTenant, toggleFeature, saasLogout, user } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Find Super Admin's store (USS)
  const myStore = tenants.find(t => t.id === user?.storeId) || tenants.find(t => t.slug === 'uss');

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
                <Shield className="text-white" size={24} />
            </div>
            <div>
                <h1 className="font-bold text-xl tracking-tight leading-none">VENDUSS</h1>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Super Admin</span>
            </div>
         </div>
         <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-white">{user?.name}</p>
                 <p className="text-xs text-zinc-500">{user?.email}</p>
             </div>
             <div className="h-8 w-px bg-zinc-800 mx-2"></div>
             <button onClick={saasLogout} className="text-zinc-400 hover:text-red-400 flex items-center gap-2 text-sm font-bold transition-colors">
                <LogOut size={16} /> Sair
             </button>
         </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
         
         {/* --- HERO SECTION: MY STORE ACCESS --- */}
         <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-purple-600/20 transition-colors duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Online</span>
                        <span className="text-zinc-500 text-xs uppercase font-bold">Minha Loja Principal</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-2 italic">
                        {myStore?.name || 'Loja Oficial VENDUSS'}
                    </h2>
                    <p className="text-zinc-400 max-w-xl">
                        Gerencie seus produtos, estoque, configurações e veja como o sistema se comporta para o usuário final. Este é o seu ambiente de produção.
                    </p>
                </div>
                
                <button 
                    onClick={onEnterMyStore}
                    className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 flex items-center gap-3 whitespace-nowrap active:scale-95"
                >
                    <Store size={22} /> Acessar Meu E-commerce <ArrowRight size={20} />
                </button>
            </div>
         </div>

         {/* Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total de Lojas</p>
                     <p className="text-4xl font-black text-white mt-2">{tenants.length}</p>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded-xl">
                    <ShoppingBag className="text-white" size={24} />
                  </div>
               </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Lojas Ativas</p>
                     <p className="text-4xl font-black text-green-500 mt-2">{tenants.filter(t => t.isActive).length}</p>
                  </div>
                  <div className="relative p-3 bg-green-900/20 rounded-xl">
                    <div className="absolute top-2 right-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    <ShoppingBag className="text-green-500" size={24} />
                  </div>
               </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
               <div className="flex justify-between items-start">
                  <div>
                     <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Usuários Admin</p>
                     <p className="text-4xl font-black text-blue-500 mt-2">{tenants.length + 1}</p>
                  </div>
                  <div className="p-3 bg-blue-900/20 rounded-xl">
                    <Users className="text-blue-500" size={24} />
                  </div>
               </div>
            </div>
         </div>

         {/* Tenants List */}
         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
               <h2 className="text-xl font-bold flex items-center gap-2">
                   <Users className="text-purple-500" /> Gerenciar Clientes (Tenants)
               </h2>
               <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                  <input 
                     placeholder="Buscar loja..." 
                     className="bg-black border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-purple-500 outline-none w-full md:w-64 transition-colors"
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <div className="space-y-4">
               {filteredTenants.map(tenant => (
                  <div key={tenant.id} className="bg-black p-4 rounded-xl border border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
                     <div className="flex-1 flex items-center gap-4 w-full">
                        <div className="h-12 w-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            {tenant.logo ? <img src={tenant.logo} className="h-8 w-8 object-contain"/> : <Store className="text-zinc-600" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-white">{tenant.name}</h3>
                                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 uppercase">{tenant.slug}</span>
                            </div>
                            <p className="text-zinc-500 text-xs mt-1 font-mono">ID: {tenant.ownerId}</p>
                        </div>
                     </div>

                     {/* Feature Flags */}
                     <div className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 w-full lg:w-auto justify-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Módulos:</span>
                        <button onClick={() => toggleFeature('AI_ASSISTANT', tenant.id)} className="flex items-center gap-1.5 text-xs hover:text-white text-zinc-400 transition-colors" title="IA Assistant">
                           {tenant.features['AI_ASSISTANT'] ? <ToggleRight className="text-green-500" size={24} /> : <ToggleLeft size={24} />} 
                           <span className={tenant.features['AI_ASSISTANT'] ? 'text-white' : ''}>IA</span>
                        </button>
                        <div className="w-px h-4 bg-zinc-700"></div>
                        <button onClick={() => toggleFeature('TICKER', tenant.id)} className="flex items-center gap-1.5 text-xs hover:text-white text-zinc-400 transition-colors" title="Ticker">
                           {tenant.features['TICKER'] ? <ToggleRight className="text-green-500" size={24} /> : <ToggleLeft size={24} />} 
                           <span className={tenant.features['TICKER'] ? 'text-white' : ''}>Ticker</span>
                        </button>
                     </div>

                     {/* Actions */}
                     <div className="flex gap-2 w-full lg:w-auto">
                        <a 
                           href={`/?store=${tenant.slug}`} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors flex-1"
                        >
                           Ver Loja <ExternalLink size={14} />
                        </a>
                        <button 
                           onClick={() => {
                               impersonateTenant(tenant.id);
                               onSelectTenant();
                           }}
                           className="bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors flex-1"
                        >
                           <Shield size={14} /> Acessar Painel
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
