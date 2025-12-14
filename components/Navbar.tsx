
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
  const { clientCart, currentUser, storeLogout, raffles, currentTenant, settings } = useStore();
  const cartCount = clientCart.reduce((acc, item) => acc + item.quantity, 0);
  const [isBumped, setIsBumped] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Check if there are any active raffles
  const hasActiveRaffles = raffles.some(r => r.status === 'active');
  const isDark = settings.theme === 'dark';

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
    <nav className={`sticky top-0 z-40 w-full backdrop-blur-md border-b shadow-sm ${isDark ? 'bg-black/90 border-zinc-800' : 'bg-white/90 border-gray-100'}`}>
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
                      <span className={`text-xl md:text-2xl font-black italic tracking-tighter drop-shadow-sm pr-2 uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                        {brandName}
                      </span>
                  )}
                </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            
            {/* Raffles Button */}
            {hasActiveRaffles && (
              <button 
                onClick={onOpenRaffles}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border border-purple-400 text-white hover:opacity-90 transition-all mr-1 animate-pulse-slow"
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors border ${isDark ? 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700' : 'bg-gray-100 text-zinc-800 border-gray-200 hover:bg-gray-200'}`}
                  >
                    <span>Minha Conta</span>
                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div 
                      className={`absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-xl p-2 animate-fade-in-up z-50 ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-gray-200'}`}
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      <div className={`px-3 py-2 border-b mb-2 ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-black'}`}>{currentUser.name}</p>
                        <p className="text-xs truncate text-gray-500">{currentUser.email}</p>
                      </div>
                      <button onClick={() => { onOpenMyAccount(); setIsUserMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded flex items-center gap-2 ${isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-700 hover:bg-gray-100'}`}>
                          <User size={14} /> Painel do Cliente
                      </button>
                      <button onClick={() => { storeLogout(); setIsUserMenuOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded text-red-500 flex items-center gap-2 ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
                          <LogOut size={14} /> Sair
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className={`p-2 cursor-pointer transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'}`}
                >
                  <User size={22} />
                </button>
              )}
            </div>

            <button 
              onClick={onOpenCart}
              className={`relative p-2 cursor-pointer transition-all duration-300 ${isBumped ? 'scale-125' : ''} ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'}`}
            >
              <ShoppingBag size={22} className={`transition-transform duration-300 ${isBumped ? 'fill-current' : ''}`} />
              {cartCount > 0 && (
                <span className={`absolute top-1 right-0 bg-black text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full transition-transform duration-300 ${isBumped ? 'scale-110 bg-green-500' : ''}`}>
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
