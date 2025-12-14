
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, User, Gift, LogOut, ChevronRight, Star, Wallet, Check, ArrowRight, Palette, Ruler } from 'lucide-react';
import { Order, Product } from '../types';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, savedPrize, logout, addToClientCart, categories, products, updateCustomerPreference } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'prizes' | 'style'>('orders');

  // Helper to determine if a category uses Size or Color
  const getCategoryPreferenceType = (catId: string): { type: 'size' | 'color', options: string[] } => {
      // Find products in this category
      const prods = products.filter(p => p.categoryId === catId);
      if (prods.length === 0) return { type: 'color', options: [] }; // Default fallback

      // Check if any product has variants (Size)
      const hasVariants = prods.some(p => p.variants && p.variants.length > 0);
      
      if (hasVariants) {
          // Collect unique sizes
          const sizes = new Set<string>();
          prods.forEach(p => p.variants.forEach(v => sizes.add(v.size)));
          return { type: 'size', options: Array.from(sizes).sort() }; // Basic sort
      } else {
          // It's likely color based (e.g. Hats, Accessories)
          return { type: 'color', options: ['Preto', 'Branco', 'Azul', 'Vermelho', 'Verde'] }; // Default colors or fetch from somewhere
      }
  };

  const handleClaimPrize = (prize: { id: string, name: string, items: Product[] }) => {
      prize.items.forEach(item => {
          addToClientCart(item, { quantity: 1, isPrize: true });
      });
      alert("Itens adicionados ao seu carrinho com 100% de desconto! Finalize o pedido para receber.");
      onClose();
  };

  if (!isOpen || !currentUser) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'style':
          return (
              <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-900/40 to-black p-6 rounded-xl border border-purple-500/30">
                      <h3 className="text-xl font-bold text-white mb-2">Meu Perfil de Estilo</h3>
                      <p className="text-sm text-zinc-400">Preencha suas preferências para receber ofertas exclusivas no seu tamanho ou cor favorita.</p>
                  </div>

                  <div className="space-y-4">
                      {categories.map(cat => {
                          const prefConfig = getCategoryPreferenceType(cat.id);
                          const currentVal = currentUser.preferences[cat.id]?.value;

                          return (
                              <div key={cat.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                      <img src={cat.image} className="w-12 h-12 rounded-full object-cover border border-zinc-700" />
                                      <div>
                                          <p className="font-bold text-white">{cat.name}</p>
                                          <p className="text-xs text-zinc-500 uppercase">{prefConfig.type === 'size' ? 'Tamanho' : 'Cor Favorita'}</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2 justify-end max-w-[50%]">
                                      {prefConfig.options.length > 0 ? (
                                          prefConfig.options.map(opt => (
                                              <button 
                                                  key={opt}
                                                  onClick={() => updateCustomerPreference(cat.id, prefConfig.type, opt)}
                                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${currentVal === opt ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
                                              >
                                                  {opt}
                                              </button>
                                          ))
                                      ) : (
                                          <p className="text-xs text-zinc-600">Sem opções</p>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          );
      case 'orders':
        // ... (Existing Orders view)
        return (
          <div className="space-y-4">
            {currentUser.history && currentUser.history.length > 0 ? (
              currentUser.history.map(order => (
                <div key={order.id} className="bg-black/40 p-4 rounded-lg border border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="font-bold text-white">Pedido #{order.id.slice(-6)}</p>
                      <p className="text-xs text-zinc-400">{new Date(order.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className="text-xs font-bold text-green-400">{order.status}</span>
                  </div>
                  <div className="space-y-2 text-sm border-t border-zinc-800 pt-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-zinc-300">
                         <span>{item.quantity}x {item.name}</span>
                         <span>R$ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-800">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-white">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 py-8">Você ainda não tem pedidos.</p>
            )}
          </div>
        );
      case 'details':
        return (
          <div className="bg-black/40 p-4 rounded-lg border border-zinc-800 space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Nome:</span>
                <span className="font-medium text-white">{currentUser.name}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Email:</span>
                <span className="font-medium text-white">{currentUser.email}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Telefone:</span>
                <span className="font-medium text-white">{currentUser.phone}</span>
            </div>
             {currentUser.address && (
                 <div className="pt-3 border-t border-zinc-800">
                    <p className="text-sm text-zinc-400 mb-1">Endereço Principal:</p>
                    <p className="font-medium text-white text-right">{`${currentUser.address.street}, ${currentUser.address.number}`}<br/>{`${currentUser.address.neighborhood}, ${currentUser.address.city} - ${currentUser.address.state}`}</p>
                 </div>
             )}
          </div>
        );
      case 'prizes':
        return (
          <div className="space-y-6">
             {/* Wallet Balance */}
             <div className="bg-gradient-to-r from-green-900/40 to-black p-6 rounded-xl border border-green-500/30 flex justify-between items-center">
                <div>
                    <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1 flex items-center gap-2"><Wallet size={16}/> Saldo em Carteira</p>
                    <p className="text-3xl font-black text-white">R$ {currentUser.balance.toFixed(2)}</p>
                    <p className="text-[10px] text-zinc-400 mt-1">Desconto automático no checkout.</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                    <Gift size={24} className="text-green-400" />
                </div>
             </div>

             {/* Unclaimed Physical Prizes */}
             <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
                <h4 className="font-bold text-white mb-4">Prêmios a Resgatar</h4>
                {(!currentUser.unclaimedPrizes || currentUser.unclaimedPrizes.length === 0) ? (
                    <p className="text-zinc-500 text-sm">Nenhum prêmio físico pendente.</p>
                ) : (
                    <div className="space-y-4">
                        {currentUser.unclaimedPrizes.map((prize, idx) => (
                            <div key={idx} className="bg-zinc-900 p-4 rounded-xl border border-zinc-700">
                                <div className="flex justify-between items-center mb-3">
                                    <h5 className="font-bold text-white">{prize.name}</h5>
                                    <span className="text-xs bg-purple-900/50 text-purple-200 px-2 py-1 rounded">Ganho em Sorteio</span>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
                                    {prize.items.map((item, i) => (
                                        <img key={i} src={item.image} className="w-12 h-12 rounded object-cover border border-zinc-600" title={item.name} />
                                    ))}
                                </div>
                                <button 
                                  onClick={() => handleClaimPrize(prize)}
                                  className="w-full bg-white text-black py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 flex items-center justify-center gap-2"
                                >
                                    Resgatar Agora <ArrowRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
             </div>
          </div>
        );
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="relative w-full md:max-w-4xl bg-zinc-900 md:rounded-2xl rounded-t-2xl border-t md:border border-zinc-800 shadow-2xl flex flex-col md:flex-row animate-slide-up h-[90vh] md:h-[70vh]">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors">
            <X size={20} />
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-black/20 md:rounded-l-2xl border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex-shrink-0">
           <div className="text-center md:text-left">
              <User size={32} className="mx-auto md:mx-0 mb-2 p-1.5 bg-zinc-800 rounded-full" />
              <h2 className="text-lg font-bold text-white truncate">{currentUser.name}</h2>
              <p className="text-xs text-zinc-400 truncate">{currentUser.email}</p>
              {currentUser.balance > 0 && <p className="text-xs font-bold text-green-400 mt-1">Saldo: R$ {currentUser.balance.toFixed(2)}</p>}
           </div>
           <nav className="mt-8 space-y-2">
              <button onClick={() => setActiveTab('orders')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'orders' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><ShoppingBag size={16} className="inline mr-2" /> Meus Pedidos</span><ChevronRight size={16}/></button>
              <button onClick={() => setActiveTab('style')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'style' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><Star size={16} className="inline mr-2" /> Meu Estilo</span><ChevronRight size={16}/></button>
              <button onClick={() => setActiveTab('details')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'details' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><User size={16} className="inline mr-2" /> Meus Dados</span><ChevronRight size={16}/></button>
              <button onClick={() => setActiveTab('prizes')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'prizes' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><Gift size={16} className="inline mr-2" /> Brindes</span><ChevronRight size={16}/></button>
           </nav>
           <button onClick={handleLogout} className="w-full text-red-400 text-sm p-3 mt-8 hover:bg-red-500/10 rounded-lg flex items-center gap-2 justify-center md:justify-start">
             <LogOut size={16} /> Sair da Conta
           </button>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MyAccountModal;
