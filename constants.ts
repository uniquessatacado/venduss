import { Product, Highlight } from './types';

export const PRODUCTS: Product[] = [
  { 
    id: '1', tenantId: 'demo', name: 'Oversized Street Tee', price: 129.90, category: 'T-Shirts', image: 'https://picsum.photos/400/500?random=1', isNew: true,
    costPrice: 65.00, categoryId: '2', galleryImages: [], variants: []
  },
  { 
    id: '2', tenantId: 'demo', name: 'Cargo Tech Pants', price: 249.90, category: 'Pants', image: 'https://picsum.photos/400/500?random=2',
    costPrice: 120.00, categoryId: '3', galleryImages: [], variants: []
  },
  { 
    id: '3', tenantId: 'demo', name: 'Minimalist Hoodie', price: 199.90, category: 'Hoodies', image: 'https://picsum.photos/400/500?random=3',
    costPrice: 90.00, categoryId: '2', galleryImages: [], variants: []
  },
  { 
    id: '4', tenantId: 'demo', name: 'Canvas Tote Bag', price: 89.90, category: 'Accessories', image: 'https://picsum.photos/400/500?random=4',
    costPrice: 40.00, categoryId: '4', galleryImages: [], variants: []
  },
  { 
    id: '5', tenantId: 'demo', name: 'Retro Sneakers', price: 399.90, category: 'Shoes', image: 'https://picsum.photos/400/500?random=5', isNew: true,
    costPrice: 200.00, categoryId: '1', galleryImages: [], variants: []
  },
  { 
    id: '6', tenantId: 'demo', name: 'Bucket Hat', price: 79.90, category: 'Accessories', image: 'https://picsum.photos/400/500?random=6',
    costPrice: 30.00, categoryId: '4', galleryImages: [], variants: []
  },
  { 
    id: '7', tenantId: 'demo', name: 'Denim Jacket', price: 329.90, category: 'Jackets', image: 'https://picsum.photos/400/500?random=7',
    costPrice: 150.00, categoryId: '2', galleryImages: [], variants: []
  },
  { 
    id: '8', tenantId: 'demo', name: 'Summer Shorts', price: 119.90, category: 'Shorts', image: 'https://picsum.photos/400/500?random=8',
    costPrice: 50.00, categoryId: '3', galleryImages: [], variants: []
  },
];

export const HIGHLIGHTS: Highlight[] = [
  { id: '1', title: 'New In', image: 'https://picsum.photos/100/100?random=10' },
  { id: '2', title: 'Best', image: 'https://picsum.photos/100/100?random=11' },
  { id: '3', title: 'Sale', image: 'https://picsum.photos/100/100?random=12' },
  { id: '4', title: 'Summer', image: 'https://picsum.photos/100/100?random=13' },
  { id: '5', title: 'Winter', image: 'https://picsum.photos/100/100?random=14' },
  { id: '6', title: 'Tech', image: 'https://picsum.photos/100/100?random=15' },
];

export const NAMES = ['Ana', 'Carlos', 'Beatriz', 'João', 'Mariana', 'Pedro', 'Lucas', 'Fernanda', 'Rafael', 'Juliana'];
export const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília', 'Recife'];

// Prepare context for Gemini
export const PRODUCT_CONTEXT = PRODUCTS.map(p => `- ${p.name} (R$ ${p.price.toFixed(2)}): ${p.category}`).join('\n');