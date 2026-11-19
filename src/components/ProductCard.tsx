import React, { useState } from 'react';
import { ShoppingBag, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t, addToCart, setSelectedProduct, setIsCheckoutOpen } = useStore();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const isAr = language === 'ar';
  const productName = isAr ? product.name.ar : product.name.fr;
  const productDesc = isAr ? product.description.ar : product.description.fr;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, product.colors[0]?.name.fr);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleInstantOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, selectedSize, product.colors[0]?.name.fr);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group relative flex flex-col bg-[#1A140F] border border-stone-800/80 rounded-xl overflow-hidden hover:border-[#BA5418]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
    >
      {/* Image Container (65-75% visual weight) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={productName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Minimal text status tags (no candy pills) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
          {product.isNewArrival ? (
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#BA5418] bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm border border-[#BA5418]/30">
              {isAr ? 'وصل حديثاً' : 'Nouveauté'}
            </span>
          ) : <span />}

          {!product.inStock ? (
            <span className="text-[11px] font-semibold text-rose-400 bg-black/80 px-2 py-0.5 rounded backdrop-blur-sm border border-rose-500/30">
              {t.product.outOfStock}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-emerald-400 bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-500/20">
              {t.product.inStock}
            </span>
          )}
        </div>

        {/* Quick view hover icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            aria-label="View Details"
            className="w-10 h-10 rounded-full bg-stone-900/90 text-[#FCF1E1] flex items-center justify-center hover:bg-[#BA5418] hover:text-[#FCF1E1] transition-colors shadow-lg cursor-pointer"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category quiet metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-400 font-medium tracking-wider uppercase">
            <span className="text-[#BA5418]">{product.brand}</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span>{t.categories[product.category]}</span>
          </div>

          {/* Product Title */}
          <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-stone-100 group-hover:text-[#FCF1E1] line-clamp-1 transition-colors">
            {productName}
          </h3>

          {/* Description snippet */}
          <p className="mt-1 text-xs text-stone-400 line-clamp-1">
            {productDesc}
          </p>
        </div>

        {/* Price & Size Selector Row */}
        <div>
          <div className="flex items-baseline justify-between gap-2 border-t border-stone-800/80 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#FCF1E1] tabular-nums">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-[#BA5418]">
                {t.product.dzd}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-500 line-through tabular-nums">
                  {product.originalPrice.toLocaleString()} {t.product.dzd}
                </span>
              )}
            </div>

            {/* Quick Size dropdown */}
            {product.sizes.length > 1 && (
              <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="bg-stone-900 border border-stone-700 text-stone-200 text-xs rounded px-2 py-1 outline-none focus:border-[#BA5418] cursor-pointer"
                >
                  {product.sizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                !product.inStock
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : isAddedRecently
                  ? 'bg-emerald-600 text-[#FCF1E1]'
                  : 'bg-stone-800/90 hover:bg-stone-700 text-stone-200 border border-stone-700/60'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="truncate">{isAr ? 'تمت الإضافة' : 'Ajouté'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="truncate">{t.product.addToCart}</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstantOrder}
              disabled={!product.inStock}
              className={`py-2 px-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer truncate ${
                !product.inStock
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-[#BA5418] hover:bg-[#D2702B] text-[#FCF1E1] shadow-sm'
              }`}
            >
              {t.product.orderNow}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
