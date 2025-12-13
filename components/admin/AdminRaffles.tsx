import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Gift, Calendar, Users, Trophy, Play, CheckCircle, Clock, Trash2, X, MessageCircle, Plus, Search, DollarSign, Package } from 'lucide-react';
import { Raffle, Product } from '../../types';

const AdminRaffles: React.FC = () => {
  const { raffles, addRaffle, updateRaffle, removeRaffle, customers, checkRaffleEligibility, settings, products, finishRaffle } = useStore();
  const [activeTab, setActiveTab] = useState<'active' | 'finished'>('active');
  
  // Create Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newRaffle, setNewRaffle] = useState<Partial<Raffle>>({ 
      title: '', 
      ruleDays: 30,
      prizeType: 'giftcard'
  });
  
  // Prize Configuration States
  const [prizeValue, setPrizeValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Draw State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRaffleId, setCurrentRaffleId] = useState<string | null>(null);
  const [drawStep, setDrawStep] = useState<'countdown' | 'shuffling' | 'winner'>('countdown');
  const [shufflingName, setShufflingName] = useState('');
  const [winner, setWinner] = useState<{name: string, phone: string, id: string} | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // -- Handlers --
  
  const handleAddProduct = (product: Product) => {
      if (newRaffle.prizeType === 'product') {
          setSelectedProducts([product]); // Only 1
          setSearchTerm('');
      } else if (newRaffle.prizeType === 'kit') {
          if (selectedProducts.length >= 3) {
              alert("Máximo de 3 itens no kit.");
              return;
          }
          setSelectedProducts(prev => [...prev, product]);
          setSearchTerm('');
      }
  };

  const handleCreate = () => {
      if(!newRaffle.title || !newRaffle.drawDate) {
          alert("Preencha título e data.");
          return;
      }

      // Validation based on type
      if (newRaffle.prizeType === 'giftcard' && (!prizeValue || parseFloat(prizeValue) <= 0)) {
          alert("Informe o valor do Gift Card.");
          return;
      }
      if ((newRaffle.prizeType === 'product' || newRaffle.prizeType === 'kit') && selectedProducts.length === 0) {
          alert("Selecione pelo menos um produto para o prêmio.");
          return;
      }

      const finalPrizeValue = newRaffle.prizeType === 'giftcard' ? parseFloat(prizeValue) : undefined;
      const finalPrizeItems = (newRaffle.prizeType === 'product' || newRaffle.prizeType === 'kit') ? selectedProducts : undefined;
      
      // Auto-set image if not provided
      let finalImage = newRaffle.prizeImage;
      if (!finalImage) {
          if (newRaffle.prizeType === 'giftcard') finalImage = 'https://picsum.photos/400/400?random=giftcard';
          else if (finalPrizeItems && finalPrizeItems.length > 0) finalImage = finalPrizeItems[0].image;
      }

      addRaffle({
          id: Date.now().toString(),
          title: newRaffle.title,
          description: newRaffle.description || '',
          prizeImage: finalImage || 'https://picsum.photos/400/400?random=gift',
          drawDate: newRaffle.drawDate,
          ruleDays: newRaffle.ruleDays as any || 30,
          status: 'active',
          prizeType: newRaffle.prizeType!,
          prizeValue: finalPrizeValue,
          prizeItems: finalPrizeItems
      });

      setIsCreating(false);
      setNewRaffle({ title: '', ruleDays: 30, prizeType: 'giftcard' });
      setPrizeValue('');
      setSelectedProducts([]);
  };

  // -- Draw Logic --
  const startDraw = (raffleId: string) => {
      const eligible = customers.filter(c => checkRaffleEligibility(raffleId, c.id));
      
      if (eligible.length === 0) {
          alert("Nenhum cliente elegível para este sorteio.");
          return;
      }

      setCurrentRaffleId(raffleId);
      setIsDrawing(true);
      setDrawStep('countdown');
      setCountdown(3);

      const countInterval = setInterval(() => {
          setCountdown(prev => {
              if (prev === 1) {
                  clearInterval(countInterval);
                  startShuffling(eligible, raffleId);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const startShuffling = (eligible: any[], raffleId: string) => {
      setDrawStep('shuffling');
      const winnerIndex = Math.floor(Math.random() * eligible.length);
      const selectedWinner = eligible[winnerIndex];

      let duration = 0;
      const speed = 50; 
      const maxDuration = 4000;

      const shuffleInterval = setInterval(() => {
          const randomIdx = Math.floor(Math.random() * eligible.length);
          setShufflingName(eligible[randomIdx].name);
          duration += speed;

          if (duration >= maxDuration) {
              clearInterval(shuffleInterval);
              revealWinner(selectedWinner, raffleId);
          }
      }, speed);
  };

  const revealWinner = (winnerData: any, raffleId: string) => {
      setWinner({ name: winnerData.name, phone: winnerData.phone, id: winnerData.id });
      setDrawStep('winner');
      
      const raffle = raffles.find(r => r.id === raffleId);
      if (raffle) {
          updateRaffle({
              ...raffle,
              status: 'finished',
              winnerId: winnerData.id,
              winnerName: winnerData.name,
              winnerPhone: winnerData.phone
          });
          
          // Trigger Automation Logic
          finishRaffle(raffleId, winnerData.id);
      }
  };

  const handleWhatsAppWinner = () => {
      if(!winner) return;
      const raffle = raffles.find(r => r.id === currentRaffleId);
      let prizeDesc = raffle?.title;
      if (raffle?.prizeType === 'giftcard') prizeDesc = `um Gift Card de R$ ${raffle.prizeValue?.toFixed(2)}`;
      
      const message = `🎉 Parabéns *${winner.name}*! \n\nVocê foi sorteado(a) na *${settings.storeName}* e ganhou: *${prizeDesc}*! 🏆\n\n${raffle?.prizeType === 'giftcard' ? 'O valor já foi creditado no seu saldo!' : 'Seu prêmio está disponível para resgate na sua conta.'}`;
      const phone = winner.phone.replace(/\D/g, '');
      window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const closeDraw = () => {
      setIsDrawing(false);
      setCurrentRaffleId(null);
      setWinner(null);
  };

  return (
    <div className="space-y-8">
       {/* Header & Tabs */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Gift className="text-pink-500" /> Sorteios</h2>
          
          <div className="flex gap-2 w-full md:w-auto">
             <div className="bg-zinc-900 p-1 rounded-lg border border-zinc-800 flex flex-1 md:flex-none">
                <button onClick={() => setActiveTab('active')} className={`flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold uppercase ${activeTab === 'active' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Ativos</button>
                <button onClick={() => setActiveTab('finished')} className={`flex-1 md:flex-none px-4 py-2 rounded text-xs font-bold uppercase ${activeTab === 'finished' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>Finalizados</button>
             </div>
             <button onClick={() => setIsCreating(true)} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 flex items-center gap-2 whitespace-nowrap">
                <Plus size={16} /> <span className="hidden md:inline">Novo Sorteio</span><span className="md:hidden">Novo</span>
             </button>
          </div>
       </div>

       {/* Create Modal */}
       {isCreating && (
           <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl animate-scale-in flex flex-col max-h-[90vh]">
                   <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
                       <h3 className="font-bold text-xl text-white">Configurar Novo Sorteio</h3>
                       <button onClick={() => setIsCreating(false)} className="p-1 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                           <X size={24} />
                       </button>
                   </div>
                   
                   <div className="space-y-4 overflow-y-auto pr-2">
                       <div>
                           <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Título</label>
                           <input 
                               className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500" 
                               placeholder="Ex: Kit de Verão ou Vale Compras" 
                               value={newRaffle.title} 
                               onChange={e => setNewRaffle({...newRaffle, title: e.target.value})} 
                           />
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Data do Sorteio</label>
                               <input 
                                   type="date" 
                                   className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" 
                                   value={newRaffle.drawDate} 
                                   onChange={e => setNewRaffle({...newRaffle, drawDate: e.target.value})} 
                               />
                           </div>
                           <div>
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Regra (Dias)</label>
                               <select 
                                   className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-white" 
                                   value={newRaffle.ruleDays} 
                                   onChange={e => setNewRaffle({...newRaffle, ruleDays: parseInt(e.target.value) as any})}
                               >
                                   <option value={7}>7 Dias</option>
                                   <option value={15}>15 Dias</option>
                                   <option value={30}>30 Dias</option>
                                   <option value={60}>60 Dias</option>
                               </select>
                           </div>
                       </div>

                       {/* Prize Type Selection */}
                       <div>
                           <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block">Tipo de Prêmio</label>
                           <div className="flex gap-2">
                               <button 
                                 onClick={() => { setNewRaffle({...newRaffle, prizeType: 'giftcard'}); setSelectedProducts([]); }}
                                 className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase ${newRaffle.prizeType === 'giftcard' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}
                               >
                                   Gift Card
                               </button>
                               <button 
                                 onClick={() => { setNewRaffle({...newRaffle, prizeType: 'product'}); setSelectedProducts([]); }}
                                 className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase ${newRaffle.prizeType === 'product' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}
                               >
                                   Produto
                               </button>
                               <button 
                                 onClick={() => { setNewRaffle({...newRaffle, prizeType: 'kit'}); setSelectedProducts([]); }}
                                 className={`flex-1 py-3 rounded-lg border text-xs font-bold uppercase ${newRaffle.prizeType === 'kit' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700'}`}
                               >
                                   Kit (Combo)
                               </button>
                           </div>
                       </div>

                       {/* Type Specific Inputs */}
                       {newRaffle.prizeType === 'giftcard' && (
                           <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-fade-in">
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Valor do Vale (R$)</label>
                               <div className="flex items-center bg-black border border-zinc-700 rounded-lg px-3">
                                   <DollarSign size={16} className="text-green-500" />
                                   <input 
                                       type="number"
                                       className="w-full bg-transparent p-3 text-white outline-none font-bold text-lg"
                                       placeholder="0.00"
                                       value={prizeValue}
                                       onChange={e => setPrizeValue(e.target.value)}
                                   />
                               </div>
                               <p className="text-[10px] text-zinc-500 mt-2">O valor será adicionado automaticamente ao saldo do ganhador.</p>
                           </div>
                       )}

                       {(newRaffle.prizeType === 'product' || newRaffle.prizeType === 'kit') && (
                           <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 animate-fade-in">
                               <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Selecionar Itens ({selectedProducts.length}{newRaffle.prizeType === 'kit' ? '/3' : '/1'})</label>
                               
                               <div className="relative mb-3">
                                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                   <input 
                                       className="w-full bg-black border border-zinc-700 rounded-lg p-2 pl-9 text-white text-sm"
                                       placeholder="Buscar produto..."
                                       value={searchTerm}
                                       onChange={e => setSearchTerm(e.target.value)}
                                   />
                               </div>

                               {/* Search Results */}
                               {searchTerm && (
                                   <div className="max-h-32 overflow-y-auto mb-3 border border-zinc-800 rounded bg-black/50 p-2">
                                       {filteredProducts.map(p => (
                                           <div key={p.id} onClick={() => handleAddProduct(p)} className="flex items-center gap-2 p-2 hover:bg-zinc-800 cursor-pointer rounded">
                                               <img src={p.image} className="w-8 h-8 rounded object-cover" />
                                               <span className="text-xs text-white truncate">{p.name}</span>
                                           </div>
                                       ))}
                                   </div>
                               )}

                               {/* Selected List */}
                               <div className="space-y-2">
                                   {selectedProducts.map((p, idx) => (
                                       <div key={idx} className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                                           <div className="flex items-center gap-2">
                                               <img src={p.image} className="w-8 h-8 rounded object-cover" />
                                               <span className="text-xs text-white truncate max-w-[150px]">{p.name}</span>
                                           </div>
                                           <button onClick={() => setSelectedProducts(prev => prev.filter((_, i) => i !== idx))} className="text-red-500 hover:bg-red-900/20 p-1 rounded"><Trash2 size={14}/></button>
                                       </div>
                                   ))}
                               </div>
                               <p className="text-[10px] text-zinc-500 mt-2">O ganhador poderá resgatar estes itens gratuitamente.</p>
                           </div>
                       )}
                   </div>

                   <div className="flex gap-3 mt-4 pt-4 border-t border-zinc-800">
                       <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-xl font-bold border border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</button>
                       <button onClick={handleCreate} className="flex-1 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500">Criar Sorteio</button>
                   </div>
               </div>
           </div>
       )}

       {/* List (Grid View) */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {raffles.filter(r => activeTab === 'active' ? r.status === 'active' : r.status === 'finished').map(raffle => (
               <div key={raffle.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
                   <div className="h-32 bg-zinc-800 relative">
                       <img src={raffle.prizeImage} className="w-full h-full object-cover opacity-60" />
                       <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold uppercase text-white border border-white/10">
                           {raffle.prizeType === 'giftcard' ? 'Gift Card' : raffle.prizeType === 'kit' ? 'Kit' : 'Produto'}
                       </div>
                       <div className="absolute bottom-4 left-4">
                           <h3 className="text-xl font-bold text-white leading-tight">{raffle.title}</h3>
                       </div>
                   </div>
                   
                   <div className="p-4 flex-1">
                       <div className="flex items-center gap-2 text-sm text-zinc-400 mb-2">
                           <Calendar size={16} /> <span>{new Date(raffle.drawDate).toLocaleDateString('pt-BR')}</span>
                       </div>
                       
                       {raffle.prizeType === 'giftcard' && (
                           <div className="text-green-400 font-bold text-lg mb-2">Valor: R$ {raffle.prizeValue?.toFixed(2)}</div>
                       )}
                       
                       {raffle.status === 'finished' && (
                           <div className="mt-4 bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
                               <p className="text-xs text-green-400 font-bold uppercase mb-1">Ganhador(a)</p>
                               <p className="text-white font-bold">{raffle.winnerName}</p>
                               <p className="text-zinc-400 text-xs">{raffle.winnerPhone}</p>
                           </div>
                       )}
                   </div>

                   {raffle.status === 'active' && (
                       <div className="p-4 border-t border-zinc-800 flex gap-2">
                           <button onClick={() => removeRaffle(raffle.id)} className="p-3 rounded-xl bg-red-900/20 text-red-500 hover:bg-red-900/40"><Trash2 size={20}/></button>
                           <button 
                             onClick={() => startDraw(raffle.id)}
                             className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                           >
                               <Play size={20} className="fill-black" /> SORTEAR AGORA
                           </button>
                       </div>
                   )}
               </div>
           ))}
       </div>

       {/* --- DRAW ANIMATION OVERLAY (Same as before but integrated) --- */}
       {isDrawing && (
           <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
               {/* Background Effects */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black"></div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

               <button onClick={closeDraw} className="absolute top-8 right-8 text-zinc-500 hover:text-white z-50"><X size={32}/></button>

               {drawStep === 'countdown' && (
                   <div className="relative z-10 text-center animate-pulse">
                       <p className="text-zinc-500 text-xl font-bold uppercase tracking-[0.5em] mb-4">Sorteando em</p>
                       <div className="text-[12rem] font-black text-white leading-none font-mono">{countdown}</div>
                   </div>
               )}

               {drawStep === 'shuffling' && (
                   <div className="relative z-10 text-center w-full">
                       <p className="text-purple-400 text-lg font-bold uppercase tracking-widest mb-8 animate-bounce">Embaralhando...</p>
                       <div className="text-5xl md:text-8xl font-black text-white opacity-80 blur-sm scale-110">{shufflingName}</div>
                   </div>
               )}

               {drawStep === 'winner' && winner && (
                   <div className="relative z-10 text-center animate-scale-in">
                       <Trophy size={80} className="text-yellow-400 mx-auto mb-6 animate-bounce" />
                       <p className="text-yellow-500 text-xl font-bold uppercase tracking-[0.5em] mb-2">Vencedor(a)</p>
                       <h1 className="text-5xl md:text-7xl font-black text-white mb-6">{winner.name}</h1>
                       <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-auto mb-8">
                           <p className="text-zinc-300">Contato: {winner.phone}</p>
                       </div>
                       
                       <button 
                         onClick={handleWhatsAppWinner}
                         className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-4 rounded-full font-bold text-xl flex items-center justify-center gap-3 shadow-lg hover:scale-105 transition-transform mx-auto"
                       >
                           <MessageCircle size={24} /> Avisar Ganhador
                       </button>
                       <p className="text-zinc-500 text-xs mt-4">O prêmio foi distribuído automaticamente para a conta do cliente.</p>
                   </div>
               )}
           </div>
       )}
       
       <style>{`
        @keyframes scale-in { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminRaffles;