
import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, LogOut, ChevronDown, Gift } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onOpenMyAccount: () => void;
  onOpenRaffles: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCart, onOpenAuth, onOpenMyAccount, onOpenRaffles }) => {
  const { clientCart, currentUser, logout, raffles, currentTenant, settings } = useStore();
  const cartCount = clientCart.reduce((acc, item) => acc + item.quantity, 0);
  const [isBumped, setIsBumped] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Check if there are any active raffles
  const hasActiveRaffles = raffles.some(r => r.status === 'active');

  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumped(true);
    const timer = setTimeout(() => setIsBumped(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  // Determine Brand Display
  const brandName = currentTenant?.name || settings.storeName || 'LOJA';
  const brandLogo = currentTenant?.logo;

  return (
    <nav className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            {/* Dynamic Logo/Name */}
            <div className="flex flex-col justify-center items-start leading-none select-none group cursor-pointer">
                <div className="transition-transform duration-300 ease-out group-hover:scale-105">
                  {brandLogo ? (
                      <img 
                        src={brandLogo} 
                        alt={brandName} 
                        className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" 
                      />
                  ) : (
                      <span className="text-xl md:text-2xl font-black italic tracking-tighter bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 group-hover:to-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] pr-2 uppercase">
                        {brandName}
                      </span>
                  )}
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Raffles Button (Only visible if active raffles exist) */}
            {hasActiveRaffles && (
              <button 
                onClick={onOpenRaffles}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 text-purple-200 hover:text-white hover:border-purple-400 transition-all mr-1 animate-pulse-slow"
              >
                <Gift size={16} />
                <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Sorteios</span>
              </button>
            )}

            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider transition-colors"
                  >
                    <span>Minha Conta</span>
                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-2 animate-fade-in-up z-50"
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                        <p className="text-sm font-bold truncate text-white">{currentUser.name}</p>
                        <p className="text-xs truncate text-zinc-400">{currentUser.email}</p>
                      </div>
                      <button onClick={() => { onOpenMyAccount(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 flex items-center gap-2 text-zinc-200">
                          <User size={14} /> Painel do Cliente
                      </button>
                      <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm rounded hover:bg-zinc-800 text-red-400 flex items-center gap-2">
                          <LogOut size={14} /> Sair
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="p-2 cursor-pointer text-zinc-300 hover:text-white transition-colors"
                >
                  <User size={22} />
                </button>
              )}
            </div>

            <button 
              onClick={onOpenCart}
              className={`relative p-2 cursor-pointer text-zinc-300 hover:text-white transition-all duration-300 ${isBumped ? 'scale-125 text-white' : ''}`}
            >
              <ShoppingBag size={22} className={`transition-transform duration-300 ${isBumped ? 'fill-white/20' : ''}`} />
              {cartCount > 0 && (
                <span className={`absolute top-1 right-0 bg-white text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full transition-transform duration-300 ${isBumped ? 'scale-110 bg-green-400' : ''}`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
