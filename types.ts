
export type UserRole = 'SUPER_ADMIN' | 'TENANT_ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string; // If Tenant Admin
  whatsapp?: string; // Added for profile edit
  password?: string; // Added for profile edit
}

export interface SocialProofLocation {
  name: string;
  percentage: number; // 0 to 100
}

export interface AppSettings {
  showTicker: boolean;
  showFlashSale: boolean;
  showAiAssistant: boolean;
  showSocialProof: boolean;
  
  // Social Proof Configuration
  socialProofMinTime: number; // Seconds
  socialProofMaxTime: number; // Seconds
  socialProofLocations: SocialProofLocation[];

  storeName: string;
  whatsappNumber: string;
  bannerAutoRotate: boolean;
  bannerInterval: number; 
  
  finePercentage: number;
  interestDailyPercentage: number;

  freeShippingThreshold: number; 
  fixedShippingCost: number; 
  motoboyCost: number;
  originZip: string;
  enableMotoboy: boolean;
  enablePickup: boolean;
  
  melhorEnvioToken?: string;
  melhorEnvioEmail?: string;
  melhorEnvioSandbox?: boolean;

  pixKey: string;
  pixKeyType: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  maxInstallmentsNoInterest: number; 
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  isActive: boolean;
  logo?: string; // URL/Base64 of the store logo
  features: Record<string, boolean>; // Feature Flags
  settings: AppSettings; // ISOLATED SETTINGS PER STORE
}

export interface Brand {
  id: string;
  tenantId: string;
  name: string;
}

export interface Color {
  id: string;
  tenantId: string;
  name: string;
  hex: string;
}

export interface SizeGrid {
  id: string;
  tenantId: string;
  name: string;
  sizes: string[];
}

export interface ProductDimensions {
  weight: number; // gramas
  length: number; // cm
  height: number; // cm
  width: number; // cm
}

export interface ProductVariant {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  tenantId: string;
  internalCode?: string;
  name: string;
  price: number; 
  originalPrice?: number; 
  costPrice: number; 
  
  categoryId: string; 
  category: string; 
  subcategoryId?: string;
  brandId?: string;
  colorId?: string;
  
  image: string; 
  galleryImages: string[]; 
  video?: string; 

  isNew?: boolean;
  promoPrice?: number;
  promoEndsAt?: string; 

  sizeGridId?: string;
  variants: ProductVariant[]; 
  dimensions?: ProductDimensions;
  
  kitVariant?: string; 
}

export interface Highlight {
  id: string;
  title: string;
  image: string;
}

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  image: string; 
  subcategories: string[]; 
}

export interface Banner {
  id: string;
  tenantId: string;
  type: 'image' | 'video';
  url: string;
  active: boolean;
  link?: string;
}

export interface Kit {
  id: string;
  tenantId: string;
  name: string;
  products: Product[];
  price: number;
  originalPrice: number;
  image: string;
}

export interface SocialProofEvent {
  name: string;
  productName: string;
  timeAgo: string;
  location: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface Installment {
  id: string;
  orderId?: string;
  number: number;
  totalInstallments?: number;
  value: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'partial';
  paidAmount?: number;
  paidDate?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  cpf?: string;
  address?: Address;
  debt: number;
  balance: number; 
  history: Order[];
  incompleteProfile?: boolean;
  unclaimedPrizes: Array<{ id: string; name: string; items: Product[] }>; 
}

export interface Order {
  id: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string; 
  customerAddress?: Address;
  items: CartItem[];
  total: number;
  totalCost: number; 
  discountUsed?: number; 
  date: string;
  paymentMethod: 'credit' | 'debit' | 'cash' | 'pix' | 'fiado' | 'whatsapp' | 'on_pickup';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  origin: 'pos' | 'online';
  shipping: {
    method: 'pickup' | 'motoboy' | 'carrier';
    cost: number;
  };
  notes?: string;
  wonPrize?: string;
  underwearSize?: string;
  installments?: Installment[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  isPrize?: boolean;
  itemCost?: number; 
}

export interface Prize {
  label: string;
  emoji: string;
  categoryMatch: string | null;
  color: string;
  textColor: string;
}

export interface Raffle {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  prizeImage: string; 
  drawDate: string; 
  ruleDays: 7 | 15 | 30 | 60 | 90; 
  status: 'active' | 'finished';
  winnerId?: string; 
  winnerName?: string;
  winnerPhone?: string;
  
  prizeType: 'giftcard' | 'product' | 'kit';
  prizeValue?: number; 
  prizeItems?: Product[]; 
}
