import React, { useState } from 'react';
import { X, ShoppingBag, MessageSquareText, Shield, Truck, RefreshCw, Check, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    language, 
    t, 
    addToCart, 
    setIsCheckoutOpen,
    generateWhatsAppUrl 
  } = useStore();

  if (!selectedProduct) return null;

  const isAr = language === 'ar';
  const [activeSize, setActiveSize] = useState<string>(selectedProduct.sizes[0] || 'Standard');
  const [activeColor, setActiveColor] = useState<string>(selectedProduct.colors[0]?.name.fr || '');
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const productName = isAr ? selectedProduct.name.ar : selectedProduct.name.fr;
  const productDesc = isAr ? selectedProduct.description.ar : selectedProduct.description.fr;
  const features = isAr ? selectedProduct.features.ar : selectedProduct.features.fr;

  const handleAddToCart = () => {
    if (!selectedProduct.inStock) return;
    addToCart(selectedProduct, activeSize, activeColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleOrderNow = () => {
    if (!selectedProduct.inStock) return;
    addToCart(selectedProduct, activeSize, activeColor, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppSingle = () => {
    const singleItem = [{
      product: selectedProduct,
      selectedSize: activeSize,
      selectedColor: activeColor,
      quantity
    }];
    const url = generateWhatsAppUrl({ items: singleItem });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#18120D] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          aria-label="Fermer"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-stone-300 hover:text-[#FCF1E1] flex items-center justify-center border border-stone-700/80 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery / Image Viewport */}
          <div className="relative bg-stone-950 p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-800/80">
            <div className="relative aspect-[4/3] md:aspect-square w-full rounded-xl overflow-hidden">
              <img
                src={selectedProduct.image}
                alt={productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm border border-stone-800 px-2 py-1 rounded flex items-center gap-2 text-xs text-stone-300">
                <img src="/logo.jpeg" alt="" className="h-6 w-6 rounded object-cover bg-[#FCF1E1]" />
                <span className="text-[#BA5418] font-bold">OD WEAR</span>
              </div>
            </div>
          </div>

          {/* Product Details & Purchase Module */}
          <div className="p-4 sm:p-8 flex flex-col justify-between md:max-h-[85vh] md:overflow-y-auto">
            <div>
              {/* Brand and category meta */}
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-widest">
                <span className="text-[#BA5418]">{selectedProduct.brand}</span>
                <span className="text-stone-600">/</span>
                <span>{t.categories[selectedProduct.category]}</span>
              </div>

              {/* Title */}
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[#FCF1E1] font-serif leading-snug">
                {productName}
              </h2>

              {/* Ratings snippet */}
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-400">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span>4.9 / 5</span>
                <span className="text-stone-600">·</span>
                <span>{selectedProduct.stockCount} {t.product.limitedStock} {selectedProduct.stockCount}</span>
              </div>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-3 pb-4 border-b border-stone-800">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#FCF1E1] tabular-nums">
                  {selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#BA5418]">
                  {t.product.dzd}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-stone-500 line-through tabular-nums">
                    {selectedProduct.originalPrice.toLocaleString()} {t.product.dzd}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
                {productDesc}
              </p>

              {/* Color choices */}
              {selectedProduct.colors.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    {t.product.selectColor} : <span className="text-stone-200">{activeColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map(col => (
                      <button
                        key={col.name.fr}
                        onClick={() => setActiveColor(col.name.fr)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          activeColor === col.name.fr
                            ? 'border-[#BA5418] bg-stone-800 text-[#FCF1E1]'
                            : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:text-[#FCF1E1] hover:border-stone-700'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{isAr ? col.name.ar : col.name.fr}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes selection */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {t.product.selectSize}
                  </label>
                  <span className="text-[11px] text-stone-500">{t.product.sizesNotice}</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {selectedProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setActiveSize(size)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        activeSize === size
                          ? 'border-[#BA5418] bg-[#BA5418]/15 text-[#BA5418] shadow-sm'
                          : 'border-stone-800 bg-stone-900/80 text-stone-300 hover:border-stone-700 hover:text-[#FCF1E1]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  {isAr ? 'الكمية :' : 'Quantité :'}
                </span>
                <div className="flex items-center border border-stone-800 rounded-lg bg-stone-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-stone-400 hover:text-[#FCF1E1] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-[#FCF1E1] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-stone-400 hover:text-[#FCF1E1] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="mt-6 pt-5 border-t border-stone-800/80">
                <ul className="space-y-2 text-xs text-stone-400">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#BA5418] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTAs Action Buttons */}
            <div className="mt-8 pt-4 border-t border-stone-800 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedProduct.inStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-emerald-600 text-[#FCF1E1]'
                      : 'bg-stone-800 hover:bg-stone-700 text-[#FCF1E1] border border-stone-700'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isAr ? 'تمت الإضافة للسلة' : 'Ajouté au panier'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.product.addToCart}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleOrderNow}
                  disabled={!selectedProduct.inStock}
                  className="py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] shadow-lg transition-colors cursor-pointer"
                >
                  {t.product.orderNow}
                </button>
              </div>

              {/* Direct WhatsApp Option */}
              <button
                onClick={handleWhatsAppSingle}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-600/50 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4 text-emerald-400" />
                <span>{t.checkout.whatsappDirect}</span>
              </button>

              {/* Reassurance strip */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] text-stone-400">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#BA5418]" />
                  <span>58 Wilayas</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COD / نقداً</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-stone-300" />
                  <span>Échange 48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
