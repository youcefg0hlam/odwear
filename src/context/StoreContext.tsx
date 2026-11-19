import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, OrderStatus, Language, ProductCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/products';
import { translations } from '../data/translations';
import { isFirebaseConfigured } from '../lib/firebase';
import {
  patchOrder,
  patchProduct,
  removeProductDoc,
  saveOrder,
  saveProduct,
  subscribeToOrders,
  subscribeToProducts,
} from '../lib/cloudData';

interface StoreContextType {
  isCloudEnabled: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.fr;
  activeView: 'store' | 'admin' | 'docs';
  setActiveView: (view: 'store' | 'admin' | 'docs') => void;
  
  // Products
  products: Product[];
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  updateProductStock: (id: string, count: number) => void;
  toggleProductStatus: (id: string) => void;
  addNewProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;

  // WhatsApp Helpers
  generateWhatsAppUrl: (orderInfo?: {
    name?: string;
    phone?: string;
    wilaya?: string;
    address?: string;
    items?: CartItem[];
    total?: number;
  }) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const WHATSAPP_NUMBER = "213660005597"; // +213 660 00 55 97 (display: 060005597)

export const StoreProvider: React.FC<{ children: React.ReactNode; includeOrders?: boolean }> = ({ children, includeOrders = false }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bsc_lang');
    return (saved === 'ar' || saved === 'fr') ? saved : 'fr';
  });

  const [activeView, setActiveView] = useState<'store' | 'admin' | 'docs'>('store');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bsc_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bsc_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bsc_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // Sync Language and Direction
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bsc_lang', lang);
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Persist storage (base64 product images can be large, so guard against quota errors)
  const persist = (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Impossible d'enregistrer ${key} dans le navigateur:`, err);
    }
  };

  useEffect(() => {
    persist('bsc_cart', cart);
  }, [cart]);

  useEffect(() => {
    if (!isFirebaseConfigured) persist('bsc_orders', orders);
  }, [orders]);

  useEffect(() => {
    if (!isFirebaseConfigured) persist('bsc_products', products);
  }, [products]);

  // Shared data: live updates from Firestore replace browser-only storage.
  useEffect(() => subscribeToProducts(setProducts), []);
  useEffect(() => (includeOrders ? subscribeToOrders(setOrders) : undefined), [includeOrders]);

  // Cart operations
  const addToCart = (product: Product, size: string, color?: string, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Orders operations
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `BSC-26-${randomSuffix}`,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    void saveOrder(newOrder).catch((err) => console.error('Erreur enregistrement commande:', err));

    // Decrement stock counts locally and in the shared catalogue
    setProducts(prev =>
      prev.map(p => {
        const itemInOrder = newOrder.items.find(i => i.product.id === p.id);
        if (itemInOrder) {
          const newStock = Math.max(0, p.stockCount - itemInOrder.quantity);
          return { ...p, stockCount: newStock, inStock: newStock > 0 };
        }
        return p;
      })
    );

    newOrder.items.forEach((item) => {
      const product = products.find((p) => p.id === item.product.id);
      if (!product) return;
      const newStock = Math.max(0, product.stockCount - item.quantity);
      void patchProduct(product.id, { stockCount: newStock, inStock: newStock > 0 })
        .catch((err) => console.error('Erreur mise à jour stock:', err));
    });

    clearCart();
    setLastConfirmedOrder(newOrder);
    setIsCheckoutOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );
    void patchOrder(orderId, status)
      .catch((err) => console.error('Erreur mise à jour commande:', err));
  };

  // Product management
  const updateProductStock = (id: string, count: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, stockCount: count, inStock: count > 0 } : p))
    );
    void patchProduct(id, { stockCount: count, inStock: count > 0 })
      .catch((err) => console.error('Erreur mise à jour stock:', err));
  };

  const toggleProductStatus = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const inStock = !product.inStock;
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, inStock } : p))
    );
    void patchProduct(id, { inStock })
      .catch((err) => console.error('Erreur mise à jour produit:', err));
  };

  const addNewProduct = async (product: Product) => {
    // The compressed image data URL is stored directly in the Firestore document,
    // so every device sees the same photo without needing a paid Storage bucket.
    setProducts(prev => [product, ...prev]);
    void saveProduct(product)
      .catch((err) => console.error('Erreur ajout produit:', err));
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setSelectedProduct(prev => (prev?.id === id ? null : prev));
    void removeProductDoc(id)
      .catch((err) => console.error('Erreur suppression produit:', err));
  };

  // WhatsApp Order Link Generator
  const generateWhatsAppUrl = (orderInfo?: {
    name?: string;
    phone?: string;
    wilaya?: string;
    address?: string;
    items?: CartItem[];
    total?: number;
  }) => {
    const itemsToOrder = orderInfo?.items || cart;
    const isAr = language === 'ar';

    let text = isAr
      ? `السلام عليكم OD WEAR، أريد طلب هذه المنتجات من موقعكم:\n\n`
      : `Bonjour OD WEAR, je souhaite commander depuis votre boutique en ligne :\n\n`;

    if (itemsToOrder.length > 0) {
      text += isAr ? `📦 تفاصيل السلة:\n` : `📦 Articles commandés :\n`;
      itemsToOrder.forEach((item, index) => {
        const prodName = isAr ? item.product.name.ar : item.product.name.fr;
        text += `${index + 1}. ${item.quantity}x ${prodName} (المقاس / Taille: ${item.selectedSize}) - ${(item.product.price * item.quantity).toLocaleString()} DZD\n`;
      });
      const sub = itemsToOrder.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
      text += `\n💰 المجموع / Total : ${sub.toLocaleString()} DZD\n`;
    }

    if (orderInfo?.name) {
      text += `\n👤 الاسم واللقب / Nom : ${orderInfo.name}`;
    }
    if (orderInfo?.phone) {
      text += `\n📱 رقم الهاتف / Tél : ${orderInfo.phone}`;
    }
    if (orderInfo?.wilaya) {
      text += `\n📍 الولاية / Wilaya : ${orderInfo.wilaya}`;
    }
    if (orderInfo?.address) {
      text += `\n🏠 البلدية والعنوان / Adresse : ${orderInfo.address}`;
    }

    text += isAr 
      ? `\n\n✅ الدفع عند الاستلام (COD). أرجو تأكيد الطلب والشحن وشكراً!`
      : `\n\n✅ Paiement à la livraison (COD). Merci de confirmer ma commande !`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  };

  const t = translations[language];

  return (
    <StoreContext.Provider
      value={{
        isCloudEnabled: isFirebaseConfigured,
        language,
        setLanguage,
        t,
        activeView,
        setActiveView,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        updateProductStock,
        toggleProductStatus,
        addNewProduct,
        removeProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        orders,
        createOrder,
        updateOrderStatus,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        generateWhatsAppUrl
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
