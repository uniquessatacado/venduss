import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import Navbar from './Navbar';
import Highlights from './Highlights';
import BrandIntro from './BrandIntro'; 
import Hero from './Hero';
import ProductCard from './ProductCard';
import SocialProof from './SocialProof';
import WhatsAppButton from './WhatsAppButton';
import Ticker from './Ticker';
import BundleKit from './BundleKit';
import CartDrawer from './CartDrawer';
import PreferenceModal from './UnderwearModal'; 
import QuickViewModal from './QuickViewModal';
import CheckoutModal from './CheckoutModal';
import AuthModal from './AuthModal';
import MyAccountModal from './MyAccountModal';
import TopTrends from './TopTrends';
import RafflesPage from './RafflesPage';
import MatchPage from './MatchPage';
import FlashSale from './FlashSale';
import CategoryPage from './CategoryPage';
import UpsellModal from './UpsellModal';
import PhonePromptModal from './PhonePromptModal'; 
import { Lock, Home } from 'lucide-react';
import { Product, UpsellOffer } from '../types';

interface PublicStoreProps {
    onAdminEnter?: () => void;
    isPreview?: boolean;
}

const PublicStore: React.FC<PublicStoreProps> = ({ onAdminEnter, isPreview = false }) => {
  const { products, settings, addToClientCart, kits, currentTenant, currentUser, loginByPhone, upsellOffers, clientCart } = useStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMyAccountOpen, setIsMyAccountOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Modals & Logic
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null); 
  const [activeUpsell, setActiveUpsell] = useState<UpsellOffer | null>(null);
  
  // Preference Logic
  const [showPreferenceModal, setShowPreferenceModal] = useState(false);
  const [pendingUpsell, setPendingUpsell] = useState<UpsellOffer | null>(null);
  const [preferenceConfig, setPreferenceConfig] = useState<{ type: 'size'|'color', options: string[], categoryId: string, categoryName: string } | null>(null);

  const [currentPage, setCurrentPage] = useState<'home' | 'topTrends' | 'raffles' | 'match'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // If feature flags exist, use them
  const showTicker = currentTenant?.features['TICKER'] ?? settings.showTicker;
  const showSocial = currentTenant?.features['SOCIAL_PROOF'] ?? settings.showSocialProof;
  
  // Theme Logic
  const isDark = settings.theme === 'dark';

  const handleHomeClick = () => {
      setCurrentPage('home');
      setSelectedCategoryId(null);
      const container = isPreview ? document.getElementById('preview-container') : window;
      container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- SMART ADD TO CART & UPSELL LOGIC ---
  const handleSmartAddToCart = (product: Product, options: any = {}) => {
      // 1. If not logged in and first item -> Prompt Phone
      if (!currentUser && clientCart.length === 0 && !showPhonePrompt) {
          setPendingProduct(product);
          setShowPhonePrompt(true);
          return;
      }

      // 2. Add to Cart
      addToClientCart(product, options);
      setIsCartOpen(true);

      // 3. Check for Upsells based on SUBCATEGORY Interest
      const relevantOffer = upsellOffers.find(offer => 
          offer.active && offer.triggerSubcategories && offer.triggerSubcategories.includes(product.subcategoryId || '')
      );

      if (relevantOffer) {
          const triggerCatId = product.categoryId;
          const savedPref = currentUser?.preferences?.[triggerCatId];

          if (savedPref) {
              setActiveUpsell(relevantOffer);
          } else {
              let type: 'size' | 'color' = 'color';
              let options: string[] = ['Preto', 'Branco']; 

              if (product.variants && product.variants.length > 0) {
                  type = 'size';
                  options = Array.from(new Set(product.variants.map(v => v.size))).sort();
              } else {
                  type = 'color';
                  options = ['Preto', 'Branco', 'Azul', 'Vermelho'];
              }

              setPreferenceConfig({
                  type,
                  options,
                  categoryId: triggerCatId,
                  categoryName: product.category
              });
              setPendingUpsell(relevantOffer);
              setShowPreferenceModal(true);
          }
      }
  };

  const handlePreferenceSaved = (val: string) => {
      if (pendingUpsell) {
          setActiveUpsell(pendingUpsell);
          setPendingUpsell(null);
      }
  };

  const handlePhoneSubmit = (phone: string) => {
      const loggedIn = loginByPhone(phone);
      setShowPhonePrompt(false);
      if (pendingProduct) {
          handleSmartAddToCart(pendingProduct);
          setPendingProduct(null);
      }
  };

  const handleUpsellAccept = () => {
      setActiveUpsell(null); 
      setIsCartOpen(true);
  };

  // ... (Render Logic same as before) ...
  const renderContent = () => {
    if (currentPage === 'topTrends') return <TopTrends onBack={handleHomeClick} onAddToCart={handleSmartAddToCart} onQuickView={(p) => setQuickViewProduct(p)} />;
    if (currentPage === 'raffles') return <RafflesPage onBack={handleHomeClick} />;
    if (currentPage === 'match') return <MatchPage onBack={handleHomeClick} onAddToCart={handleSmartAddToCart} onQuickView={(p) => setQuickViewProduct(p)} />;
    if (selectedCategoryId) return <CategoryPage categoryId={selectedCategoryId} onCategorySelect={(id) => { setSelectedCategoryId(id); }} onBack={handleHomeClick} onAddToCart={handleSmartAddToCart} onQuickView={(p) => setQuickViewProduct(p)} />;

    return (
        <main className="flex-grow">
          <BrandIntro />
          <Highlights onCategorySelect={(id) => { setSelectedCategoryId(id); }} />
          <Hero />
          <section className={`py-8 border-b ${isDark ? 'border-zinc-800' : 'border-gray-100'}`}>
            <div className="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 mb-6">
               <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Mais Vendidos</h2>
               <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-500'} mt-1 text-sm`}>Os favoritos da galera</p>
            </div>
            <div className="flex overflow-x-auto gap-4 px-4 sm:px-6 lg:px-8 no-scrollbar pb-8 snap-x">
              {products.slice(0, 6).map(product => (
                <div key={product.id} className="min-w-[180px] md:min-w-[220px] snap-start">
                  <ProductCard product={product} onAddToCart={handleSmartAddToCart} onQuickView={(p) => setQuickViewProduct(p)} />
                </div>
              ))}
            </div>
          </section>
          {kits.map(kit => (
            <BundleKit 
              key={kit.id}
              mainProduct={kit.products[0]}
              secondaryProduct={kit.products[1] || kit.products[0]} 
              onAddToCart={() => { handleSmartAddToCart({ ...kit.products[0], id: `kit-${kit.id}`, price: kit.price, category: 'Kits', name: kit.name }); }} 
              overridePrice={kit.price} overrideOriginalPrice={kit.originalPrice} kitName={kit.name} kitImage={kit.image}
            />
          ))}
          {settings.showFlashSale && <FlashSale />}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-8"><div><h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>Lançamentos</h2></div></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {products.slice(4, 12).map(product => <ProductCard key={product.id} product={product} onAddToCart={handleSmartAddToCart} onQuickView={(p) => setQuickViewProduct(p)} />)}
            </div>
          </section>
        </main>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-zinc-900'} ${isPreview ? 'absolute inset-0 overflow-y-auto' : ''}`} id={isPreview ? "preview-container" : "main-container"}>
      {showTicker && <Ticker />}
      <Navbar onOpenCart={() => setIsCartOpen(true)} onOpenAuth={() => setIsAuthOpen(true)} onOpenMyAccount={() => setIsMyAccountOpen(true)} onOpenRaffles={() => setCurrentPage('raffles')} />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      
      {preferenceConfig && (
          <PreferenceModal 
              isOpen={showPreferenceModal} 
              onClose={() => setShowPreferenceModal(false)}
              type={preferenceConfig.type}
              options={preferenceConfig.options}
              categoryId={preferenceConfig.categoryId}
              categoryName={preferenceConfig.categoryName}
              onSave={handlePreferenceSaved}
          />
      )}
      
      <QuickViewModal isOpen={!!quickViewProduct} product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={(items) => { if (!quickViewProduct) return; items.forEach(item => handleSmartAddToCart(quickViewProduct, { size: item.size, quantity: item.quantity })); setQuickViewProduct(null); }} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <MyAccountModal isOpen={isMyAccountOpen} onClose={() => setIsMyAccountOpen(false)} />
      <PhonePromptModal isOpen={showPhonePrompt} onClose={() => setShowPhonePrompt(false)} onSubmit={handlePhoneSubmit} />
      
      <UpsellModal 
          isOpen={!!activeUpsell} 
          onClose={() => setActiveUpsell(null)} 
          onAccept={handleUpsellAccept} 
          offer={activeUpsell}
      />
      
      {renderContent()}
      
      {showSocial && <SocialProof />}
      
      <button onClick={handleHomeClick} className="fixed bottom-4 left-4 z-50 bg-black text-white px-4 py-3 rounded-full shadow-xl flex items-center space-x-2 transition-transform hover:scale-105 border border-zinc-800">
        <Home size={18} /><span className="text-sm font-bold">Início</span>
      </button>
      
      <WhatsAppButton />
      
      <footer className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100'} border-t py-12 mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-400 text-sm mb-4">© 2024 {settings.storeName}. Powered by VENDUSS.</p>
          {!isPreview && (
              <button onClick={onAdminEnter} className={`text-zinc-500 hover:text-black transition-colors text-xs flex items-center justify-center mx-auto gap-1 border border-zinc-200 px-3 py-1 rounded-full ${isDark ? 'hover:text-white border-zinc-700' : ''}`}>
                    <Lock size={10} /> Acesso Lojista
              </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PublicStore;