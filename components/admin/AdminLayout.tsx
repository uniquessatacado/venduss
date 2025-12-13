
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { LayoutDashboard, ShoppingCart, Users, Settings, Package, LogOut, Menu as MenuIcon, X, Image as ImageIcon, Gift, Truck, CreditCard, Star, DollarSign, Tag, Megaphone, BarChart3, Store, Upload, Shield, Eye, Link, Copy, Check, ArrowLeft } from 'lucide-react';
import PublicStore from '../PublicStore'; // Import the store component
import AdminDashboard from './AdminDashboard';
import AdminPOS from './AdminPOS';
import AdminCustomers from './AdminCustomers';
import AdminProducts from './AdminProducts';
import AdminSettings from './AdminSettings';
import AdminBanners from './AdminBanners';
import AdminKits from './AdminKits';
import AdminFinance from './AdminFinance';
import AdminVariables from './AdminVariables';
import AdminPromotions from './AdminPromotions';
import AdminAnalytics from './AdminAnalytics';
import AdminShipping from './AdminShipping';
import AdminPayments from './AdminPayments';
import AdminRaffles from './AdminRaffles';

interface AdminLayoutProps {
  onExit: () => void;
}

type Tab = 'live_preview' | 'dashboard' | 'analytics' | 'pos' | 'products' | 'customers' | 'settings' | 'banners' | 'kits' | 'shipping' | 'payments' | 'raffles' | 'finance' | 'variables' | 'promotions';

