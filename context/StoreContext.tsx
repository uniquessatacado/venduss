
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Customer, Order, AppSettings, CartItem, Prize, Category, Banner, Kit, Installment, Brand, Color, SizeGrid, Raffle, User, Tenant } from '../types';
import { PRODUCTS, NAMES, CITIES } from '../constants';

// --- DEFAULT SETTINGS FACTORY ---
const createDefaultSettings = (storeName: string): AppSettings => ({
    showTicker: true, showFlashSale: false, showAiAssistant: true, showSocialProof: true,
    
    // Social Proof Defaults
    socialProofMinTime: 60, // 1 minute
    socialProofMaxTime: 120, // 2 minutes
    socialProofLocations: [
        { name: 'São Paulo, SP', percentage: 50 },
        { name: 'Rio de Janeiro, RJ', percentage: 20 },
        { name: 'Belo Horizonte, MG', percentage: 10 },
        { name: 'Curitiba, PR', percentage: 10 },
        { name: 'Salvador, BA', percentage: 10 }
    ],

    storeName: storeName, whatsappNumber: '', bannerAutoRotate: true, bannerInterval: 5,
    finePercentage: 2, interestDailyPercentage: 0.1, freeShippingThreshold: 299, fixedShippingCost: 25,
    motoboyCost: 10, enableMotoboy: true, enablePickup: true, originZip: '00000-000',
    pixKey: '', pixKeyType: 'cnpj', maxInstallmentsNoInterest: 3
});

// --- MOCK DATABASE ---
const MOCK_SUPER_ADMIN: User = {
    id: 'super-admin-1',
    name: 'Admin Geral VENDUSS',
    email: 'ussloja@gmail.com',
    role: 'SUPER_ADMIN',
    storeId: 'tenant-uss' 
};

const MOCK_ABN_ADMIN: User = {
    id: 'abn-owner-1',
    name: 'ABN Admin',
    email: 'abn@gmail.com',
    role: 'TENANT_ADMIN',
    storeId: 'tenant-abn'
};

const INITIAL_TENANTS: Tenant[] = [
    {
        id: 'tenant-abn',
        name: 'ABN Grifes',
        slug: 'abn',
        ownerId: 'abn-owner-1',
        isActive: true,
        logo: '', 
        features: { 'AI_ASSISTANT': true, 'SOCIAL_PROOF': true, 'TICKER': true },
        settings: createDefaultSettings('ABN Grifes')
    },
    {
        id: 'tenant-uss',
        name: 'Loja Oficial VENDUSS',
        slug: 'uss',
        ownerId: 'super-admin-1',
        isActive: true,
        logo: '', 
        features: { 'AI_ASSISTANT': true, 'SOCIAL_PROOF': true, 'TICKER': true },
        settings: createDefaultSettings('Loja Oficial VENDUSS')
    },
    {
        id: 'tenant-1',
        name: 'Loja Exemplo',
        slug: 'exemplo',
        ownerId: 'tenant-admin-1',
        isActive: true,
        features: { 'AI_ASSISTANT': true, 'SOCIAL_PROOF': true, 'TICKER': true },
        settings: createDefaultSettings('Loja Exemplo')
    }
];

// --- INITIAL DATA WITH TENANT ID ---
const ABN_ID = 'tenant-abn';

// Products assigned to ABN only
const INITIAL_PRODUCTS = PRODUCTS.map(p => ({ 
    ...p, 
    tenantId: ABN_ID, 
    costPrice: p.price * 0.5, 
    categoryId: '2', 
    variants: [{ size: 'M', quantity: 10 }, { size: 'G', quantity: 5 }], 
    galleryImages: [] 
}));

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', tenantId: ABN_ID, name: 'New In', image: 'https://picsum.photos/100/100?random=10', subcategories: [] },
  { id: '2', tenantId: ABN_ID, name: 'T-Shirts', image: 'https://picsum.photos/100/100?random=11', subcategories: ['Oversized', 'Slim', 'Estampada'] },
  { id: '3', tenantId: ABN_ID, name: 'Calças', image: 'https://picsum.photos/100/100?random=12', subcategories: ['Cargo', 'Jeans', 'Moletom'] },
  { id: '4', tenantId: ABN_ID, name: 'Acessórios', image: 'https://picsum.photos/100/100?random=13', subcategories: ['Bonés', 'Meias', 'Bolsas'] },
];

