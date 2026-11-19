import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';

export const CatalogSection: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    language, 
    t 
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const isAr = language === 'ar';

  const categoryList: { key: ProductCategory; label: string }[] = [
    { key: 'all', label: t.categories.all },
    { key: 'sneakers', label: t.categories.sneakers },
    { key: 'shirts', label: t.categories.shirts },
    { key: 'pants', label: t.categories.pants },
    { key: 'jackets', label: t.categories.jackets },
    { key: 'tracksuits', label: t.categories.tracksuits },
    { key: 'watches', label: t.categories.watches },
    { key: 'perfumes', label: t.categories.perfumes },
  ];

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        p.name.fr.toLowerCase().includes(q) ||
        p.name.ar.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.fr.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list = [...list].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog-section" className="py-12 sm:py-16 bg-[#100C09]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#BA5418] mb-1.5">
              <span>SÉLECTION VÊTEMENTS & BASKETS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#FCF1E1] font-serif">
              {isAr ? 'كتالوج المنتجات الحصرية' : 'Catalogue & Nouvelles Arrivées'}
            </h2>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.filter.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-[#FCF1E1] placeholder-stone-500 focus:outline-none focus:border-[#BA5418] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-[#FCF1E1]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Filter Tabs (Segmented functional controls) */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-800/80 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.key
                    ? 'bg-[#BA5418] text-[#FCF1E1] shadow-sm font-bold'
                    : 'bg-stone-900/80 text-stone-400 hover:text-[#FCF1E1] hover:bg-stone-800 border border-stone-800/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown & Count */}
          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <span className="text-xs text-stone-500 hidden sm:inline">
              <strong className="text-[#FCF1E1] font-mono">{filteredProducts.length}</strong> {t.filter.foundCount}
            </span>

            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#BA5418]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer text-stone-200 text-xs"
              >
                <option value="featured" className="bg-stone-900">{t.filter.sortFeatured}</option>
                <option value="newest" className="bg-stone-900">{t.filter.sortNewest}</option>
                <option value="price-asc" className="bg-stone-900">{t.filter.sortPriceAsc}</option>
                <option value="price-desc" className="bg-stone-900">{t.filter.sortPriceDesc}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid (3 columns desktop, 2 columns mobile/tablet) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#1A140F] rounded-2xl border border-stone-800 p-8">
            <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto mb-3 text-stone-500">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#FCF1E1] mb-1">
              {isAr ? 'لم نتمكن من إيجاد أي منتج يطابق بحثك' : 'Aucun produit ne correspond à votre recherche'}
            </h3>
            <p className="text-xs text-stone-400 mb-6 max-w-sm mx-auto">
              {isAr ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة.' : 'Essayez un autre mot-clé ou réinitialisez les filtres sélectionnés.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.filter.reset}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