const AdminLayout: React.FC<AdminLayoutProps> = ({ onExit }) => {
  const { currentTenant, updateTenantLogo, user } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Check if it's the Super Admin browsing
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  
  // Logo Upload State
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Check for logo on mount
  useEffect(() => {
      // If it's not ABN (which has hardcoded logo) and has no logo set, show popup
      if (currentTenant && currentTenant.slug !== 'abn' && !currentTenant.logo) {
          setShowLogoPopup(true);
      }
  }, [currentTenant]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateTenantLogo(reader.result as string);
              setShowLogoPopup(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleCopyLink = () => {
      const url = `${window.location.origin}/?store=${currentTenant?.slug}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
  };

  // Menu Definition for Reuse
  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Visão Geral' },
        { id: 'analytics', icon: BarChart3, label: 'Rankings & Dados' },
        { id: 'pos', icon: ShoppingCart, label: 'PDV / Caixa' },
        { id: 'finance', icon: DollarSign, label: 'Financeiro' },
        { id: 'customers', icon: Users, label: 'Clientes' },
      ]
    },
    {
      title: 'Catálogo',
      items: [
        { id: 'products', icon: Package, label: 'Produtos' },
        { id: 'promotions', icon: Megaphone, label: 'Promoções' },
        { id: 'variables', icon: Tag, label: 'Variáveis' },
        { id: 'banners', icon: ImageIcon, label: 'Banners' },
        { id: 'kits', icon: Gift, label: 'Ofertas (Kits)' },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'shipping', icon: Truck, label: 'Entregas' },
        { id: 'payments', icon: CreditCard, label: 'Pagamentos' },
        { id: 'raffles', icon: Star, label: 'Sorteios' },
        { id: 'settings', icon: Settings, label: 'Ajustes' },
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'live_preview': 
        return (
            <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                {/* Preview Header */}
                <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center z-50 shadow-md">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>
                        <h3 className="font-bold text-white text-sm md:text-base">Visualização ao Vivo</h3>
                        <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded border border-zinc-700 hidden md:block">
                            Modo Cliente
                        </span>
                    </div>
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg font-bold text-xs md:text-sm transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <LogOut size={16} className="rotate-180" /> Voltar à Administração
                    </button>
                </div>
                {/* Store Component */}
                <div className="flex-1 relative">
                    <PublicStore isPreview={true} />
                </div>
            </div>
        );
      case 'dashboard': return <AdminDashboard />;
      case 'analytics': return <AdminAnalytics />;
      case 'pos': return <AdminPOS />;
      case 'products': return <AdminProducts />;
      case 'customers': return <AdminCustomers />;
      case 'finance': return <AdminFinance />;
      case 'variables': return <AdminVariables />;
      case 'promotions': return <AdminPromotions />;
      case 'banners': return <AdminBanners />;
      case 'kits': return <AdminKits />;
      case 'shipping': return <AdminShipping />;
      case 'payments': return <AdminPayments />;
      case 'raffles': return <AdminRaffles />;
      case 'settings': return <AdminSettings />;
      default: return <div className="text-center p-8 bg-zinc-900 rounded-xl border border-zinc-800">Página de <span className="font-bold">{activeTab}</span> em construção.</div>;
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close drawer if open
  };

  const NavItem = ({ tab, icon: Icon, label, highlight = false }: { tab: Tab, icon: any, label: string, highlight?: boolean }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === tab 
          ? 'bg-white text-black font-bold shadow-lg' 
          : highlight 
            ? 'bg-green-900/10 text-green-400 hover:bg-green-900/20 border border-green-500/20' 
            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const MobileNavItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`flex flex-col items-center justify-center p-2 transition-all ${
        activeTab === tab ? 'text-white' : 'text-zinc-500'
      }`}
    >
      <div className={`p-1.5 rounded-full mb-1 ${activeTab === tab ? 'bg-zinc-800' : 'bg-transparent'}`}>
        <Icon size={20} className={activeTab === tab ? 'stroke-2' : 'stroke-1'} />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  const BrandLogo = () => (
     <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2 w-full">
            {currentTenant?.logo ? (
                <img src={currentTenant.logo} className="h-6 w-auto object-contain" alt="Logo" />
            ) : (
                <span className="text-xl font-black italic tracking-tighter bg-gradient-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent truncate max-w-[120px]">
                {currentTenant?.name || 'VENDUSS'}
                </span>
            )}
            <span className="bg-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
            Admin
            </span>
        </div>
        
        {currentTenant && (
            <div className="flex gap-2 w-full mt-1">
                <button 
                    onClick={handleCopyLink} 
                    className="text-[10px] flex items-center gap-1 text-zinc-400 hover:text-white hover:bg-zinc-800 px-2 py-1 rounded transition-colors"
                    title="Copiar Link da Loja"
                >
                    {copiedLink ? <Check size={12} className="text-green-500"/> : <Link size={12} />}
                    {copiedLink ? 'Copiado!' : 'Copiar Link'}
                </button>
            </div>
        )}
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex-col h-screen sticky top-0 z-50 overflow-y-auto custom-scrollbar">
        {isSuperAdmin && (
            <button 
                onClick={onExit}
                className="mb-4 w-full bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 p-3 rounded-xl text-center transition-all group active:scale-95"
            >
                <p className="text-[10px] font-bold text-purple-400 uppercase flex items-center justify-center gap-2 group-hover:text-purple-300">
                    <ArrowLeft size={12} /> Voltar ao Super Admin
                </p>
            </button>
        )}
        <div className="mb-6 px-2 py-2"> <BrandLogo /> </div>
        
        <nav className="space-y-1 flex-1">
          {/* New "My Store Now" Button */}
          <div className="mb-4">
             <NavItem tab="live_preview" icon={Eye} label="Minha Loja Agora" highlight={true} />
          </div>

          <p className="px-4 py-2 text-xs text-zinc-500 uppercase font-bold tracking-wider">Principal</p>
          <NavItem tab="dashboard" icon={LayoutDashboard} label="Visão Geral" />
          <NavItem tab="analytics" icon={BarChart3} label="Rankings & Dados" />
          <NavItem tab="pos" icon={ShoppingCart} label="PDV / Caixa" />
          <NavItem tab="finance" icon={DollarSign} label="Financeiro" />
          <NavItem tab="customers" icon={Users} label="Clientes" />
          <div className="h-px bg-zinc-800 my-4" />
          <p className="px-4 py-2 text-xs text-zinc-500 uppercase font-bold tracking-wider">Catálogo</p>
          <NavItem tab="products" icon={Package} label="Produtos" />
          <NavItem tab="promotions" icon={Megaphone} label="Promoções" />
          <NavItem tab="variables" icon={Tag} label="Variáveis" />
          <NavItem tab="banners" icon={ImageIcon} label="Banners" />
          <NavItem tab="kits" icon={Gift} label="Ofertas (Kits)" />
          <div className="h-px bg-zinc-800 my-4" />
          <p className="px-4 py-2 text-xs text-zinc-500 uppercase font-bold tracking-wider">Configurações</p>
          <NavItem tab="shipping" icon={Truck} label="Entregas" />
          <NavItem tab="payments" icon={CreditCard} label="Pagamentos" />
          <NavItem tab="raffles" icon={Star} label="Sorteios" />
          <NavItem tab="settings" icon={Settings} label="Ajustes" />
        </nav>

        <div className="mt-auto pt-4 border-t border-zinc-800">
          <button onClick={onExit} className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={20} /> <span>{isSuperAdmin ? 'Sair do Painel' : 'Sair do Sistema'}</span>
          </button>
        </div>
      </aside>

      {/* HEADER (Mobile) */}
      <header className="md:hidden h-14 bg-black border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-30">
        <BrandLogo />
        <div className="flex gap-2">
            <button onClick={() => handleTabChange('live_preview')} className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded border border-green-500/30 flex items-center gap-1">
                <Eye size={12} /> Ver Loja
            </button>
            <div className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400 border border-zinc-700 flex items-center"> Menu </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-black p-2 md:p-4 overflow-hidden flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
        <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col"> 
            {/* If live_preview, we render full height without scrolling wrapper of dashboard */}
            {activeTab === 'live_preview' ? (
                renderContent()
            ) : (
                <div className="flex-1 overflow-y-auto pb-24 md:pb-8 custom-scrollbar">
                    {renderContent()}
                </div>
            )}
        </div>
      </main>

      {/* BOTTOM NAV (Mobile) */}
      {activeTab !== 'live_preview' && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-black border-t border-zinc-800 z-40 grid grid-cols-5 items-center px-1 pb-safe safe-area-bottom">
            <MobileNavItem tab="dashboard" icon={LayoutDashboard} label="Início" />
            <MobileNavItem tab="pos" icon={ShoppingCart} label="PDV" />
            <MobileNavItem tab="finance" icon={DollarSign} label="Caixa" />
            <MobileNavItem tab="products" icon={Package} label="Prod." />
            <button onClick={() => setIsMobileMenuOpen(true)} className={`flex flex-col items-center justify-center p-2 transition-all ${['settings','categories','banners','kits', 'shipping', 'payments', 'raffles', 'variables', 'promotions', 'analytics'].includes(activeTab) ? 'text-white' : 'text-zinc-500'}`}>
              <div className="p-1.5 rounded-full mb-1 bg-transparent"> <MenuIcon size={20} /> </div>
              <span className="text-[10px] font-medium">Mais</span>
            </button>
          </nav>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl border-t border-zinc-800 p-6 animate-slide-up pb-safe-area-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Menu Completo</h3>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"> <X size={20} /> </button>
            </div>
            
            {isSuperAdmin && (
                <button onClick={onExit} className="w-full bg-purple-900/20 border border-purple-500/30 text-purple-300 py-3 rounded-xl font-bold mb-4 flex items-center justify-center gap-2">
                    <ArrowLeft size={18} /> Voltar ao Super Admin
                </button>
            )}

            <button onClick={() => handleTabChange('live_preview')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold mb-6 flex items-center justify-center gap-2">
                <Eye size={20} /> Minha Loja Agora
            </button>

            {/* FULL MENU LIST */}
            <div className="space-y-6 mb-6">
                {menuSections.map((section, idx) => (
                    <div key={idx}>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">{section.title}</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {section.items.map((item) => (
                                <button 
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id as Tab)}
                                    className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-white text-black font-bold' : 'bg-zinc-800/50 text-zinc-300 hover:bg-zinc-800'}`}
                                >
                                    <item.icon size={18} />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-px bg-zinc-800 my-4" />
            <button onClick={onExit} className="w-full flex items-center justify-center space-x-3 px-4 py-4 text-red-400 bg-red-900/10 rounded-xl font-medium"><LogOut size={20} /><span>{isSuperAdmin ? 'Sair do Painel' : 'Sair do Sistema'}</span></button>
          </div>
        </div>
      )}

      {/* --- LOGO UPLOAD POPUP --- */}
      {showLogoPopup && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-scale-in text-center relative overflow-hidden">
                  {/* Decorative Background */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  
                  <div className="mb-6">
                      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-600">
                          <ImageIcon size={32} className="text-zinc-500" />
                      </div>
                      <h2 className="text-2xl font-black text-white mb-2 uppercase italic tracking-wide">Sua Identidade Visual</h2>
                      <p className="text-zinc-400 text-sm">Adicione o logo da sua loja para personalizar a entrada cinematográfica do seu e-commerce.</p>
                  </div>

                  <input 
                      type="file" 
                      accept="image/*" 
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                      className="hidden"
                  />

                  <button 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-lg mb-3"
                  >
                      <Upload size={20} /> Enviar Logo Agora
                  </button>

                  <button 
                      onClick={() => setShowLogoPopup(false)}
                      className="text-zinc-500 text-xs hover:text-white underline"
                  >
                      Pular esta etapa (Ficar sem logo)
                  </button>
              </div>
          </div>
      )}

      <style>{`
        .pb-safe { padding-bottom: env(safe-area-inset-bottom); } 
        .pb-safe-area-bottom { padding-bottom: calc(env(safe-area-inset-bottom) + 20px); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #18181b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default AdminLayout;
