
import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { clientCart, updateClientCartQuantity } = useStore();

  const total = clientCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex justify-end">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

        {/* Drawer */}
        <div className="relative w-full max-w-md bg-zinc-900 h-full border-l border-zinc-800 flex flex-col shadow-2xl animate-slide-left">
          
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-white" />
              <h2 className="text-lg font-bold text-white">Seu Carrinho</h2>
              <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{clientCart.length} itens</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {clientCart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                <ShoppingBag size={48} className="opacity-20" />
                <p>Seu carrinho está vazio.</p>
                <button onClick={onClose} className="text-white text-sm font-bold underline">Continuar Comprando</button>
              </div>
            ) : (
              <div className="space-y-4">
                {clientCart.map((item) => (
                  <div key={item.id + (item.size || '')} className={`flex gap-4 p-3 rounded-xl border ${item.isPrize ? 'bg-gradient-to-r from-green-900/20 to-black border-green-500/50' : 'bg-black/40 border-zinc-800'}`}>
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg bg-zinc-800" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white text-sm line-clamp-2">{item.name}</h4>
                          {item.isPrize && <Tag size={14} className="text-green-400 flex-shrink-0 ml-1" />}
                        </div>
                        <p className="text-zinc-500 text-xs mt-1">{item.category}{item.size && ` - ${item.size}`}</p>
                        {item.isPrize && <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider mt-1 block">Brinde Aplicado!</span>}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          {item.isPrize && item.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through mr-2">R$ {item.originalPrice.toFixed(2)}</span>
                          )}
                          <p className={`font-bold ${item.isPrize ? 'text-green-400' : 'text-white'}`}>
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex items-center bg-zinc-800 rounded-lg p-1">
                          <button onClick={() => updateClientCartQuantity(item.id, -1, item.size)} className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Minus size={14}/></button>
                          <span className="text-xs font-mono w-6 text-center text-white">{item.quantity}</span>
                          <button onClick={() => updateClientCartQuantity(item.id, 1, item.size)} className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {clientCart.length > 0 && (
            <div className="p-4 bg-black border-t border-zinc-800">
              <div className="flex justify-between items-end mb-4">
                <span className="text-zinc-400">Total</span>
                <span className="text-2xl font-bold text-white">R$ {total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
              >
                Finalizar Compra <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
