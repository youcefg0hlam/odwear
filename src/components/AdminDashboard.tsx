import React, { useState } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Package, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  Truck, 
  RotateCcw, 
  Eye, 
  MapPin, 
  Phone,
  BarChart3,
  Box,
  Trash2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, ProductCategory, Product } from '../types';
import { ALGERIA_WILAYAS } from '../data/wilayas';

const DEFAULT_PRODUCT_IMAGE = '/images/product_sneaker_luxury_1794272552580.jpg';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Resize an uploaded image and return a compact data URL that survives in localStorage. */
const fileToStoredImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Veuillez sélectionner un fichier image.'));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      reject(new Error('L\'image doit faire moins de 8 Mo.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture de l\'image impossible.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format d\'image non pris en charge.'));
      img.onload = () => {
        const maxSide = 1000;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Traitement d\'image indisponible.'));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export const AdminDashboard: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    products, 
    updateProductStock, 
    toggleProductStatus, 
    addNewProduct,
    removeProduct,
    language, 
    t,
    setLastConfirmedOrder
  } = useStore();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'wilayas'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // New product form state
  const [newProdNameFr, setNewProdNameFr] = useState('');
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('OD WEAR');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('sneakers');
  const [newProdPrice, setNewProdPrice] = useState('11500');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdSizes, setNewProdSizes] = useState('40, 41, 42, 43, 44');
  const [newProdImage, setNewProdImage] = useState(DEFAULT_PRODUCT_IMAGE);
  const [imageError, setImageError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Business Analytics Calculations
  const totalRevenue = orders
    .filter(o => o.status !== 'returned')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const deliverySuccessRate = orders.length > 0 
    ? Math.round((deliveredCount / orders.length) * 100) 
    : 100;
  const averageBasket = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.wilayaName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Wilaya distribution
  const wilayaStats = ALGERIA_WILAYAS.map(w => {
    const ordersInWilaya = orders.filter(o => o.wilayaCode === w.code);
    const revenueInWilaya = ordersInWilaya.reduce((acc, o) => acc + o.total, 0);
    return {
      wilaya: w,
      orderCount: ordersInWilaya.length,
      revenue: revenueInWilaya
    };
  }).filter(stat => stat.orderCount > 0).sort((a, b) => b.orderCount - a.orderCount);

  // Export to CSV for logistics partners (Yalidine, Procolis)
  const handleExportCSV = () => {
    const header = "Numero_Commande,Date,Client,Telephone,Wilaya,Adresse,Type_Livraison,Total_DZD,Statut\n";
    const rows = orders.map(o => 
      `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerPhone}","${o.wilayaName}","${o.communeAddress}","${o.deliveryType}",${o.total},"${o.status}"`
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `od_wear_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameFr.trim()) return;

    const sizesArr = newProdSizes.split(',').map(s => s.trim()).filter(Boolean);
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: {
        fr: newProdNameFr.trim(),
        ar: newProdNameAr.trim() || newProdNameFr.trim()
      },
      brand: newProdBrand.trim(),
      category: newProdCategory,
      price: Number(newProdPrice) || 5000,
      image: newProdImage.trim() || DEFAULT_PRODUCT_IMAGE,
      sizes: sizesArr.length > 0 ? sizesArr : ["Standard"],
      colors: [{ name: { fr: "Noir", ar: "أسود" }, hex: "#000000" }],
      description: {
        fr: "Article ajouté depuis le panneau d'administration OD WEAR.",
        ar: "تمت إضافة هذا المنتج من لوحة تحكم OD WEAR."
      },
      features: {
        fr: ["Qualité supérieure vérifiée en boutique"],
        ar: ["جودة عالية مفحوصة في المحل"]
      },
      inStock: Number(newProdStock) > 0,
      stockCount: Number(newProdStock) || 10,
      isNewArrival: true
    };

    addNewProduct(newProduct);
    setIsAddProductOpen(false);
    setNewProdNameFr('');
    setNewProdNameAr('');
    setNewProdImage(DEFAULT_PRODUCT_IMAGE);
    setImageError('');
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    removeProduct(productToDelete.id);
    setProductToDelete(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setImageError('');
    try {
      const storedImage = await fileToStoredImage(file);
      setNewProdImage(storedImage);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Impossible de charger l\'image.');
    } finally {
      setIsProcessingImage(false);
      e.target.value = '';
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">
            <Clock className="w-3 h-3" />
            <span>{t.admin.statusPending}</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60">
            <CheckCircle className="w-3 h-3" />
            <span>{t.admin.statusConfirmed}</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60">
            <Truck className="w-3 h-3" />
            <span>{t.admin.statusShipped}</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            <CheckCircle className="w-3 h-3" />
            <span>{t.admin.statusDelivered}</span>
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">
            <RotateCcw className="w-3 h-3" />
            <span>{t.admin.statusReturned}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FCF1E1] font-serif">
              {t.admin.title}
            </h1>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#BA5418] bg-stone-900 border border-[#BA5418]/30 px-2.5 py-0.5 rounded">
              {t.admin.demoBadge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">{t.admin.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-[11px] sm:text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#BA5418]" />
            <span>{t.admin.exportOrders}</span>
          </button>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#BA5418] hover:bg-[#D2702B] text-[11px] sm:text-xs font-bold text-[#FCF1E1] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة منتج' : 'Ajouter Produit'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 my-6 sm:my-8">
        <div className="p-4 sm:p-5 rounded-xl bg-[#1A140F] border border-stone-800/80">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">{t.admin.kpiRevenue}</span>
            <TrendingUp className="w-4 h-4 text-[#BA5418]" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#FCF1E1] tabular-nums">
            {totalRevenue.toLocaleString()} <span className="text-xs text-[#BA5418] font-bold">DZD</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Toutes les wilayas confondues</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#1A140F] border border-stone-800/80">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">{t.admin.kpiOrders}</span>
            <ShoppingBag className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#FCF1E1] tabular-nums">
            {orders.length}
          </div>
          <span className="text-[11px] text-amber-400 font-medium mt-1 block">
            {pendingCount} {isAr ? 'طلبات قيد المعالجة' : 'en attente de traitement'}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#1A140F] border border-stone-800/80">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">{t.admin.kpiDelivered}</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#FCF1E1] tabular-nums">
            {deliverySuccessRate}%
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Livraisons réussies avec succès</span>
        </div>

        <div className="p-4 sm:p-5 rounded-xl bg-[#1A140F] border border-stone-800/80">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">{t.admin.kpiAverageBasket}</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#FCF1E1] tabular-nums">
            {averageBasket.toLocaleString()} <span className="text-xs text-[#BA5418] font-bold">DZD</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">Par commande validée</span>
        </div>
      </div>

      {/* Tabs Navigation (Segmented Control) */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1 bg-stone-900/90 border border-stone-800 rounded-xl w-full sm:max-w-md mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 min-w-0 py-2 px-1.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-[#261D16] text-[#FCF1E1] shadow-sm border border-stone-700/80'
              : 'text-stone-400 hover:text-[#FCF1E1]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#BA5418] shrink-0" />
          <span className="truncate">{t.admin.tabOrders}</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex-1 min-w-0 py-2 px-1.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-[#261D16] text-[#FCF1E1] shadow-sm border border-stone-700/80'
              : 'text-stone-400 hover:text-[#FCF1E1]'
          }`}
        >
          <Box className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">{t.admin.tabProducts}</span>
        </button>

        <button
          onClick={() => setActiveTab('wilayas')}
          className={`flex-1 min-w-0 py-2 px-1.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'wilayas'
              ? 'bg-[#261D16] text-[#FCF1E1] shadow-sm border border-stone-700/80'
              : 'text-stone-400 hover:text-[#FCF1E1]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{t.admin.tabAnalytics}</span>
        </button>
      </div>

      {/* Tab 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.admin.searchOrders}
                className="w-full pl-9 pr-4 py-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-[#FCF1E1] placeholder-stone-500 focus:outline-none focus:border-[#BA5418]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-stone-900 border border-stone-800 text-stone-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-[#BA5418] cursor-pointer"
              >
                <option value="all">{t.admin.statusAll}</option>
                <option value="pending">{t.admin.statusPending}</option>
                <option value="confirmed">{t.admin.statusConfirmed}</option>
                <option value="shipped">{t.admin.statusShipped}</option>
                <option value="delivered">{t.admin.statusDelivered}</option>
                <option value="returned">{t.admin.statusReturned}</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-[#1A140F] border border-stone-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[11px] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Réf & Date</th>
                    <th className="py-3 px-4">{t.admin.customer}</th>
                    <th className="py-3 px-4">{t.admin.wilaya}</th>
                    <th className="py-3 px-4">Articles</th>
                    <th className="py-3 px-4">{t.admin.total}</th>
                    <th className="py-3 px-4">{t.admin.status}</th>
                    <th className="py-3 px-4 text-right">{t.admin.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/70">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-500">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-900/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-[#FCF1E1] block">{ord.orderNumber}</span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-100 block">{ord.customerName}</span>
                          <span className="text-stone-400 font-mono text-[11px]">{ord.customerPhone}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-stone-200 block">{ord.wilayaName}</span>
                          <span className="text-[11px] text-stone-500 truncate max-w-[150px] block">
                            {ord.communeAddress}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-stone-300">
                            {ord.items.length} {ord.items.length > 1 ? 'articles' : 'article'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#FCF1E1] tabular-nums">
                          {ord.total.toLocaleString()} DZD
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(ord.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={ord.status}
                              onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className="bg-stone-900 border border-stone-700 text-stone-200 text-[11px] rounded px-2 py-1 outline-none focus:border-[#BA5418] cursor-pointer"
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="returned">Retournée</option>
                            </select>

                            <button
                              onClick={() => setLastConfirmedOrder(ord)}
                              title="Voir le bon de commande"
                              className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-[#FCF1E1] transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#FCF1E1] font-serif">
                {isAr ? 'إدارة المخزون' : 'Gestion du Stock'}
              </h2>
              <p className="text-[11px] text-stone-400 mt-0.5">
                {isAr ? 'أضف منتجاً أو احذفه واضبط المخزون.' : 'Ajoutez, supprimez ou ajustez vos articles.'}
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="self-start flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#BA5418] hover:bg-[#D2702B] text-xs font-bold text-[#FCF1E1] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إضافة منتج' : 'Ajouter un article'}</span>
            </button>
          </div>

          <div className="bg-[#1A140F] border border-stone-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-xs text-stone-300">
              <thead className="bg-stone-950/80 border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4">{t.admin.productName}</th>
                  <th className="py-3 px-4">{t.admin.category}</th>
                  <th className="py-3 px-4">{t.admin.price}</th>
                  <th className="py-3 px-4">{t.admin.stock}</th>
                  <th className="py-3 px-4">{t.admin.status}</th>
                  <th className="py-3 px-4 text-right">{isAr ? 'المخزون' : 'Ajuster Stock'}</th>
                  <th className="py-3 px-4 text-right">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/70">
                {products.map((p) => {
                  const pName = isAr ? p.name.ar : p.name.fr;
                  return (
                    <tr key={p.id} className="hover:bg-stone-900/50 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={pName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-800"
                        />
                        <div>
                          <span className="font-semibold text-[#FCF1E1] block">{pName}</span>
                          <span className="text-[11px] text-[#BA5418]">{p.brand}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-300">
                        {t.categories[p.category]}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#FCF1E1] tabular-nums">
                        {p.price.toLocaleString()} DZD
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-mono font-bold ${p.stockCount < 5 ? 'text-amber-400' : 'text-stone-200'}`}>
                          {p.stockCount} pièces
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleProductStatus(p.id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                            p.inStock 
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' 
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                          }`}
                        >
                          {p.inStock ? t.product.inStock : t.product.outOfStock}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateProductStock(p.id, Math.max(0, p.stockCount - 1))}
                            className="w-7 h-7 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-semibold text-[#FCF1E1]">
                            {p.stockCount}
                          </span>
                          <button
                            onClick={() => updateProductStock(p.id, p.stockCount + 1)}
                            className="w-7 h-7 rounded bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setProductToDelete(p)}
                          title={isAr ? 'حذف المنتج' : 'Supprimer le produit'}
                          aria-label={isAr ? 'حذف المنتج' : 'Supprimer le produit'}
                          className="w-7 h-7 rounded bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-800/50 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Wilayas Analytics */}
      {activeTab === 'wilayas' && (
        <div className="space-y-6">
          <div className="bg-[#1A140F] border border-stone-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-[#FCF1E1] font-serif mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#BA5418]" />
              <span>Volume des Ventes par Wilaya (Top Destinations)</span>
            </h3>

            <div className="space-y-4">
              {wilayaStats.map(({ wilaya, orderCount, revenue }) => {
                const maxOrders = Math.max(...wilayaStats.map(s => s.orderCount), 1);
                const percent = Math.round((orderCount / maxOrders) * 100);
                return (
                  <div key={wilaya.code} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#FCF1E1]">
                        {isAr ? wilaya.nameAr : wilaya.nameFr}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-[#BA5418] tabular-nums">
                          {orderCount} {orderCount > 1 ? 'commandes' : 'commande'}
                        </span>
                        <span className="text-stone-500 ml-2">
                          ({revenue.toLocaleString()} DZD)
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#BA5418] to-amber-400 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-[#18120D] border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif mb-4">
              Ajouter un Nouveau Produit au Catalogue
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-400 font-semibold mb-1">Nom du Produit (Français)</label>
                <input
                  type="text"
                  required
                  value={newProdNameFr}
                  onChange={(e) => setNewProdNameFr(e.target.value)}
                  placeholder="ex: Veste Saharienne en Cuir"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Nom du Produit (Arabe)</label>
                <input
                  type="text"
                  value={newProdNameAr}
                  onChange={(e) => setNewProdNameAr(e.target.value)}
                  placeholder="مثال: سترة جلدية صحراوية فاخرة"
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Marque</label>
                  <input
                    type="text"
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Catégorie</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                  >
                    <option value="sneakers">Baskets & Sneakers</option>
                    <option value="shirts">Chemises</option>
                    <option value="pants">Pantalons</option>
                    <option value="jackets">Vestes</option>
                    <option value="watches">Montres</option>
                    <option value="perfumes">Parfums</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Prix (DZD)</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 font-semibold mb-1">Stock Initial</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">Tailles disponibles (séparées par virgule)</label>
                <input
                  type="text"
                  value={newProdSizes}
                  onChange={(e) => setNewProdSizes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-lg text-[#FCF1E1]"
                />
              </div>

              <div>
                <label className="block text-stone-400 font-semibold mb-1">
                  Photo du vêtement {isAr ? '( obligatoire )' : '(optionnelle)'}
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={newProdImage}
                    alt="Aperçu"
                    className="w-16 h-16 rounded-lg object-cover bg-stone-900 border border-stone-700 shrink-0"
                  />
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-200 hover:border-[#BA5418] hover:text-[#FCF1E1] cursor-pointer transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isProcessingImage}
                        className="hidden"
                      />
                      <Plus className="w-3.5 h-3.5 text-[#BA5418]" />
                      <span>{isProcessingImage ? 'Traitement...' : isAr ? 'اختر صورة' : 'Choisir une image'}</span>
                    </label>
                    <p className="text-[10px] text-stone-500 mt-1.5">
                      {isAr ? 'سيتم حفظ الصورة مع المنتج وعرضها للعملاء.' : 'L\'image sera enregistrée avec le produit et affichée aux clients.'}
                    </p>
                  </div>
                </div>
                {imageError && <p className="mt-1.5 text-[11px] text-rose-400">{imageError}</p>}
              </div>

              <div className="flex justify-end gap-2 sm:gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-[#FCF1E1]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessingImage}
                  className="px-4 py-2 rounded-lg bg-[#BA5418] text-[#FCF1E1] font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Enregistrer l'Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto bg-[#18120D] border border-stone-800 rounded-2xl p-5 sm:p-6 shadow-2xl my-auto">
            <h3 className="text-lg font-bold text-[#FCF1E1] font-serif mb-2">
              {isAr ? 'تأكيد حذف المنتج' : 'Confirmer la suppression'}
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              {isAr
                ? `سيتم حذف "${productToDelete.name.ar}" من المخزون والسلة نهائياً.`
                : `Voulez-vous vraiment supprimer « ${productToDelete.name.fr} » du stock ? L'article sera aussi retiré des paniers.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-[#FCF1E1] cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-[#FCF1E1] font-bold cursor-pointer"
              >
                {isAr ? 'حذف' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
