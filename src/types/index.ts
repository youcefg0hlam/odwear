export type Language = 'fr' | 'ar';

export type ProductCategory = 
  | 'all'
  | 'sneakers'
  | 'shirts'
  | 'pants'
  | 'jackets'
  | 'tracksuits'
  | 'watches'
  | 'perfumes'
  | 'accessories';

export interface Product {
  id: string;
  name: {
    fr: string;
    ar: string;
  };
  brand: string;
  category: ProductCategory;
  price: number; // in DZD (Algerian Dinars)
  originalPrice?: number;
  image: string;
  gallery?: string[];
  sizes: string[];
  colors: {
    name: { fr: string; ar: string };
    hex: string;
  }[];
  description: {
    fr: string;
    ar: string;
  };
  features: {
    fr: string[];
    ar: string[];
  };
  inStock: boolean;
  stockCount: number;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Wilaya {
  code: number;
  nameFr: string;
  nameAr: string;
  homeDeliveryFee: number;
  deskDeliveryFee: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'returned';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  wilayaCode: number;
  wilayaName: string;
  communeAddress: string;
  deliveryType: 'home' | 'desk';
  deliveryFee: number;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'cod' | 'whatsapp';
  notes?: string;
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}
