
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Disc, ToggleLeft, ToggleRight, Save, DollarSign, Target, Palette } from 'lucide-react';
import { RouletteSegment } from '../../types';

const AdminRoulette: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [segments, setSegments] = useState<RouletteSegment[]>(settings.rouletteSegments || []);
  const [minOrder, setMinOrder] = useState(settings.rouletteMinTotal || 0);
  const [rigging, setRigging] = useState(settings.rouletteRigging || { active: false, minOrderValue: 150, forceSegmentId: '1' });

  // Handle segment edit
  const updateSegment = (id: string, field: keyof RouletteSegment, value: any) => {
    setSegments(prev => prev.map(seg => seg.id === id ? { ...seg, [field]: value } : seg));
  };

  const handleSave = () => {
    updateSettings({
        rouletteSegments: segments,
        rouletteMinTotal: minOrder,
        rouletteRigging: rigging
    });
    alert("Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
              <Disc size={32} className="text-purple-500" />
              <div>
                  <h2 className="text-2xl font-bold text-white">Roleta Premiada Neon</h2>
                  <p className="text-sm text-zinc-400">Configure os prêmios que aparecem no final do checkout.</p>
              </div>
          </div>
          <button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-green-500/20 transition-all active:scale-95"
          >
              <Save size={18} /> Salvar Alterações
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: General Settings */}
          <div className="space-y-6 lg:col-span-1">
              
              {/* Activation */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-white">Status da Roleta</span>
                      <button onClick={() => updateSettings({ rouletteEnabled: !settings.rouletteEnabled })}>
                          {settings.rouletteEnabled ? <ToggleRight size={40} className="text-green-500"/> : <ToggleLeft size={40} className="text-zinc-600"/>}
                      </button>
                  </div>
                  <p className="text-xs text-zinc-500">Quando ativa, a roleta aparecerá após o cliente confirmar o pedido no checkout.</p>
              </div>

              {/* Trigger Logic */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2"><DollarSign size={18} className="text-yellow-500"/> Gatilho de Ativação</h3>
                  <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Valor Mínimo do Carrinho (R$)</label>
                      <input 
                          type="number" 
                          className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white text-lg font-bold"
                          value={minOrder}
                          onChange={e => setMinOrder(parseFloat(e.target.value))}
                      />
                      <p className="text-[10px] text-zinc-500 mt-2">A roleta só aparecerá se o subtotal for maior que este valor.</p>
                  </div>
              </div>

              {/* Rigging Logic (Regra de Ouro) */}
              <div className="bg-zinc-900 border border-purple-900/30 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  
                  <div className="flex justify-between items-center mb-4 relative z-10">
                      <h3 className="font-bold text-white flex items-center gap-2"><Target size={18} className="text-purple-500"/> Regra de Ouro (Rigging)</h3>
                      <button onClick={() => setRigging({...rigging, active: !rigging.active})}>
                          {rigging.active ? <ToggleRight size={40} className="text-purple-500"/> : <ToggleLeft size={40} className="text-zinc-600"/>}
                      </button>
                  </div>
                  
                  <div className={`space-y-4 transition-opacity ${rigging.active ? 'opacity-100 pointer-events-auto' : 'opacity-50 pointer-events-none'}`}>
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Se compra acima de (R$)</label>
                          <input 
                              type="number" 
                              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold"
                              value={rigging.minOrderValue}
                              onChange={e => setRigging({...rigging, minOrderValue: parseFloat(e.target.value)})}
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Forçar este prêmio (ID)</label>
                          <select 
                              className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold"
                              value={rigging.forceSegmentId}
                              onChange={e => setRigging({...rigging, forceSegmentId: e.target.value})}
                          >
                              {segments.map(s => (
                                  <option key={s.id} value={s.id}>
                                      {s.emoji} - {s.label} ({s.type === 'win' ? 'Vitória' : 'Perda'})
                                  </option>
                              ))}
                          </select>
                      </div>
                      <p className="text-[10px] text-purple-400 bg-purple-900/20 p-2 rounded border border-purple-500/20">
                          <strong>Como funciona:</strong> Se o cliente gastar mais que o valor definido, a roleta irá 100% das vezes cair no prêmio selecionado acima.
                      </p>
                  </div>
              </div>

          </div>

          {/* RIGHT: Segments Editor */}
          <div className="lg:col-span-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Palette size={18}/> Editor de Fatias (8 Fixas)</h3>
                  
                  <div className="space-y-3">
                      {segments.map((seg, idx) => (
                          <div key={seg.id} className="grid grid-cols-12 gap-2 bg-black/50 p-2 rounded-xl border border-zinc-800 items-center">
                              {/* ID Display */}
                              <div className="col-span-1 text-center text-xs text-zinc-600 font-mono">#{idx+1}</div>
                              
                              {/* Emoji */}
                              <div className="col-span-2">
                                  <input 
                                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-center text-xl"
                                      value={seg.emoji}
                                      onChange={e => updateSegment(seg.id, 'emoji', e.target.value)}
                                      maxLength={2}
                                  />
                              </div>

                              {/* Label */}
                              <div className="col-span-4">
                                  <input 
                                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-sm text-white"
                                      value={seg.label}
                                      onChange={e => updateSegment(seg.id, 'label', e.target.value)}
                                      placeholder="Nome do Prêmio"
                                  />
                              </div>

                              {/* Color */}
                              <div className="col-span-2 flex justify-center">
                                  <div className="relative w-full h-10 rounded-lg overflow-hidden border border-zinc-700">
                                      <input 
                                          type="color" 
                                          className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer"
                                          value={seg.color}
                                          onChange={e => updateSegment(seg.id, 'color', e.target.value)}
                                      />
                                  </div>
                              </div>

                              {/* Type */}
                              <div className="col-span-3">
                                  <select 
                                      className={`w-full rounded-lg p-2 text-xs font-bold uppercase border ${seg.type === 'win' ? 'bg-green-900/20 text-green-500 border-green-500/30' : 'bg-red-900/20 text-red-500 border-red-500/30'}`}
                                      value={seg.type}
                                      onChange={e => updateSegment(seg.id, 'type', e.target.value as any)}
                                  >
                                      <option value="win">Vitória</option>
                                      <option value="loss">Perda</option>
                                  </select>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminRoulette;
