import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, MapPin, Package, Globe, Bike, Store } from 'lucide-react';

const AdminShipping: React.FC = () => {
  const { settings, updateSettings } = useStore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold flex items-center gap-2"><Truck className="text-orange-500"/> Configurações de Entrega</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Frete Grátis & CEP Origem */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
           <h3 className="font-bold text-lg text-white mb-4">Geral</h3>
           
           <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">CEP de Origem (Para cálculo)</label>
              <div className="flex items-center gap-2 bg-black border border-zinc-700 rounded-lg p-3">
                 <MapPin size={18} className="text-zinc-400" />
                 <input 
                    className="bg-transparent text-white outline-none w-full"
                    value={settings.originZip}
                    onChange={e => updateSettings({ originZip: e.target.value })}
                    maxLength={9}
                 />
              </div>
           </div>

           <div>
              <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Frete Grátis Acima de (R$)</label>
              <div className="flex items-center gap-2 bg-black border border-zinc-700 rounded-lg p-3">
                 <span className="text-zinc-400 font-bold">R$</span>
                 <input 
                    type="number"
                    className="bg-transparent text-white outline-none w-full"
                    value={settings.freeShippingThreshold}
                    onChange={e => updateSettings({ freeShippingThreshold: parseFloat(e.target.value) })}
                 />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">O cliente verá a opção "Frete Grátis" no checkout se atingir este valor.</p>
           </div>
        </div>

        {/* Métodos de Entrega */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
           <h3 className="font-bold text-lg text-white mb-4">Métodos de Entrega</h3>
           
           <div className="space-y-4">
               {/* Motoboy */}
               <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zinc-800">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-zinc-800 rounded-lg text-white"><Bike size={18} /></div>
                       <div>
                           <p className="text-sm font-bold text-white">Motoboy (Local)</p>
                           <p className="text-[10px] text-zinc-500">Taxa fixa para região</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-zinc-500">R$</span>
                       <input 
                          type="number"
                          className="w-16 bg-black border border-zinc-700 rounded p-1 text-center text-white text-sm"
                          value={settings.motoboyCost}
                          onChange={e => updateSettings({ motoboyCost: parseFloat(e.target.value) })}
                       />
                       <button 
                          onClick={() => updateSettings({ enableMotoboy: !settings.enableMotoboy })}
                          className={`w-10 h-6 rounded-full transition-colors relative ${settings.enableMotoboy ? 'bg-green-500' : 'bg-zinc-700'}`}
                       >
                          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enableMotoboy ? 'translate-x-4' : ''}`}></div>
                       </button>
                   </div>
               </div>

               {/* Retirada */}
               <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zinc-800">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-zinc-800 rounded-lg text-white"><Store size={18} /></div>
                       <div>
                           <p className="text-sm font-bold text-white">Retirada na Loja</p>
                           <p className="text-[10px] text-zinc-500">Cliente busca o produto</p>
                       </div>
                   </div>
                   <button 
                      onClick={() => updateSettings({ enablePickup: !settings.enablePickup })}
                      className={`w-10 h-6 rounded-full transition-colors relative ${settings.enablePickup ? 'bg-green-500' : 'bg-zinc-700'}`}
                   >
                      <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.enablePickup ? 'translate-x-4' : ''}`}></div>
                   </button>
               </div>

               {/* PAC / Fixo */}
               <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-zinc-800">
                   <div className="flex items-center gap-3">
                       <div className="p-2 bg-zinc-800 rounded-lg text-white"><Package size={18} /></div>
                       <div>
                           <p className="text-sm font-bold text-white">Taxa Fixa Nacional</p>
                           <p className="text-[10px] text-zinc-500">Fallback dos Correios</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-2">
                       <span className="text-xs font-bold text-zinc-500">R$</span>
                       <input 
                          type="number"
                          className="w-16 bg-black border border-zinc-700 rounded p-1 text-center text-white text-sm"
                          value={settings.fixedShippingCost}
                          onChange={e => updateSettings({ fixedShippingCost: parseFloat(e.target.value) })}
                       />
                   </div>
               </div>
           </div>
        </div>

        {/* Melhor Envio Integration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 md:col-span-2">
           <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-400"/> Integração Melhor Envio</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">API Token</label>
                  <input 
                     type="password"
                     className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                     value={settings.melhorEnvioToken || ''}
                     onChange={e => updateSettings({ melhorEnvioToken: e.target.value })}
                     placeholder="Cole seu token aqui..."
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Email de Cadastro</label>
                  <input 
                     className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white"
                     value={settings.melhorEnvioEmail || ''}
                     onChange={e => updateSettings({ melhorEnvioEmail: e.target.value })}
                     placeholder="email@melhorenvio.com"
                  />
               </div>
           </div>
           
           <div className="flex items-center gap-3 bg-black/40 p-4 rounded-lg border border-zinc-800">
               <input 
                  type="checkbox" 
                  id="sandbox"
                  checked={settings.melhorEnvioSandbox || false}
                  onChange={e => updateSettings({ melhorEnvioSandbox: e.target.checked })}
                  className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-blue-500 focus:ring-0"
               />
               <div>
                   <label htmlFor="sandbox" className="text-sm font-bold text-white cursor-pointer">Modo Sandbox (Teste)</label>
                   <p className="text-xs text-zinc-500">Ative para testar sem gerar etiquetas reais.</p>
               </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AdminShipping;