const INITIAL_BRANDS: Brand[] = [{id: '1', tenantId: ABN_ID, name: 'ABN Própria'}, {id: '2', tenantId: ABN_ID, name: 'Nike'}, {id: '3', tenantId: ABN_ID, name: 'Adidas'}];
const INITIAL_COLORS: Color[] = [{id: '1', tenantId: ABN_ID, name: 'Preto', hex: '#000000'}, {id: '2', tenantId: ABN_ID, name: 'Branco', hex: '#ffffff'}, {id: '3', tenantId: ABN_ID, name: 'Azul Marinho', hex: '#000080'}];
const INITIAL_SIZE_GRIDS: SizeGrid[] = [{id: '1', tenantId: ABN_ID, name: 'Padrão Adulto', sizes: ['P', 'M', 'G', 'GG']}];
const INITIAL_BANNERS: Banner[] = [{ id: '1', tenantId: ABN_ID, type: 'image', url: 'https://picsum.photos/1200/800?random=99', active: true }];

// --- INTERFACES ---

interface StoreContextType {
  // SaaS State
  user: User | null;
  saasLogin: (email: string, pass: string) => Promise<User | null>;
  saasLogout: () => void;
  saasRegister: (data: any) => Promise<{ success: boolean; user?: User; tenant?: Tenant }>; 
  completeRegistration: (user: User, tenant: Tenant) => void;
  updateUser: (data: Partial<User>) => void;
  
  // Multi-tenant Logic
  tenants: Tenant[];
  currentTenant: Tenant | null;
  setCurrentTenant: (slug: string) => void;
  impersonateTenant: (tenantId: string) => void;
  toggleFeature: (featureKey: string, tenantId?: string) => void;
  updateTenantLogo: (logo: string) => void;

  // Store Data (Scoped to Current Tenant)
  products: Product[];
  customers: Customer[];
  orders: Order[];
  categories: Category[];
  banners: Banner[];
  kits: Kit[];
  raffles: Raffle[];
  settings: AppSettings;
  brands: Brand[];
  colors: Color[];
  sizeGrids: SizeGrid[];
  
  // Client Actions
  clientCart: CartItem[];
  savedPrize: Prize | null;
  underwearSize: string | null;
  currentUser: Customer | null;
  
  storeLogin: (email: string, pass: string) => boolean;
  storeLogout: () => void;
  storeRegister: (customerData: Omit<Customer, 'id' | 'debt' | 'history' | 'balance' | 'unclaimedPrizes'>) => Customer | null;
  
  setUnderwearSize: (size: string) => void;
  addToClientCart: (product: Product, options?: { size?: string, quantity?: number, isPrize?: boolean }) => void;
  removeFromClientCart: (productId: string, size?: string) => void;
  updateClientCartQuantity: (productId: string, delta: number, size?: string) => void;
  clearClientCart: () => void;
  claimPrize: (prize: Prize) => void;
  consumePrize: () => void;
  checkRaffleEligibility: (raffleId: string, customerId: string) => boolean;
  finishRaffle: (raffleId: string, winnerId: string) => void;

  // Admin Actions (Now auto-attaches tenantId)
  addProduct: (product: Omit<Product, 'tenantId'>) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  duplicateProduct: (product: Product) => Product;
  
