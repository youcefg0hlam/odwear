import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageSquareText, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    clearCart, 
    setIsCheckoutOpen,
    generateWhatsAppUrl,
    language,
    t
  } = useStore();

  if (!isCartOpen) return null;

  const isAr = language === 'ar';
  const freeShippingThreshold = 18000;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenWhatsApp = () => {
    const url = generateWhatsAppUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
      />

      <div className={`fixed inset-y-0 ${isAr ? 'left-0' : 'right-0'} max-w-full flex pl-6 sm:pl-16`}>
        <div className="w-[calc(100vw-1.5rem)] sm:w-screen max-w-md bg-[#1A130E] border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#BA5418]" />
              <h2 className="text-base sm:text-lg font-bold font-serif">{t.cart.title}</h2>
              <span className="text-xs text-stone-400">({cart.length})</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Fermer"
              className="p-1.5 rounded-lg text-stone-400 hover:text-[#FCF1E1] hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#211911] px-5 py-3 border-b border-stone-800/80">
            <div className="flex items-center justify-between text-xs text-stone-300 mb-1.5">
              <span>
                {cartSubtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-400 font-semibold">
                    {isAr ? '🎉 تهانينا! التوصيل مجاني لطلبك' : '🎉 Livraison offerte atteinte !'}
                  </span>
                ) : (
                  <span>
                    {isAr ? 'أضف ' : 'Ajoutez '}
                    <strong className="text-[#BA5418] tabular-nums">
                      {(freeShippingThreshold - cartSubtotal).toLocaleString()} {t.product.dzd}
                    </strong>
                    {isAr ? ' للاستفادة من التوصيل المجاني' : ' pour la livraison gratuite'}
                  </span>
                )}
              </span>
              <span className="text-[11px] font-semibold text-stone-400 tabular-nums">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#BA5418] to-amber-300 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-800/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-4 text-stone-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#FCF1E1] mb-1">{t.cart.emptyTitle}</h3>
                <p className="text-xs text-stone-400 mb-6 max-w-xs">{t.cart.emptySub}</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-[#BA5418] text-[#FCF1E1] font-bold text-xs uppercase tracking-wider hover:bg-[#D2702B] transition-colors cursor-pointer"
                >
                  {t.cart.explore}
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const pName = isAr ? item.product.name.ar : item.product.name.fr;
                return (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="py-4 flex gap-4">
                    <img
                      src={item.product.image}
                      alt={pName}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg object-cover bg-stone-900 shrink-0 border border-stone-800"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-[#FCF1E1] line-clamp-1">
                            {pName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            aria-label="Supprimer"
                            className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-stone-400">
                          <span className="text-[#BA5418]">{item.product.brand}</span>
                          <span>·</span>
                          <span>Taille: {item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        {/* Quantity selector */}
                        <div className="flex items-center border border-stone-800 rounded bg-stone-900 text-xs">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-[#FCF1E1] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-[#FCF1E1] font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                            className="px-2 py-0.5 text-stone-400 hover:text-[#FCF1E1] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-sm font-bold text-[#FCF1E1] tabular-nums">
                            {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                          <span className="text-[11px] text-[#BA5418] font-medium ml-1">
                            {t.product.dzd}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout actions */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-[#1C1510] space-y-3">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-stone-400">{t.cart.subtotal}</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#FCF1E1] tabular-nums">
                    {cartSubtotal.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-[#BA5418] ml-1">
                    {t.product.dzd}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t.cart.shippingEstimated}</span>
              </div>

              {/* Action 1: Cash on delivery checkout */}
              <button
                onClick={handleOpenCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.cart.checkoutCOD}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Action 2: WhatsApp direct checkout */}
              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl border border-emerald-600/50 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquareText className="w-4 h-4 text-emerald-400" />
                <span>{t.cart.checkoutWhatsApp}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
