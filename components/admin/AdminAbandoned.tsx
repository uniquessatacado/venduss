
import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const AdminAbandoned: React.FC = () => {
  const { abandonedCarts, settings } = useStore();

  // Sort by newest
  const sortedCarts = [...abandonedCarts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleRecover = (cart: any) => {
      const itemsList = cart.items.map((i: any) => `• ${i.name}`).join('\n');
      const message = `Olá ${cart.customerName || ''}! Vi que você esqueceu alguns itens no carrinho da *${settings.storeName}*: \n\n${itemsList}\n\nVamos finalizar seu pedido? Posso te ajudar com alguma dúvida? 🛍️`;
      window.open(`https://wa.me/55${cart.customerPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center gap-3">
            <ShoppingBag size={32} className="text-yellow-500" />
            <div>
                <h2 className="text-2xl font-bold text-white">Carrinhos Abandonados</h2>
                <p className="text-sm text-zinc-400">Recupere vendas entrando em contato pelo WhatsApp.</p>
            </div>
        </div>

        <div className="grid gap-4">
            {sortedCarts.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900 rounded-2xl border border-zinc-800 border-dashed">
                    <CheckCircle size={48} className="mx-auto mb-4 text-zinc-700" />
                    <p className="text-zinc-500">Nenhum carrinho abandonado registrado recentemente.</p>
                </div>
            ) : (
                sortedCarts.map(cart => (
                    <div key={cart.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-yellow-500/30 transition-colors group">
                        <div className="flex items-start gap-4 flex-1 w-full">
                            <div className="bg-yellow-900/20 p-3 rounded-full border border-yellow-500/20">
                                <Clock className="text-yellow-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{cart.customerName || 'Cliente Visitante'}</h3>
                                <p className="text-sm text-zinc-400 font-mono">{cart.customerPhone}</p>
                                <p className="text-xs text-zinc-500 mt-1">Abandonado em: {new Date(cart.updatedAt).toLocaleString()}</p>
                                
                                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 max-w-[300px] md:max-w-md no-scrollbar">
                                    {cart.items.map((item: any, idx: number) => (
                                        <img key={idx} src={item.image} className="w-10 h-10 rounded border border-zinc-700 object-cover shrink-0" title={item.name} />
                                    ))}
                                    {cart.items.length > 5 && <div className="w-10 h-10 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">+{cart.items.length - 5}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="text-right w-full md:w-auto flex flex-col gap-3">
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-bold">Total do Carrinho</p>
                                <p className="text-2xl font-black text-white">R$ {cart.total.toFixed(2)}</p>
                            </div>
                            <button 
                                onClick={() => handleRecover(cart)}
                                className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                            >
                                <MessageCircle size={20} /> Recuperar Venda
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
};

export default AdminAbandoned;
