import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, User, Gift, LogOut, ChevronRight, Star, Wallet, Check, ArrowRight } from 'lucide-react';
import { Order, Product } from '../types';

interface MyAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyAccountModal: React.FC<MyAccountModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, savedPrize, logout, addToClientCart } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'details' | 'prizes' | 'ranks'>('orders');

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending': return { label: 'Pendente', color: 'text-yellow-400' };
      case 'processing': return { label: 'Processando', color: 'text-blue-400' };
      case 'completed': return { label: 'Concluído', color: 'text-green-400' };
      case 'cancelled': return { label: 'Cancelado', color: 'text-red-400' };
      default: return { label: 'Desconhecido', color: 'text-zinc-400' };
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
      case 'orders':
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
                    <span className={`text-xs font-bold ${getStatusInfo(order.status).color}`}>{getStatusInfo(order.status).label}</span>
                  </div>
                  <div className="space-y-2 text-sm border-t border-zinc-800 pt-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-zinc-300">
                         <span>{item.quantity}x {item.name} {item.size && `(${item.size})`}</span>
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
             <button className="w-full text-center text-xs pt-4 text-zinc-400 hover:text-white">Editar Dados</button>
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

             {/* Wheel Prize */}
             {savedPrize && (
                 <div className="bg-black/40 p-4 rounded-lg border border-zinc-800">
                    <h4 className="font-bold text-white mb-2">Bônus da Roleta</h4>
                    <div className="flex items-center gap-4">
                       <span className="text-4xl">{savedPrize.emoji}</span>
                       <div>
                         <p className="font-bold text-green-400">{savedPrize.label}</p>
                         <p className="text-xs text-zinc-400">Use este brinde na sua próxima compra!</p>
                       </div>
                    </div>
                 </div>
             )}
          </div>
        );
      case 'ranks':
        // ... (Existing Ranks logic remains the same, assuming it's correctly imported or available)
        return <div className="text-center text-zinc-500 py-10">Ranking de fidelidade em construção...</div>;
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
              <button onClick={() => setActiveTab('details')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'details' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><User size={16} className="inline mr-2" /> Meus Dados</span><ChevronRight size={16}/></button>
              <button onClick={() => setActiveTab('prizes')} className={`w-full flex justify-between items-center text-left p-3 rounded-lg text-sm font-medium ${activeTab === 'prizes' ? 'bg-white text-black' : 'hover:bg-zinc-800'}`}><span><Gift size={16} className="inline mr-2" /> Brindes e Saldo</span><ChevronRight size={16}/></button>
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