  addCategory: (category: Omit<Category, 'tenantId'>) => Category; // Changed return type
  updateCategory: (category: Category) => void; // Added
  removeCategory: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'tenantId'>) => void;
  removeBanner: (id: string) => void;
  addKit: (kit: Omit<Kit, 'tenantId'>) => void;
  removeKit: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'tenantId'>) => void;
  updateCustomerDebt: (id: string, amount: number) => void;
  payInstallment: (customerId: string, orderId: string, installmentId: string, amountPaid: number, nextDate?: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'totalCost' | 'tenantId'> & { status?: Order['status'] }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addRaffle: (raffle: Omit<Raffle, 'tenantId'>) => void;
  updateRaffle: (raffle: Raffle) => void;
  removeRaffle: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addBrand: (brand: Omit<Brand, 'tenantId'>) => Brand; // Changed return type
  removeBrand: (id: string) => void;
  addColor: (color: Omit<Color, 'tenantId'>) => Color; // Changed return type
  removeColor: (id: string) => void;
  addSizeGrid: (grid: Omit<SizeGrid, 'tenantId'>) => SizeGrid; // Changed return type
  removeSizeGrid: (id: string) => void;

  getFinancialStats: (startDate: Date, endDate: Date) => any;
  getCustomerRanking: () => { customer: Customer, totalProfit: number }[];
  applyBulkPromotion: (filters: any, discountType: 'percent' | 'fixed', value: number, endDate: string) => void;
  getTopTrends: () => any;
  getCustomerStats: (customerId: string) => any;
  getMatchingProducts: (customerId: string) => any;

  stats: {
    totalSales: number;
    totalOrders: number;
    totalDebt: number;
  };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... (Keep existing State) ...
  // SAAS STATE
  const [user, setUser] = useState<User | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [currentTenant, setCurrentTenantState] = useState<Tenant | null>(null);

  // MASTER DATA
  const [masterProducts, setMasterProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [masterCustomers, setMasterCustomers] = useState<Customer[]>([]);
  const [masterOrders, setMasterOrders] = useState<Order[]>([]);
  const [masterCategories, setMasterCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [masterBanners, setMasterBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [masterKits, setMasterKits] = useState<Kit[]>([]);
  const [masterRaffles, setMasterRaffles] = useState<Raffle[]>([]);
  const [masterBrands, setMasterBrands] = useState<Brand[]>(INITIAL_BRANDS);
  const [masterColors, setMasterColors] = useState<Color[]>(INITIAL_COLORS);
  const [masterSizeGrids, setMasterSizeGrids] = useState<SizeGrid[]>(INITIAL_SIZE_GRIDS);
  
  const [settings, setSettings] = useState<AppSettings>(createDefaultSettings('Loja'));
  const [clientCart, setClientCart] = useState<CartItem[]>([]);
  const [savedPrize, setSavedPrize] = useState<Prize | null>(null);
  const [underwearSize, setUnderwearSize] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);

  useEffect(() => {
      const abnCustomers = Array.from({ length: 15 }).map((_, i) => ({
        id: `c-${i}`, tenantId: ABN_ID, name: NAMES[i % NAMES.length] + ' ' + (['Silva', 'Santos', 'Oliveira'][i % 3]),
        phone: `(11) 99999-999${i}`, email: `cliente${i}@email.com`, password: '123',
        address: { street: 'Rua Exemplo', number: '123', neighborhood: 'Centro', city: CITIES[i % CITIES.length], state: 'SP', zip: '00000-000' },
        debt: i % 3 === 0 ? Math.floor(Math.random() * 200) : 0, balance: 0, history: [], unclaimedPrizes: []
      }));
      setMasterCustomers(abnCustomers);
  }, []);

  const currentTenantId = currentTenant?.id || 'unknown';

  const products = masterProducts.filter(x => x.tenantId === currentTenantId);
  const customers = masterCustomers.filter(x => x.tenantId === currentTenantId);
  const orders = masterOrders.filter(x => x.tenantId === currentTenantId);
  const categories = masterCategories.filter(x => x.tenantId === currentTenantId);
  const banners = masterBanners.filter(x => x.tenantId === currentTenantId);
  const kits = masterKits.filter(x => x.tenantId === currentTenantId);
  const raffles = masterRaffles.filter(x => x.tenantId === currentTenantId);
  const brands = masterBrands.filter(x => x.tenantId === currentTenantId);
  const colors = masterColors.filter(x => x.tenantId === currentTenantId);
  const sizeGrids = masterSizeGrids.filter(x => x.tenantId === currentTenantId);

  // ... (Keep existing SaaS Logic) ...
  const saasLogin = async (email: string, pass: string) => {
      if (email === 'ussloja@gmail.com' && pass === '137900') {
          const u = MOCK_SUPER_ADMIN; setUser(u);
          const ussTenant = tenants.find(t => t.slug === 'uss');
          if (ussTenant) setCurrentTenant(ussTenant.slug); 
          return u;
      }
      if (email === 'abn@gmail.com' && pass === '12345') {
          const u = MOCK_ABN_ADMIN; setUser(u);
          const abnTenant = tenants.find(t => t.slug === 'abn');
          if (abnTenant) setCurrentTenant(abnTenant.slug); 
          return u;
      }
      const dynamicUser = tenants.find(t => t.slug === email.split('@')[0]); 
      if (dynamicUser && pass === '123') { 
           const u: User = { id: dynamicUser.ownerId, name: 'Admin', email, role: 'TENANT_ADMIN', storeId: dynamicUser.id };
           setUser(u);
           setCurrentTenant(dynamicUser.slug);
           return u;
      }
      return null;
  };

  const saasRegister = async (data: any) => {
      const slug = data.storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newTenantId = `tenant-${Date.now()}`;
      const newTenant: Tenant = {
          id: newTenantId,
          name: data.storeName,
          slug: slug,
          ownerId: `user-${Date.now()}`,
          isActive: true,
          features: { 'AI_ASSISTANT': true, 'TICKER': true },
          logo: '',
          settings: { ...createDefaultSettings(data.storeName), whatsappNumber: data.whatsapp }
      };
      const newUser: User = {
          id: newTenant.ownerId,
          name: data.fullName,
          email: data.email,
          role: 'TENANT_ADMIN',
          storeId: newTenant.id,
          whatsapp: data.whatsapp,
          password: data.password
      };
      setTenants(prev => [...prev, newTenant]);
      return { success: true, user: newUser, tenant: newTenant };
  };

  const completeRegistration = (u: User, t: Tenant) => {
      setUser(u);
      setCurrentTenantState(t);
      setSettings(t.settings);
      localStorage.setItem('venduss_token', 'new_user_token');
  };

  const saasLogout = () => { setUser(null); setCurrentTenantState(null); localStorage.removeItem('venduss_token'); };
  const updateUser = (data: Partial<User>) => { if (!user) return; setUser(prev => prev ? { ...prev, ...data } : null); };
  const setCurrentTenant = (slug: string) => {
      const t = tenants.find(tenant => tenant.slug === slug);
      if (t) { setCurrentTenantState(t); setSettings(t.settings); } else { setCurrentTenantState(null); }
  };
  const impersonateTenant = (tenantId: string) => { const t = tenants.find(tenant => tenant.id === tenantId); if (t) setCurrentTenant(t.slug); };
  const toggleFeature = (featureKey: string, tenantId?: string) => {
      if (tenantId) { setTenants(prev => prev.map(t => { if (t.id === tenantId) { return { ...t, features: { ...t.features, [featureKey]: !t.features[featureKey] } }; } return t; })); }
  };
  const updateTenantLogo = (logo: string) => {
      if (!currentTenant) return;
      const updatedTenant = { ...currentTenant, logo };
      setCurrentTenantState(updatedTenant);
      setTenants(prev => prev.map(t => t.id === currentTenant.id ? updatedTenant : t));
  };
  const updateSettings = (newSettings: Partial<AppSettings>) => {
      if (!currentTenant) return;
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings); 
      const updatedTenant = { ...currentTenant, settings: updatedSettings };
      setCurrentTenantState(updatedTenant);
      setTenants(prev => prev.map(t => t.id === currentTenant.id ? updatedTenant : t));
  };

  // --- CRUD HELPERS ---
  const addProduct = (p: any) => setMasterProducts(prev => [{ ...p, tenantId: currentTenantId }, ...prev]);
  const updateProduct = (p: Product) => setMasterProducts(prev => prev.map(prod => prod.id === p.id ? p : prod));
  const removeProduct = (id: string) => setMasterProducts(prev => prev.filter(p => p.id !== id));
  const duplicateProduct = (p: Product) => { const copy = { ...p, id: Date.now().toString(), name: p.name + ' (Cópia)' }; setMasterProducts(prev => [copy, ...prev]); return copy; };
  
  const addCategory = (c: any) => {
      const newCat = { ...c, tenantId: currentTenantId };
      setMasterCategories(prev => [...prev, newCat]);
      return newCat;
  };
  const updateCategory = (c: Category) => setMasterCategories(prev => prev.map(cat => cat.id === c.id ? c : cat));
  const removeCategory = (id: string) => setMasterCategories(prev => prev.filter(c => c.id !== id));
  
  const addBanner = (b: any) => setMasterBanners(prev => [...prev, { ...b, tenantId: currentTenantId }]);
  const removeBanner = (id: string) => setMasterBanners(prev => prev.filter(b => b.id !== id));
  
  const addKit = (k: any) => setMasterKits(prev => [...prev, { ...k, tenantId: currentTenantId }]);
  const removeKit = (id: string) => setMasterKits(prev => prev.filter(k => k.id !== id));
  
  const addCustomer = (c: any) => setMasterCustomers(prev => [...prev, { ...c, tenantId: currentTenantId }]);
  const updateCustomerDebt = (id: string, amt: number) => setMasterCustomers(prev => prev.map(c => c.id === id ? {...c, debt: c.debt + amt} : c));
  
  const addBrand = (b: any) => { const newBrand = { ...b, tenantId: currentTenantId }; setMasterBrands(prev => [...prev, newBrand]); return newBrand; };
  const removeBrand = (id: string) => setMasterBrands(prev => prev.filter(b => b.id !== id));
  
  const addColor = (c: any) => { const newColor = { ...c, tenantId: currentTenantId }; setMasterColors(prev => [...prev, newColor]); return newColor; };
  const removeColor = (id: string) => setMasterColors(prev => prev.filter(c => c.id !== id));
  
  const addSizeGrid = (g: any) => { const newGrid = { ...g, tenantId: currentTenantId }; setMasterSizeGrids(prev => [...prev, newGrid]); return newGrid; };
  const removeSizeGrid = (id: string) => setMasterSizeGrids(prev => prev.filter(g => g.id !== id));

  // ... (Keep existing Order & Raffle logic) ...
  const addOrder = (o: any) => { const newO = { ...o, id: `o-${Date.now()}`, tenantId: currentTenantId, date: new Date().toISOString(), status: 'pending' }; setMasterOrders(prev => [newO, ...prev]); return newO; };
  const updateOrderStatus = (id: string, st: any) => setMasterOrders(prev => prev.map(o => o.id === id ? {...o, status: st} : o));
  const payInstallment = (customerId: string, orderId: string, installmentId: string, amountPaid: number, nextDate?: string) => {
      setMasterOrders(prev => prev.map(o => {
          if (o.id === orderId && o.installments) {
              const newInst = o.installments.map(inst => {
                  if (inst.id === installmentId) return { ...inst, status: 'paid', paidAmount: amountPaid, paidDate: new Date().toISOString() };
                  return inst;
              });
              return { ...o, installments: newInst as Installment[] };
          }
          return o;
      }));
  }; 
  const addRaffle = (r: any) => setMasterRaffles(prev => [...prev, { ...r, tenantId: currentTenantId }]);
  const updateRaffle = (r: Raffle) => setMasterRaffles(prev => prev.map(raf => raf.id === r.id ? r : raf));
  const removeRaffle = (id: string) => setMasterRaffles(prev => prev.filter(r => r.id !== id));

  // ... (Keep existing Client Actions & Analytics) ...
  const storeLogin = (email: string, pass: string) => { const u = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === pass); if (u) { setCurrentUser(u); return true; } return false; };
  const storeLogout = () => setCurrentUser(null);
  const storeRegister = (data: any) => { const u: Customer = { ...data, id: `c-${Date.now()}`, tenantId: currentTenantId, debt: 0, balance: 0, history: [], unclaimedPrizes: [] }; setMasterCustomers(prev => [...prev, u]); setCurrentUser(u); return u; };
  const handleSetUnderwearSize = (size: string) => setUnderwearSize(size);
  const addToClientCart = (p: Product, opts: any = {}) => { setClientCart(prev => { const existing = prev.find(i => i.id === p.id && i.size === opts.size); return existing ? prev.map(i => i.id === p.id && i.size === opts.size ? { ...i, quantity: i.quantity + (opts.quantity || 1) } : i) : [...prev, { ...p, quantity: opts.quantity || 1, size: opts.size, isPrize: opts.isPrize, price: opts.isPrize ? 0 : p.price }]; }); };
  const removeFromClientCart = (id: string, size?: string) => setClientCart(prev => prev.filter(i => !(i.id === id && i.size === size)));
  const updateClientCartQuantity = (id: string, delta: number, size?: string) => setClientCart(prev => prev.map(i => i.id === id && i.size === size ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  const clearClientCart = () => setClientCart([]);
  const claimPrize = (p: Prize) => setSavedPrize(p);
  const consumePrize = () => { if (clientCart.some(i => i.isPrize)) setSavedPrize(null); };
  const checkRaffleEligibility = (raffleId: string, customerId: string) => true; 
  const finishRaffle = (raffleId: string, winnerId: string) => { };

  const getFinancialStats = () => { const completedOrders = orders.filter(o => o.status === 'completed'); const revenue = completedOrders.reduce((acc, o) => acc + o.total, 0); const cost = completedOrders.reduce((acc, o) => acc + (o.totalCost || 0), 0); return { revenue, cost, profit: revenue - cost, orderCount: completedOrders.length }; };
  const getCustomerRanking = () => { return customers.map(c => ({ customer: c, totalProfit: c.history.filter(o => o.status === 'completed').reduce((acc, o) => acc + (o.total - (o.totalCost || 0)), 0) })).sort((a, b) => b.totalProfit - a.totalProfit); };
  const applyBulkPromotion = () => {};
  const getTopTrends = () => ({ topCategory: categories[0], topBrand: brands[0], topColor: colors[0], topSize: { name: 'M' } });
  const getCustomerStats = (customerId: string) => { const c = customers.find(cus => cus.id === customerId); if (!c) return { daysSinceLastOrder: 0, frequencyDays: 0, isFrequent: false, totalSpent: 0, totalProfit: 0, currentDebt: 0, topProfile: {} }; return { daysSinceLastOrder: 5, frequencyDays: 15, isFrequent: true, totalSpent: 1200, totalProfit: 600, currentDebt: c.debt, topProfile: { brand: brands[0], category: categories[0], color: colors[0], size: 'M' } }; };
  const getMatchingProducts = (customerId: string) => ({ products: products.slice(0, 4), reasons: ['Marca Favorita', 'Cor Favorita'] });
  const stats = { totalSales: 0, totalOrders: orders.length, totalDebt: 0 };

  return (
    <StoreContext.Provider value={{
      user, saasLogin, saasLogout, saasRegister, completeRegistration, updateUser, tenants, currentTenant, setCurrentTenant, impersonateTenant, toggleFeature, updateTenantLogo,
      products, customers, orders, categories, banners, kits, raffles, settings, brands, colors, sizeGrids,
      clientCart, savedPrize, underwearSize, currentUser, storeLogin, storeLogout, storeRegister,
      setUnderwearSize: handleSetUnderwearSize, addToClientCart, removeFromClientCart, updateClientCartQuantity, clearClientCart,
      claimPrize, consumePrize, checkRaffleEligibility, finishRaffle, addProduct, updateProduct, removeProduct, duplicateProduct,
      addCategory, updateCategory, removeCategory, addBanner, removeBanner, addKit, removeKit, addCustomer, updateCustomerDebt, payInstallment,
      addOrder, updateOrderStatus, addRaffle, updateRaffle, removeRaffle, updateSettings, addBrand, removeBrand, addColor, removeColor,
      addSizeGrid, removeSizeGrid, getFinancialStats, getCustomerRanking, applyBulkPromotion, getTopTrends, getCustomerStats, getMatchingProducts, stats
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) { throw new Error('useStore must be used within a StoreProvider'); }
  return context;
};
