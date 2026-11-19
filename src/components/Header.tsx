import React from 'react';
import { ShoppingBag, Globe, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t, cartCount, setIsCartOpen, activeView, setActiveView } = useStore();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#100C09]/95 backdrop-blur-md border-b border-stone-800/80 transition-colors">
      {/* Top micro announcement bar */}
      <div className="bg-[#1C1510] border-b border-stone-800/50 py-1.5 px-4 text-xs text-stone-400 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#BA5418] font-semibold">58 WILAYAS</span>
            <span className="text-stone-600">·</span>
            <span className="truncate">{t.announcement}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-400">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3 h-3 text-[#BA5418]" />
              <span>Chlef Centre · 060005597</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Brand Logo */}
        <button
          onClick={() => setActiveView('store')}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          aria-label="OD WEAR — accueil"
        >
          <img
            src="/logo.jpeg"
            alt="OD WEAR"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg object-cover bg-[#FCF1E1] ring-1 ring-[#BA5418]/50 group-hover:ring-[#BA5418] transition-all"
          />
          <span className="hidden lg:block text-sm font-extrabold tracking-widest uppercase font-serif text-stone-100 group-hover:text-[#BA5418] transition-colors">
            OD <span className="text-[#BA5418] font-normal tracking-wider">WEAR</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs lg:text-sm font-medium tracking-wide">
          <button
            onClick={() => setActiveView('store')}
            className={`whitespace-nowrap cursor-pointer transition-colors pb-0.5 ${
              activeView === 'store'
                ? 'text-[#BA5418] border-b-2 border-[#BA5418]'
                : 'text-stone-300 hover:text-[#FCF1E1]'
            }`}
          >
            {t.nav.catalog}
          </button>

          <a
            href="#boutique-chlef"
            onClick={() => setActiveView('store')}
            className="text-stone-300 hover:text-[#FCF1E1] whitespace-nowrap cursor-pointer transition-colors"
          >
            {t.nav.about}
          </a>

        </nav>

        {/* Zone 3: Actions (Language toggle + Shopping Bag) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'fr' ? 'Changer en Arabe' : 'Changer en Français'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-800 bg-stone-900/80 text-stone-300 hover:text-[#FCF1E1] hover:border-stone-700 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#BA5418]" />
            <span className="uppercase">{language === 'fr' ? 'العربية' : 'Français'}</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="relative flex items-center justify-center p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 hover:border-[#BA5418] hover:text-[#BA5418] transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#BA5418] text-[#FCF1E1] font-extrabold text-[10px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
